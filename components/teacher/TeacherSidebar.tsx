"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, MessageSquare, PlayCircle, ShieldCheck, Video, X } from "lucide-react";

import { studentProfile } from "@/data/student";
import { Teacher } from "@/data/teachers";
import {
  buildBookingId,
  parseSlotToDateTime,
  readLessonBookings,
  upsertLessonBooking
} from "@/lib/lesson-bookings";

import { SelectedScheduleSlot } from "@/components/teacher/SchedulePicker";

type TeacherSidebarProps = {
  teacher: Teacher;
  selectedSlot: SelectedScheduleSlot | null;
  bookingHrefBase?: string;
  messageHref?: string;
  bookingButtonLabel?: string;
};

type BookingNotice = {
  kind: "success" | "error";
  title: string;
  description: string;
};

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00`);

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short"
  }).format(date);
}

function createDefaultDraft(teacher: Teacher, selectedSlot: SelectedScheduleSlot | null) {
  if (!selectedSlot) {
    return `Здравствуйте! Хочу записаться на занятие по теме «${teacher.subjects[0] ?? "предмет"}».`;
  }

  return `Здравствуйте! Хочу записаться на урок ${formatDate(selectedSlot.date)} в ${selectedSlot.time}. Цель занятия: разобрать ключевые сложности по теме.`;
}

function resolveBookingLink(teacher: Teacher, selectedSlot: SelectedScheduleSlot | null, bookingHrefBase?: string) {
  const defaultBookingQuery = new URLSearchParams({ role: "student", teacher: teacher.id });
  const defaultHref = `/signup?${defaultBookingQuery.toString()}`;
  const targetHref = bookingHrefBase ?? defaultHref;

  if (!selectedSlot) {
    return targetHref;
  }

  const [pathname, rawQuery = ""] = targetHref.split("?");
  const params = new URLSearchParams(rawQuery);
  params.set("slot", `${selectedSlot.date} ${selectedSlot.time}`);

  return `${pathname}?${params.toString()}`;
}

function resolveMessageLink(teacher: Teacher, draftMessage: string, messageHref?: string) {
  const targetHref = messageHref ?? "/login";

  if (!messageHref) {
    return targetHref;
  }

  const [pathname, rawQuery = ""] = targetHref.split("?");
  const params = new URLSearchParams(rawQuery);

  if (!params.get("teacher")) {
    params.set("teacher", teacher.id);
  }

  if (draftMessage.trim()) {
    params.set("draft", draftMessage.trim());
  }

  return `${pathname}?${params.toString()}`;
}

export function TeacherSidebar({
  teacher,
  selectedSlot,
  bookingHrefBase,
  messageHref,
  bookingButtonLabel
}: TeacherSidebarProps) {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingDraft, setBookingDraft] = useState("");
  const [bookingNotice, setBookingNotice] = useState<BookingNotice | null>(null);

  const primaryLabel = bookingButtonLabel ?? "Записаться на пробный урок";
  const selectedSlotValue = selectedSlot ? `${selectedSlot.date} ${selectedSlot.time}` : "";
  const bookingLink = resolveBookingLink(teacher, selectedSlot, bookingHrefBase);
  const chatLink = resolveMessageLink(teacher, createDefaultDraft(teacher, selectedSlot), messageHref);
  const appBookingFlow = Boolean(bookingHrefBase?.startsWith("/app/lessons"));

  const bookingQueryParams = useMemo(() => {
    const rawQuery = bookingHrefBase?.split("?")[1] ?? "";
    return new URLSearchParams(rawQuery);
  }, [bookingHrefBase]);

  const bookingCourseId = bookingQueryParams.get("course") ?? "custom-course";
  const bookingSubject = bookingQueryParams.get("subject") ?? `Индивидуальный урок: ${teacher.subjects[0] ?? "предмет"}`;
  const modalMessageLink = resolveMessageLink(teacher, bookingDraft, messageHref);

  useEffect(() => {
    if (!bookingModalOpen) {
      return;
    }

    setBookingNotice(null);
    setBookingDraft(createDefaultDraft(teacher, selectedSlot));
  }, [bookingModalOpen, selectedSlot, teacher]);

  const confirmBooking = () => {
    if (!selectedSlotValue) {
      setBookingNotice({
        kind: "error",
        title: "Сначала выберите время",
        description: "Откройте вкладку «Расписание», выберите слот и повторите подтверждение."
      });
      return;
    }

    const startAt = parseSlotToDateTime(selectedSlotValue);
    if (!startAt) {
      setBookingNotice({
        kind: "error",
        title: "Ошибка формата слота",
        description: "Не удалось обработать выбранное время. Попробуйте выбрать слот снова."
      });
      return;
    }

    const bookingId = buildBookingId({
      teacherId: teacher.id,
      courseId: bookingCourseId,
      slot: selectedSlotValue
    });

    try {
      const now = new Date().toISOString();
      const existing = readLessonBookings().find((item) => item.id === bookingId);

      upsertLessonBooking({
        id: bookingId,
        courseId: bookingCourseId,
        teacherId: teacher.id,
        teacherName: teacher.name,
        studentName: studentProfile.name,
        subject: bookingSubject,
        slot: selectedSlotValue,
        startAt,
        durationMinutes: 60,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        status: "pending",
        amountRubles: teacher.pricePerHour,
        studentMessage: bookingDraft.trim() || createDefaultDraft(teacher, selectedSlot),
        teacherMessage: undefined,
        proposedSlot: undefined,
        source: "teacher_profile"
      });

      setBookingNotice({
        kind: "success",
        title: existing ? "Заявка уже отправлена" : "Заявка отправлена преподавателю",
        description: existing
          ? "Этот слот уже находится в обработке. Проверяйте статус в разделе «Занятия»."
          : `Ожидайте подтверждения в личном кабинете. Слот: ${
              selectedSlot ? `${formatDate(selectedSlot.date)} в ${selectedSlot.time}` : selectedSlotValue
            }.`
      });
    } catch {
      setBookingNotice({
        kind: "error",
        title: "Не удалось сохранить запись",
        description: "Повторите попытку. Если ошибка сохранится, перезагрузите страницу."
      });
    }
  };

  return (
    <aside className="space-y-4 xl:sticky xl:top-28 xl:self-start">
      <section className="rounded-[1.6rem] border border-border bg-white p-5 shadow-card">
        <p className="text-sm font-semibold text-foreground">Видео-превью урока</p>

        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              type="button"
              aria-label="Открыть видео-превью"
              className="group relative mt-3 block w-full overflow-hidden rounded-2xl border border-border"
            >
              <Image
                src={teacher.videoPreviewUrl ?? "/classroom-preview.svg"}
                alt="Превью онлайн-урока"
                width={900}
                height={560}
                className="h-44 w-full object-cover"
              />
              <span className="absolute inset-0 bg-slate-950/25 transition group-hover:bg-slate-950/35" aria-hidden="true" />
              <span className="absolute inset-0 grid place-items-center" aria-hidden="true">
                <PlayCircle className="h-12 w-12 text-white" />
              </span>
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-[70] bg-slate-950/70" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-[71] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-white p-4 shadow-soft sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-2">
                <Dialog.Title className="inline-flex items-center gap-2 text-base font-semibold text-foreground">
                  <Video className="h-4 w-4 text-primary" aria-hidden="true" />
                  Превью онлайн-урока
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Закрыть окно"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="rounded-2xl border border-border bg-slate-50 p-3">
                <Image
                  src={teacher.videoPreviewUrl ?? "/classroom-preview.svg"}
                  alt="Демонстрация урока"
                  width={1200}
                  height={760}
                  className="h-auto w-full rounded-xl"
                />
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                В демо показан интерфейс урока: видеосвязь, чат, интерактивная доска и учебные материалы в одном окне.
              </p>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <div className="mt-4 rounded-2xl border border-border bg-slate-50 p-4">
          <p className="text-xs text-muted-foreground">Стоимость урока</p>
          <p className="mt-1 text-3xl font-semibold text-foreground">{teacher.pricePerHour.toLocaleString("ru-RU")} ₽/час</p>

          {selectedSlot ? (
            <p className="mt-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary">
              Выбрано время: {formatDate(selectedSlot.date)}, {selectedSlot.time}
            </p>
          ) : (
            <p className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
              Сначала выберите слот во вкладке «Расписание».
            </p>
          )}

          <div className="mt-4 grid gap-2">
            {appBookingFlow ? (
              <Dialog.Root open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
                <Dialog.Trigger asChild>
                  <button
                    type="button"
                    disabled={!selectedSlot}
                    className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {primaryLabel}
                  </button>
                </Dialog.Trigger>

                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 z-[72] bg-slate-950/70" />
                  <Dialog.Content className="fixed left-1/2 top-1/2 z-[73] w-[calc(100%-2rem)] max-h-[88vh] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-border bg-white p-5 shadow-soft sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Dialog.Title className="text-lg font-semibold text-foreground">Отправка заявки на урок</Dialog.Title>
                        <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                          Проверьте данные слота и добавьте сообщение преподавателю. После отправки ожидайте подтверждения.
                        </Dialog.Description>
                      </div>

                      <Dialog.Close asChild>
                        <button
                          type="button"
                          aria-label="Закрыть окно подтверждения"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-muted-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <div className="mt-4 grid gap-2 rounded-2xl border border-border bg-slate-50 p-3 text-sm">
                      <p className="font-semibold text-foreground">{teacher.name}</p>
                      <p className="text-muted-foreground">{teacher.subjects.join(" • ")}</p>
                      <p className="text-muted-foreground">
                        Слот:{" "}
                        <span className="font-semibold text-foreground">
                          {selectedSlot ? `${formatDate(selectedSlot.date)} в ${selectedSlot.time}` : "не выбран"}
                        </span>
                      </p>
                      <p className="text-muted-foreground">
                        Стоимость: <span className="font-semibold text-foreground">{teacher.pricePerHour.toLocaleString("ru-RU")} ₽/час</span>
                      </p>
                    </div>

                    <label className="mt-4 block">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Сообщение преподавателю
                      </span>
                      <textarea
                        value={bookingDraft}
                        onChange={(event) => setBookingDraft(event.target.value)}
                        rows={4}
                        className="w-full rounded-2xl border border-border bg-slate-50 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                        placeholder="Укажите цель урока, уровень и вопросы к занятию."
                      />
                    </label>

                    {bookingNotice ? (
                      <div
                        className={`mt-4 rounded-2xl border px-3 py-2 text-sm ${
                          bookingNotice.kind === "success"
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                            : "border-rose-300 bg-rose-50 text-rose-800"
                        }`}
                      >
                        <p className="font-semibold">{bookingNotice.title}</p>
                        <p className="mt-1">{bookingNotice.description}</p>
                      </div>
                    ) : null}

                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={confirmBooking}
                        className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                      >
                        <CheckCircle2 className="mr-1.5 h-4 w-4" />
                        Отправить заявку
                      </button>
                      <Link
                        href={modalMessageLink}
                        className="inline-flex items-center justify-center rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground"
                      >
                        <MessageSquare className="mr-1.5 h-4 w-4 text-primary" />
                        Отправить сообщение
                      </Link>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            ) : (
              <Link
                href={bookingLink}
                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                {primaryLabel}
              </Link>
            )}

            <Link
              href={chatLink}
              className="inline-flex items-center justify-center rounded-full border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground"
            >
              Написать сообщение
            </Link>
          </div>
        </div>

        <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
          <li className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            {teacher.bookedLast48h} бронирований за 48 часов
          </li>
          <li className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-primary" aria-hidden="true" />
            Среднее время ответа: {teacher.responseTimeHours} ч
          </li>
        </ul>
      </section>
    </aside>
  );
}
