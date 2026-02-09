"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { LessonCalendar } from "@/components/lessons/LessonCalendar";
import { LessonCard } from "@/components/lessons/LessonCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { lessons, StudentLesson } from "@/data/lessons";
import { getTeacherById } from "@/data/teachers";
import { useLessonCalendar } from "@/hooks/useLessonCalendar";

type LessonTab = "upcoming" | "completed";

type LessonsPageClientProps = {
  selectedCourse?: string;
  selectedTeacher?: string;
  selectedSlot?: string;
  selectedSubject?: string;
  selectedBookingId?: string;
};

type DemoBooking = {
  id: string;
  courseId: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  slot: string;
  startAt: string;
  durationMinutes: number;
  createdAt: string;
};

const BOOKINGS_STORAGE_KEY = "student-bookings-v1";

function parseSlotToDateTime(slot: string) {
  const match = slot.trim().match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})$/);

  if (!match) {
    return null;
  }

  const [, datePart, timePart] = match;
  return `${datePart}T${timePart}:00+03:00`;
}

function formatSlotLabel(slot: string) {
  const isoValue = parseSlotToDateTime(slot);

  if (!isoValue) {
    return slot;
  }

  const label = new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(isoValue));

  return label.replace(/^[A-Za-zА-Яа-яЁё]/, (first) => first.toLowerCase());
}

function buildBookingId(params: { teacherId: string; slot: string; courseId?: string }) {
  const coursePart = params.courseId ?? "custom";
  return `${params.teacherId}__${coursePart}__${params.slot.replace(/\s+/g, "_").replace(/:/g, "-")}`;
}

function bookingToLesson(booking: DemoBooking): StudentLesson {
  return {
    id: `booked-${booking.id}`,
    courseId: booking.courseId,
    subject: booking.subject,
    teacherId: booking.teacherId,
    teacherName: booking.teacherName,
    startAt: booking.startAt,
    durationMinutes: booking.durationMinutes,
    status: "upcoming",
    joinUrl: `/app/lessons?booking=${encodeURIComponent(booking.id)}`,
    chatThreadId: `thread-${booking.teacherId}`,
    summarySnippet: "Это запланированный урок. После занятия здесь появится ИИ-конспект.",
    transcriptSnippet: "Расшифровка станет доступна после завершения урока.",
    recommendations: ["Подготовьте вопросы к уроку", "Пройдите мини-тренажер перед занятием"],
    files: []
  };
}

function sortLessonsByStatus(list: StudentLesson[], activeTab: LessonTab) {
  const sorted = [...list].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  return activeTab === "upcoming" ? sorted : sorted.reverse();
}

export function LessonsPageClient({
  selectedCourse,
  selectedTeacher,
  selectedSlot,
  selectedSubject,
  selectedBookingId
}: LessonsPageClientProps) {
  const [activeTab, setActiveTab] = useState<LessonTab>("upcoming");
  const [bookings, setBookings] = useState<DemoBooking[]>([]);

  const teacher = selectedTeacher ? getTeacherById(selectedTeacher) : undefined;
  const bookingDraft = selectedSlot
    ? `Здравствуйте! Хочу записаться на урок ${selectedSlot}.`
    : "Здравствуйте! Хочу уточнить ближайшие слоты для занятия.";

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as DemoBooking[];
      if (Array.isArray(parsed)) {
        setBookings(parsed);
      }
    } catch {
      setBookings([]);
    }
  }, []);

  const candidateBooking = useMemo(() => {
    if (!selectedTeacher || !selectedSlot) {
      return null;
    }

    const startAt = parseSlotToDateTime(selectedSlot);
    if (!startAt) {
      return null;
    }

    const teacherData = getTeacherById(selectedTeacher);
    const teacherName = teacherData?.name ?? "Преподаватель";

    return {
      id: buildBookingId({ teacherId: selectedTeacher, slot: selectedSlot, courseId: selectedCourse }),
      courseId: selectedCourse ?? "custom-course",
      teacherId: selectedTeacher,
      teacherName,
      subject: selectedSubject ?? teacherData?.subjects[0] ?? "Индивидуальный урок",
      slot: selectedSlot,
      startAt,
      durationMinutes: 60,
      createdAt: new Date().toISOString()
    } satisfies DemoBooking;
  }, [selectedCourse, selectedSlot, selectedSubject, selectedTeacher]);

  const isCandidateAlreadyBooked = useMemo(() => {
    if (!candidateBooking) {
      return false;
    }

    return bookings.some((item) => item.id === candidateBooking.id);
  }, [bookings, candidateBooking]);

  const selectedBooking = useMemo(() => {
    if (!selectedBookingId) {
      return undefined;
    }

    return bookings.find((booking) => booking.id === selectedBookingId);
  }, [bookings, selectedBookingId]);

  const bookingLessons = useMemo(() => bookings.map(bookingToLesson), [bookings]);

  const baseLessons = useMemo(() => {
    const targetStatus = activeTab === "upcoming" ? "upcoming" : "completed";
    const allLessons = [...lessons, ...bookingLessons];

    return allLessons
      .filter((lesson) => lesson.status === targetStatus)
      .filter((lesson) => (selectedCourse ? lesson.courseId === selectedCourse : true))
      .filter((lesson) => (selectedTeacher ? lesson.teacherId === selectedTeacher : true));
  }, [activeTab, bookingLessons, selectedCourse, selectedTeacher]);

  const { currentMonth, setCurrentMonth, selectedDay, setSelectedDay, lessonDays, daysInMonth, filteredByDay } =
    useLessonCalendar(baseLessons);

  const lessonsList = useMemo(() => sortLessonsByStatus(filteredByDay, activeTab), [activeTab, filteredByDay]);

  const confirmBooking = () => {
    if (!candidateBooking || isCandidateAlreadyBooked) {
      return;
    }

    setBookings((prev) => {
      const next = [...prev, candidateBooking];
      window.localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setActiveTab("upcoming");
  };

  const cancelSelectedBooking = () => {
    if (!selectedBooking) {
      return;
    }

    setBookings((prev) => {
      const next = prev.filter((booking) => booking.id !== selectedBooking.id);
      window.localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4">
        <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <h1 className="text-3xl font-semibold text-foreground">Занятия</h1>
          <p className="mt-1 text-sm text-muted-foreground">Планируйте расписание, подтверждайте запись и подключайтесь к урокам вовремя</p>
          <p className="mt-2 rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
            Запись фиксирует место в слоте преподавателя. После подтверждения слот попадает в список предстоящих занятий.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === "upcoming" ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
              }`}
            >
              Предстоящие
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === "completed" ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
              }`}
            >
              Прошедшие
            </button>
          </div>

          {selectedCourse ? (
            <p className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-medium text-primary">
              Показаны занятия по выбранному курсу. Чтобы увидеть все, откройте раздел без параметров фильтра.
            </p>
          ) : null}

          {selectedTeacher ? (
            <p className="mt-3 rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-medium text-primary">
              Показаны занятия преподавателя: {teacher?.name ?? "выбранный преподаватель"}.
            </p>
          ) : null}

          {candidateBooking ? (
            <div className="mt-3 rounded-2xl border border-accent/60 bg-accent/30 p-3">
              <p className="text-xs font-semibold text-slate-900">
                Выбран слот: {formatSlotLabel(candidateBooking.slot)}
              </p>
              <p className="mt-1 text-xs text-slate-800">
                Преподаватель: {candidateBooking.teacherName}. Подтвердите запись, чтобы слот появился в расписании.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={confirmBooking}
                  disabled={isCandidateAlreadyBooked}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {isCandidateAlreadyBooked ? "Слот уже забронирован" : "Подтвердить запись (демо)"}
                </button>
                <Link
                  href={`/app/messages?teacher=${encodeURIComponent(candidateBooking.teacherId)}&draft=${encodeURIComponent(bookingDraft)}`}
                  className="inline-flex items-center justify-center rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground"
                >
                  Написать преподавателю
                </Link>
              </div>
            </div>
          ) : null}

          {selectedBooking ? (
            <div className="mt-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-900">
              <p className="font-semibold">Бронь подтверждена: {formatSlotLabel(selectedBooking.slot)}</p>
              <p className="mt-1">Слот уже добавлен в раздел «Предстоящие». Перед уроком будет доступна кнопка входа.</p>
              <button
                type="button"
                onClick={cancelSelectedBooking}
                className="mt-2 inline-flex rounded-full border border-emerald-400 bg-white px-3 py-1.5 font-semibold text-emerald-900"
              >
                Отменить бронь (демо)
              </button>
            </div>
          ) : null}
        </section>

        <LessonCalendar
          currentMonth={currentMonth}
          onPrevMonth={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
          onNextMonth={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          lessonDays={lessonDays}
          daysInMonth={daysInMonth}
        />
      </div>

      <section className="space-y-3">
        <div className="rounded-3xl border border-border bg-white p-4 shadow-card">
          <p className="text-sm text-muted-foreground">
            {selectedDay ? "Фильтр по дате включен" : "Показаны все занятия"}. Найдено уроков: {lessonsList.length}
          </p>
        </div>

        {lessonsList.length === 0 ? (
          <EmptyState
            title="Занятий не найдено"
            description="Попробуйте переключить вкладку или сбросить фильтр по дате."
            actionLabel="Сбросить фильтр"
            actionHref="/app/lessons"
          />
        ) : (
          lessonsList.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)
        )}
      </section>
    </div>
  );
}
