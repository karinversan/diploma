"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Sparkles,
  Star,
  UserRound,
  X
} from "lucide-react";

import { StudentCourse } from "@/data/courses";
import { teachers, Teacher } from "@/data/teachers";
import {
  buildBookingId,
  buildSlotKey,
  parseSlotToDateTime,
  readLessonBookings
} from "@/lib/lesson-bookings";
import { createBookingEventViaApi, syncBookingsFromApi, upsertBookingViaApi } from "@/lib/api/bookings-client";
import { sendMessageToSharedChatThreadViaApi } from "@/lib/api/chat-threads-client";
import { studentProfile } from "@/data/student";
import { cn } from "@/lib/utils";

const categoryKeywords: Record<string, string[]> = {
  Языки: ["язык", "англий", "немец", "француз", "корей", "разговор"],
  Программирование: ["программ", "python", "код", "алгоритм", "разработ"],
  Математика: ["математ", "алгебр", "геометр", "физик", "хим", "биолог"],
  Бизнес: ["бизнес", "эконом", "финанс", "менедж", "аналит"],
  Дизайн: ["дизайн", "визуал", "презента", "ui", "ux"]
};

type LiveLessonBookingDialogProps = {
  course: StudentCourse;
};

type SlotOption = {
  date: string;
  time: string;
  slotValue: string;
  slotKey: string;
  dateLabel: string;
};

type BookingFeedback = {
  title: string;
  description: string;
  isSuccess: boolean;
};

function normalize(value: string) {
  return value.toLowerCase().replaceAll("ё", "е");
}

function getCourseKeywords(course: StudentCourse) {
  const defaults = categoryKeywords[course.category] ?? ["обучение", "практика"];
  const titleTokens = normalize(course.title)
    .split(/[^a-zA-Zа-яА-Я0-9]+/)
    .filter((token) => token.length >= 4);

  return Array.from(new Set([...defaults, ...titleTokens.slice(0, 6)]));
}

function getTeacherScore(teacher: Teacher, keywords: string[]) {
  const subjectText = normalize(teacher.subjects.join(" "));
  const profileText = normalize(`${teacher.title} ${teacher.bio} ${teacher.intro}`);

  let subjectHits = 0;
  let profileHits = 0;

  for (const keyword of keywords) {
    if (subjectText.includes(keyword)) {
      subjectHits += 1;
      continue;
    }

    if (profileText.includes(keyword)) {
      profileHits += 1;
    }
  }

  const score = subjectHits * 6 + profileHits * 2 + (teacher.availableToday ? 2 : 0) + teacher.rating;

  return { score, subjectHits, profileHits };
}

function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "2-digit",
    month: "long"
  }).format(new Date(`${date}T12:00:00+03:00`));
}

function groupSlotsByDate(slots: SlotOption[]) {
  const grouped = new Map<string, SlotOption[]>();

  for (const slot of slots) {
    const list = grouped.get(slot.date) ?? [];
    list.push(slot);
    grouped.set(slot.date, list);
  }

  return Array.from(grouped.entries()).map(([date, list]) => ({
    date,
    dateLabel: list[0]?.dateLabel ?? formatDateLabel(date),
    slots: list
  }));
}

export function LiveLessonBookingDialog({ course }: LiveLessonBookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [selectedSlotKey, setSelectedSlotKey] = useState<string>("");
  const [bookedSlotKeys, setBookedSlotKeys] = useState<Set<string>>(new Set());
  const [bookingFeedback, setBookingFeedback] = useState<BookingFeedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const matchedTeachers = useMemo(() => {
    const keywords = getCourseKeywords(course);

    const ranked = teachers
      .map((teacher) => {
        const stats = getTeacherScore(teacher, keywords);
        return { teacher, ...stats };
      })
      .sort((a, b) => b.score - a.score);

    const strongMatches = ranked.filter((item) => item.subjectHits > 0);
    const fallback = ranked.filter((item) => item.subjectHits === 0).slice(0, 3);
    const finalList = (strongMatches.length > 0 ? strongMatches : ranked).slice(0, 8);
    const mixed = [...finalList, ...fallback];

    return Array.from(new Map(mixed.map((item) => [item.teacher.id, item])).values());
  }, [course]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setBookingFeedback(null);
    let cancelled = false;

    const assignBookedKeys = (parsed: ReturnType<typeof readLessonBookings>) => {
      const keys = new Set(
        parsed
          .filter(
            (item) =>
              item.status === "pending" ||
              item.status === "awaiting_payment" ||
              item.status === "paid" ||
              item.status === "reschedule_proposed"
          )
          .map((item) => buildSlotKey(item.teacherId, item.slot))
      );
      if (!cancelled) {
        setBookedSlotKeys(keys);
      }
    };

    assignBookedKeys(readLessonBookings());

    void (async () => {
      const parsed = await syncBookingsFromApi();
      assignBookedKeys(parsed);
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (matchedTeachers.length === 0) {
      setSelectedTeacherId("");
      return;
    }

    if (!matchedTeachers.some((item) => item.teacher.id === selectedTeacherId)) {
      setSelectedTeacherId(matchedTeachers[0]?.teacher.id ?? "");
    }
  }, [matchedTeachers, selectedTeacherId]);

  const selectedTeacher = useMemo(
    () => matchedTeachers.find((item) => item.teacher.id === selectedTeacherId),
    [matchedTeachers, selectedTeacherId]
  );

  const availableSlots = useMemo(() => {
    if (!selectedTeacher) {
      return [];
    }

    const now = Date.now();

    return selectedTeacher.teacher.scheduleSlots
      .flatMap((slot) =>
        slot.times.map((time) => {
          const slotValue = `${slot.date} ${time}`;
          const slotKey = buildSlotKey(selectedTeacher.teacher.id, slotValue);
          const dateTime = new Date(`${slot.date}T${time}:00+03:00`).getTime();

          return {
            date: slot.date,
            time,
            slotValue,
            slotKey,
            dateLabel: formatDateLabel(slot.date),
            dateTime
          };
        })
      )
      .filter((slot) => slot.dateTime > now - 30 * 60 * 1000)
      .filter((slot) => !bookedSlotKeys.has(slot.slotKey))
      .sort((a, b) => a.dateTime - b.dateTime)
      .slice(0, 18)
      .map(({ date, time, slotKey, slotValue, dateLabel }) => ({ date, time, slotKey, slotValue, dateLabel }));
  }, [bookedSlotKeys, selectedTeacher]);

  const groupedSlots = useMemo(() => groupSlotsByDate(availableSlots), [availableSlots]);

  useEffect(() => {
    setSelectedSlotKey("");
  }, [selectedTeacherId]);

  const selectedSlot = useMemo(
    () => availableSlots.find((slot) => slot.slotKey === selectedSlotKey),
    [availableSlots, selectedSlotKey]
  );

  const confirmBookingInModal = async () => {
    if (!selectedTeacher || !selectedSlot) {
      return;
    }

    const startAt = parseSlotToDateTime(selectedSlot.slotValue);
    if (!startAt) {
      setBookingFeedback({
        title: "Не удалось обработать слот",
        description: "Попробуйте выбрать другое время или обновить окно.",
        isSuccess: false
      });
      return;
    }

    const bookingId = buildBookingId({
      teacherId: selectedTeacher.teacher.id,
      courseId: course.id,
      slot: selectedSlot.slotValue
    });

    try {
      setIsSubmitting(true);
      const now = new Date().toISOString();
      const parsed = await syncBookingsFromApi();
      const existing = parsed.find((item) => item.id === bookingId);

      await upsertBookingViaApi({
        id: bookingId,
        courseId: course.id,
        teacherId: selectedTeacher.teacher.id,
        teacherName: selectedTeacher.teacher.name,
        studentId: studentProfile.id,
        studentName: studentProfile.name,
        subject: course.title,
        slot: selectedSlot.slotValue,
        startAt,
        durationMinutes: 60,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        status: "pending",
        amountRubles: selectedTeacher.teacher.pricePerHour,
        studentMessage: `Хочу записаться на созвон по курсу «${course.title}».`,
        teacherMessage: undefined,
        proposedSlot: undefined,
        source: "course_dialog"
      });

      if (!existing) {
        await createBookingEventViaApi({
          bookingId,
          actor: "student",
          action: "booking_created",
          title: "Заявка отправлена",
          description: `Создана заявка на слот ${selectedSlot.dateLabel} в ${selectedSlot.time}.`
        });

        await sendMessageToSharedChatThreadViaApi({
          teacherId: selectedTeacher.teacher.id,
          teacherName: selectedTeacher.teacher.name,
          teacherAvatarUrl: selectedTeacher.teacher.avatarUrl,
          studentId: studentProfile.id,
          studentName: studentProfile.name,
          studentAvatarUrl: studentProfile.avatarUrl,
          subject: course.category,
          courseTitle: course.title,
          sender: "student",
          text: `Здравствуйте! Отправил(а) заявку на созвон по курсу «${course.title}» на ${selectedSlot.dateLabel} в ${selectedSlot.time}.`
        });
      }

      setBookedSlotKeys((prev) => {
        const nextSet = new Set(prev);
        nextSet.add(selectedSlot.slotKey);
        return nextSet;
      });
      setSelectedSlotKey("");

      setBookingFeedback({
        title: existing ? "Заявка уже создана" : "Заявка отправлена преподавателю",
        description: existing
          ? "Эта заявка уже в работе. Проверяйте статус в разделе «Занятия»."
          : `Преподаватель: ${selectedTeacher.teacher.name}, время: ${selectedSlot.dateLabel} в ${selectedSlot.time}. Статус заявки: «Ожидает подтверждения».`,
        isSuccess: true
      });
    } catch {
      setBookingFeedback({
        title: "Не удалось сохранить запись",
        description: "Повторите попытку. Если ошибка повторится — перезагрузите страницу.",
        isSuccess: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
        >
          <CalendarDays className="h-4 w-4" />
          Подобрать преподавателя и слот
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-slate-950/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[71] w-[calc(100%-2rem)] max-h-[88vh] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-border bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="text-xl font-semibold text-foreground">Запись на созвон по курсу</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                Мы автоматически подобрали преподавателей по направлению «{course.category}».
              </Dialog.Description>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:text-foreground"
                aria-label="Закрыть окно выбора слота"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-3 rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
            Тема созвона: <span className="font-semibold text-foreground">{course.title}</span>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-2xl border border-border bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Рекомендованные преподаватели</p>
              <div className="mt-3 space-y-2">
                {matchedTeachers.map((item) => {
                  const active = item.teacher.id === selectedTeacherId;
                  const freeSlotsCount = item.teacher.scheduleSlots.reduce((count, slot) => {
                    const available = slot.times.filter((time) => {
                      const key = buildSlotKey(item.teacher.id, `${slot.date} ${time}`);
                      return !bookedSlotKeys.has(key);
                    });
                    return count + available.length;
                  }, 0);

                  return (
                    <button
                      key={item.teacher.id}
                      type="button"
                      onClick={() => {
                        setSelectedTeacherId(item.teacher.id);
                        setBookingFeedback(null);
                      }}
                      className={cn(
                        "w-full rounded-xl border bg-white px-3 py-2 text-left transition",
                        active ? "border-primary/40 ring-2 ring-primary/20" : "border-border hover:border-primary/30"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">{item.teacher.name}</p>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {item.teacher.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.teacher.subjects.join(" • ")}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                        <span className="rounded-full border border-border bg-slate-50 px-2 py-0.5">
                          {item.teacher.pricePerHour} ₽ / час
                        </span>
                        <span className="rounded-full border border-border bg-slate-50 px-2 py-0.5">
                          Свободных слотов: {freeSlotsCount}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">Свободные слоты</p>
                {selectedTeacher ? (
                  <span className="text-xs text-muted-foreground">Преподаватель: {selectedTeacher.teacher.name}</span>
                ) : null}
              </div>

              {groupedSlots.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {groupedSlots.map((group) => (
                    <div key={group.date} className="rounded-xl border border-border bg-slate-50 p-2.5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.dateLabel}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {group.slots.map((slot) => (
                          <button
                            key={slot.slotKey}
                            type="button"
                            onClick={() => {
                              setSelectedSlotKey(slot.slotKey);
                              setBookingFeedback(null);
                            }}
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                              selectedSlotKey === slot.slotKey
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-white text-foreground hover:border-primary/40"
                            )}
                          >
                            <Clock3 className="h-3.5 w-3.5" />
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 rounded-xl border border-dashed border-border bg-slate-50 px-3 py-4 text-sm text-muted-foreground">
                  У выбранного преподавателя нет свободных слотов в ближайшие дни. Выберите другого преподавателя.
                </div>
              )}

              {selectedSlot ? (
                <div className="mt-3 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                  <p className="font-semibold">Выбран слот: {selectedSlot.dateLabel} в {selectedSlot.time}</p>
                  <p className="mt-1">Нажмите «Отправить заявку». Страница останется открытой, а статус появится в разделе «Занятия».</p>
                </div>
              ) : null}
            </section>
          </div>

          {bookingFeedback ? (
            <section
              className={cn(
                "mt-4 rounded-2xl border px-4 py-3 text-sm",
                bookingFeedback.isSuccess
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-rose-300 bg-rose-50 text-rose-800"
              )}
            >
              <p className="font-semibold">{bookingFeedback.title}</p>
              <p className="mt-1">{bookingFeedback.description}</p>
            </section>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
            <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Подбор учитывает направление курса, предметы преподавателя и доступность.
            </p>
            <div className="flex flex-wrap gap-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground"
                >
                  Закрыть
                </button>
              </Dialog.Close>

              {selectedTeacher && selectedSlot ? (
                <button
                  type="button"
                  onClick={confirmBookingInModal}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isSubmitting ? "Отправляем..." : "Отправить заявку"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground opacity-60"
                >
                  <UserRound className="h-3.5 w-3.5" />
                  Выберите слот
                </button>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
