"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";

import { LessonCalendar } from "@/components/lessons/LessonCalendar";
import { LessonCard } from "@/components/lessons/LessonCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { lessons, StudentLesson } from "@/data/lessons";
import { studentProfile } from "@/data/student";
import { getTeacherById } from "@/data/teachers";
import { useLessonCalendar } from "@/hooks/useLessonCalendar";
import {
  buildBookingId,
  formatBookingSlotLabel,
  LessonBookingRequest,
  parseSlotToDateTime,
  readLessonBookings
} from "@/lib/lesson-bookings";
import { BookingEvent, readBookingEvents } from "@/lib/booking-events";
import {
  createBookingEventViaApi,
  syncBookingEventsFromApi,
  syncBookingsFromApi,
  updateBookingViaApi,
  upsertBookingViaApi
} from "@/lib/api/bookings-client";
import { sendMessageToSharedChatThread } from "@/lib/chat-threads";
import { STORAGE_SYNC_EVENT } from "@/lib/storage-sync";
import { cn } from "@/lib/utils";

type LessonTab = "upcoming" | "completed";

type LessonsPageClientProps = {
  selectedCourse?: string;
  selectedTeacher?: string;
  selectedSlot?: string;
  selectedSubject?: string;
  selectedBookingId?: string;
};

type InlineNotice = {
  kind: "success" | "error" | "info";
  title: string;
  description: string;
};

type BookingTimelineItem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  tone: "neutral" | "primary" | "success" | "danger";
};

function bookingToLesson(booking: LessonBookingRequest): StudentLesson {
  const lessonTime = new Date(booking.startAt).getTime();
  const now = Date.now();
  const status: StudentLesson["status"] = lessonTime >= now ? "upcoming" : "completed";

  return {
    id: `booked-${booking.id}`,
    courseId: booking.courseId,
    subject: booking.subject,
    teacherId: booking.teacherId,
    teacherName: booking.teacherName,
    startAt: booking.startAt,
    durationMinutes: booking.durationMinutes,
    status,
    joinUrl: `/app/lessons?booking=${encodeURIComponent(booking.id)}`,
    chatThreadId: `thread-${booking.teacherId}-${booking.studentId ?? studentProfile.id}`,
    summarySnippet: "Для забронированных уроков ИИ-конспект появится после завершения занятия.",
    transcriptSnippet: "Транскрипт формируется автоматически после урока.",
    recommendations: ["Подготовьте 2–3 вопроса к занятию", "Откройте модуль перед уроком для быстрого повторения"],
    files: []
  };
}

function sortLessonsByStatus(list: StudentLesson[], activeTab: LessonTab) {
  const sorted = [...list].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  return activeTab === "upcoming" ? sorted : sorted.reverse();
}

function getStatusBadge(status: LessonBookingRequest["status"]) {
  if (status === "pending") {
    return { label: "Ожидает подтверждения", className: "border-amber-300 bg-amber-50 text-amber-800" };
  }
  if (status === "awaiting_payment") {
    return { label: "Ожидает оплаты", className: "border-primary/30 bg-primary/10 text-primary" };
  }
  if (status === "paid") {
    return { label: "Оплачено", className: "border-emerald-300 bg-emerald-50 text-emerald-800" };
  }
  if (status === "reschedule_proposed") {
    return { label: "Предложен перенос", className: "border-primary/30 bg-primary/10 text-primary" };
  }
  if (status === "declined") {
    return { label: "Отклонено", className: "border-rose-300 bg-rose-50 text-rose-700" };
  }
  if (status === "cancelled") {
    return { label: "Отменено", className: "border-slate-300 bg-slate-100 text-slate-700" };
  }
  return { label: "Подтверждено", className: "border-emerald-300 bg-emerald-50 text-emerald-800" };
}

function formatTimelineDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "сейчас";
  }

  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");
  return `${day}.${month} ${hours}:${minutes}`;
}

function buildBookingTimeline(booking: LessonBookingRequest): BookingTimelineItem[] {
  const timeline: BookingTimelineItem[] = [
    {
      id: `${booking.id}-created`,
      title: "Заявка отправлена",
      description: `Слот: ${formatBookingSlotLabel(booking.slot)}.`,
      createdAt: booking.createdAt,
      tone: "neutral"
    }
  ];

  if (booking.status === "reschedule_proposed") {
    timeline.push({
      id: `${booking.id}-reschedule`,
      title: "Предложен перенос",
      description: booking.proposedSlot
        ? `Новый слот: ${formatBookingSlotLabel(booking.proposedSlot)}.`
        : booking.teacherMessage ?? "Преподаватель предложил перенос.",
      createdAt: booking.updatedAt,
      tone: "primary"
    });
  }

  if (booking.status === "awaiting_payment") {
    timeline.push({
      id: `${booking.id}-approved`,
      title: "Слот подтвержден преподавателем",
      description: booking.teacherMessage ?? "Оплатите урок для фиксации в расписании.",
      createdAt: booking.updatedAt,
      tone: "primary"
    });
  }

  if (booking.status === "paid") {
    timeline.push({
      id: `${booking.id}-approved`,
      title: "Слот подтвержден",
      description: booking.teacherMessage ?? "Урок подтвержден преподавателем.",
      createdAt: booking.updatedAt,
      tone: "primary"
    });
    timeline.push({
      id: `${booking.id}-paid`,
      title: "Оплата прошла успешно",
      description: "Занятие добавлено в календарь.",
      createdAt: booking.paidAt ?? booking.updatedAt,
      tone: "success"
    });
  }

  if (booking.status === "declined") {
    timeline.push({
      id: `${booking.id}-declined`,
      title: "Заявка отклонена",
      description: booking.teacherMessage ?? "Преподаватель отклонил выбранный слот.",
      createdAt: booking.updatedAt,
      tone: "danger"
    });
  }

  if (booking.status === "cancelled") {
    timeline.push({
      id: `${booking.id}-cancelled`,
      title: "Заявка отменена",
      description: booking.teacherMessage ?? "Занятие отменено.",
      createdAt: booking.updatedAt,
      tone: "danger"
    });
  }

  return timeline.sort((left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime());
}

export function LessonsPageClient({
  selectedCourse,
  selectedTeacher,
  selectedSlot,
  selectedSubject,
  selectedBookingId
}: LessonsPageClientProps) {
  const [activeTab, setActiveTab] = useState<LessonTab>("upcoming");
  const [bookings, setBookings] = useState<LessonBookingRequest[]>([]);
  const [bookingEvents, setBookingEvents] = useState<BookingEvent[]>([]);
  const [notice, setNotice] = useState<InlineNotice | null>(null);

  const teacher = selectedTeacher ? getTeacherById(selectedTeacher) : undefined;

  useEffect(() => {
    let mounted = true;

    const hydrateFromApi = async () => {
      const [nextBookings, nextEvents] = await Promise.all([syncBookingsFromApi(), syncBookingEventsFromApi()]);
      if (!mounted) {
        return;
      }
      setBookings(nextBookings);
      setBookingEvents(nextEvents);
    };

    void hydrateFromApi();

    const syncLocalCache = () => {
      setBookings(readLessonBookings());
      setBookingEvents(readBookingEvents());
    };
    window.addEventListener("storage", syncLocalCache);
    window.addEventListener(STORAGE_SYNC_EVENT, syncLocalCache);
    return () => {
      mounted = false;
      window.removeEventListener("storage", syncLocalCache);
      window.removeEventListener(STORAGE_SYNC_EVENT, syncLocalCache);
    };
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
      id: buildBookingId({
        teacherId: selectedTeacher,
        courseId: selectedCourse ?? "custom-course",
        slot: selectedSlot
      }),
      courseId: selectedCourse ?? "custom-course",
      teacherId: selectedTeacher,
      teacherName,
      subject: selectedSubject ?? teacherData?.subjects[0] ?? "Индивидуальный урок",
      slot: selectedSlot,
      startAt,
      durationMinutes: 60,
      amountRubles: teacherData?.pricePerHour ?? 1990
    };
  }, [selectedCourse, selectedSlot, selectedSubject, selectedTeacher]);

  const candidateExistingBooking = useMemo(() => {
    if (!candidateBooking) {
      return undefined;
    }
    return bookings.find((booking) => booking.id === candidateBooking.id);
  }, [bookings, candidateBooking]);

  const selectedBooking = useMemo(() => {
    if (!selectedBookingId) {
      return undefined;
    }
    return bookings.find((booking) => booking.id === selectedBookingId);
  }, [bookings, selectedBookingId]);

  const selectedBookingTimeline = useMemo(() => {
    if (!selectedBooking) {
      return [];
    }

    const explicitTimeline = bookingEvents
      .filter((event) => event.bookingId === selectedBooking.id)
      .map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        createdAt: event.createdAt,
        tone:
          event.action.includes("cancel") || event.action.includes("decline")
            ? ("danger" as const)
            : event.action.includes("paid")
              ? ("success" as const)
              : event.action.includes("approved") || event.action.includes("reschedule")
                ? ("primary" as const)
                : ("neutral" as const)
      }));

    if (explicitTimeline.length > 0) {
      return explicitTimeline.sort((left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime());
    }

    return buildBookingTimeline(selectedBooking);
  }, [bookingEvents, selectedBooking]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (selectedCourse && booking.courseId !== selectedCourse) {
        return false;
      }
      if (selectedTeacher && booking.teacherId !== selectedTeacher) {
        return false;
      }
      return true;
    });
  }, [bookings, selectedCourse, selectedTeacher]);

  const pendingBookings = filteredBookings.filter((booking) => booking.status === "pending");
  const proposedBookings = filteredBookings.filter((booking) => booking.status === "reschedule_proposed");
  const awaitingPaymentBookings = filteredBookings.filter((booking) => booking.status === "awaiting_payment");
  const declinedBookings = filteredBookings.filter((booking) => booking.status === "declined");
  const cancelledBookings = filteredBookings.filter((booking) => booking.status === "cancelled");
  const paidBookings = filteredBookings.filter((booking) => booking.status === "paid");

  const bookingLessons = useMemo(() => paidBookings.map(bookingToLesson), [paidBookings]);

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

  const requestBookingConfirmation = async () => {
    if (!candidateBooking) {
      return;
    }

    try {
      const now = new Date().toISOString();
      const existing = bookings.find((booking) => booking.id === candidateBooking.id);
      const studentMessageText = existing?.studentMessage ?? "Здравствуйте! Хочу записаться на это занятие.";

      const next = await upsertBookingViaApi({
        ...candidateBooking,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        status: "pending",
        studentId: studentProfile.id,
        studentName: studentProfile.name,
        amountRubles: candidateBooking.amountRubles,
        studentMessage: studentMessageText,
        teacherMessage: undefined,
        proposedSlot: undefined,
        source: "lessons_page"
      });

      if (!existing) {
        await createBookingEventViaApi({
          bookingId: candidateBooking.id,
          actor: "student",
          action: "booking_created",
          title: "Заявка отправлена",
          description: `Слот ${formatBookingSlotLabel(candidateBooking.slot)} отправлен преподавателю.`
        });

        sendMessageToSharedChatThread({
          teacherId: candidateBooking.teacherId,
          teacherName: candidateBooking.teacherName,
          teacherAvatarUrl: teacher?.avatarUrl,
          studentId: studentProfile.id,
          studentName: studentProfile.name,
          studentAvatarUrl: studentProfile.avatarUrl,
          subject: candidateBooking.subject,
          courseTitle: candidateBooking.subject,
          sender: "student",
          text: studentMessageText
        });
      }
      setBookingEvents(await syncBookingEventsFromApi());

      setBookings(next);
      setNotice({
        kind: "success",
        title: existing ? "Заявка уже существует" : "Заявка отправлена",
        description: existing
          ? "Эта заявка уже находится в обработке преподавателя."
          : "Преподаватель увидит заявку в своем кабинете и подтвердит слот."
      });
    } catch {
      setNotice({
        kind: "error",
        title: "Не удалось отправить заявку",
        description: "Повторите попытку. Данные будут синхронизированы автоматически."
      });
    }
  };

  const cancelBookingRequest = async (bookingId: string) => {
    try {
      const next = await updateBookingViaApi(bookingId, { status: "cancelled" });
      await createBookingEventViaApi({
        bookingId,
        actor: "student",
        action: "student_cancelled",
        title: "Заявка отменена учеником",
        description: "Ученик отменил заявку до проведения занятия."
      });
      setBookings(next);
      setBookingEvents(await syncBookingEventsFromApi());
      setNotice({
        kind: "info",
        title: "Заявка отменена",
        description: "Если нужно, выберите новый слот и отправьте заявку повторно."
      });
    } catch {
      setNotice({
        kind: "error",
        title: "Не удалось отменить заявку",
        description: "Повторите попытку через несколько секунд."
      });
    }
  };

  const acceptTeacherProposal = async (booking: LessonBookingRequest) => {
    if (!booking.proposedSlot) {
      return;
    }

    const startAt = parseSlotToDateTime(booking.proposedSlot);
    if (!startAt) {
      setNotice({
        kind: "error",
        title: "Не удалось принять перенос",
        description: "Формат времени поврежден. Выберите другой слот."
      });
      return;
    }

    try {
      const next = await updateBookingViaApi(booking.id, {
        status: "awaiting_payment",
        slot: booking.proposedSlot,
        proposedSlot: undefined,
        startAt
      });
      await createBookingEventViaApi({
        bookingId: booking.id,
        actor: "student",
        action: "student_accepted_reschedule",
        title: "Перенос принят учеником",
        description: `Новый слот: ${formatBookingSlotLabel(booking.proposedSlot)}.`
      });
      setBookings(next);
      setBookingEvents(await syncBookingEventsFromApi());
      setNotice({
        kind: "success",
        title: "Перенос подтвержден",
        description: "Слот перенесен. Для фиксации в расписании нужно оплатить занятие."
      });
    } catch {
      setNotice({
        kind: "error",
        title: "Не удалось подтвердить перенос",
        description: "Повторите попытку. Если ошибка повторится, перезагрузите страницу."
      });
    }
  };

  const filteredBookingsCount =
    pendingBookings.length + proposedBookings.length + awaitingPaymentBookings.length + declinedBookings.length + cancelledBookings.length;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <div className="space-y-4">
        <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <h1 className="text-3xl font-semibold text-foreground">Занятия</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Путь записи прозрачный: отправка заявки → подтверждение преподавателем → оплата → урок в расписании.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                activeTab === "upcoming" ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
              )}
            >
              Предстоящие
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                activeTab === "completed" ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
              )}
            >
              Прошедшие
            </button>
          </div>

          {selectedCourse ? (
            <p className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-medium text-primary">
              Показаны занятия по выбранному курсу.
            </p>
          ) : null}

          {selectedTeacher ? (
            <p className="mt-2 rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-medium text-primary">
              Преподаватель фильтра: {teacher?.name ?? "выбранный преподаватель"}.
            </p>
          ) : null}

          {candidateBooking ? (
            <div className="mt-3 rounded-2xl border border-accent/60 bg-accent/30 p-3">
              <p className="text-xs font-semibold text-slate-900">
                Выбран слот: {formatBookingSlotLabel(candidateBooking.slot)}
              </p>
              <p className="mt-1 text-xs text-slate-800">
                Преподаватель: {candidateBooking.teacherName}. После подтверждения заявки преподавателем вы оплатите урок в разделе «Платежи».
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={requestBookingConfirmation}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  Отправить заявку
                </button>
                <Link
                  href={`/app/messages?teacher=${encodeURIComponent(candidateBooking.teacherId)}&draft=${encodeURIComponent(
                    "Здравствуйте! Отправил(а) заявку на урок, хочу уточнить детали."
                  )}`}
                  className="inline-flex items-center justify-center rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground"
                >
                  Написать преподавателю
                </Link>
              </div>
              {candidateExistingBooking ? (
                <p className="mt-2 text-xs font-medium text-slate-800">
                  Текущий статус заявки: {getStatusBadge(candidateExistingBooking.status).label}.
                </p>
              ) : null}
            </div>
          ) : null}

          {selectedBooking ? (
            <div className="mt-3 rounded-2xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary">
              <p className="font-semibold">Детали заявки</p>
              <p className="mt-1">{formatBookingSlotLabel(selectedBooking.slot)}</p>
              <p className="mt-1">Статус: {getStatusBadge(selectedBooking.status).label}</p>
              {selectedBooking.status === "awaiting_payment" ? (
                <Link
                  href={`/app/payments?booking=${encodeURIComponent(selectedBooking.id)}`}
                  className="mt-2 inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                >
                  Оплатить занятие
                </Link>
              ) : null}

              {selectedBookingTimeline.length > 0 ? (
                <div className="mt-3 rounded-xl border border-primary/20 bg-white p-3 text-foreground">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">История заявки</p>
                  <ol className="mt-2 space-y-2">
                    {selectedBookingTimeline.map((step) => (
                      <li key={step.id} className="flex items-start gap-2">
                        <span
                          className={cn(
                            "mt-1 h-2.5 w-2.5 rounded-full",
                            step.tone === "success"
                              ? "bg-emerald-500"
                              : step.tone === "danger"
                                ? "bg-rose-500"
                                : step.tone === "primary"
                                  ? "bg-primary"
                                  : "bg-slate-400"
                          )}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-foreground">{step.title}</span>
                            <span className="text-[11px] text-muted-foreground">{formatTimelineDate(step.createdAt)}</span>
                          </span>
                          <span className="mt-0.5 block text-[11px] text-muted-foreground">{step.description}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </div>
          ) : null}

          {notice ? (
            <div
              className={cn(
                "mt-3 rounded-2xl border px-3 py-2 text-sm",
                notice.kind === "success"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : notice.kind === "error"
                    ? "border-rose-300 bg-rose-50 text-rose-800"
                    : "border-primary/20 bg-primary/5 text-primary"
              )}
            >
              <p className="font-semibold">{notice.title}</p>
              <p className="mt-1">{notice.description}</p>
            </div>
          ) : null}
        </section>

        <section className="rounded-3xl border border-border bg-white p-4 shadow-card sm:p-5">
          <p className="text-sm font-semibold text-foreground">Заявки и подтверждения</p>
          <p className="mt-1 text-xs text-muted-foreground">Активных заявок: {filteredBookingsCount}</p>

          {filteredBookingsCount === 0 ? (
            <p className="mt-3 rounded-2xl border border-dashed border-border bg-slate-50 px-3 py-2 text-sm text-muted-foreground">
              Пока нет заявок. Выберите преподавателя и отправьте заявку на удобный слот.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {proposedBookings.map((booking) => {
                const status = getStatusBadge(booking.status);
                return (
                  <article key={booking.id} className="rounded-2xl border border-primary/20 bg-primary/5 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{booking.teacherName}</p>
                      <span className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold", status.className)}>
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Было: {formatBookingSlotLabel(booking.slot)}
                      <br />
                      Предложено: {booking.proposedSlot ? formatBookingSlotLabel(booking.proposedSlot) : "уточняется"}
                    </p>
                    {booking.teacherMessage ? <p className="mt-1 text-xs text-primary">Комментарий: {booking.teacherMessage}</p> : null}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => acceptTeacherProposal(booking)}
                        className="inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                      >
                        Принять перенос
                      </button>
                      <button
                        type="button"
                        onClick={() => cancelBookingRequest(booking.id)}
                        className="inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                      >
                        Отменить заявку
                      </button>
                    </div>
                  </article>
                );
              })}

              {pendingBookings.map((booking) => {
                const status = getStatusBadge(booking.status);
                return (
                  <article key={booking.id} className="rounded-2xl border border-border bg-slate-50 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{booking.teacherName}</p>
                      <span className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold", status.className)}>
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{formatBookingSlotLabel(booking.slot)}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => cancelBookingRequest(booking.id)}
                        className="inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                      >
                        Отменить заявку
                      </button>
                    </div>
                  </article>
                );
              })}

              {awaitingPaymentBookings.map((booking) => {
                const status = getStatusBadge(booking.status);
                return (
                  <article key={booking.id} className="rounded-2xl border border-primary/20 bg-primary/5 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{booking.teacherName}</p>
                      <span className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold", status.className)}>
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatBookingSlotLabel(booking.slot)} · к оплате{" "}
                      <span className="font-semibold text-foreground">
                        {(booking.amountRubles ?? 1990).toLocaleString("ru-RU")} ₽
                      </span>
                    </p>
                    {booking.teacherMessage ? (
                      <p className="mt-1 text-xs text-primary">Комментарий: {booking.teacherMessage}</p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Link
                        href={`/app/payments?booking=${encodeURIComponent(booking.id)}`}
                        className="inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                      >
                        Перейти к оплате
                      </Link>
                      <button
                        type="button"
                        onClick={() => cancelBookingRequest(booking.id)}
                        className="inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                      >
                        Отменить заявку
                      </button>
                    </div>
                  </article>
                );
              })}

              {declinedBookings.map((booking) => {
                const status = getStatusBadge(booking.status);
                return (
                  <article key={booking.id} className="rounded-2xl border border-rose-200 bg-rose-50 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{booking.teacherName}</p>
                      <span className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold", status.className)}>
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-rose-700">{booking.teacherMessage ?? "Преподаватель отклонил заявку."}</p>
                  </article>
                );
              })}

              {cancelledBookings.map((booking) => {
                const status = getStatusBadge(booking.status);
                return (
                  <article key={booking.id} className="rounded-2xl border border-slate-200 bg-slate-100 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{booking.teacherName}</p>
                      <span className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold", status.className)}>
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-700">
                      {booking.teacherMessage ?? "Занятие отменено. Выберите новый слот или другого преподавателя."}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Link
                        href={`/app/teachers?subject=${encodeURIComponent(booking.subject)}`}
                        className="inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                      >
                        Выбрать новый слот
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
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
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Info className="h-3.5 w-3.5 text-primary" />
              В календарь попадают только оплаченные занятия.
            </span>
            {awaitingPaymentBookings.length > 0 ? (
              <span className="inline-flex items-center gap-1 text-primary">
                <Info className="h-3.5 w-3.5" />
                Ожидают оплаты: {awaitingPaymentBookings.length}
              </span>
            ) : null}
            {paidBookings.length > 0 ? (
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Оплачено и запланировано: {paidBookings.length}
              </span>
            ) : null}
            {declinedBookings.length > 0 ? (
              <span className="inline-flex items-center gap-1 text-rose-700">
                <XCircle className="h-3.5 w-3.5" />
                Отклонено: {declinedBookings.length}
              </span>
            ) : null}
            {cancelledBookings.length > 0 ? (
              <span className="inline-flex items-center gap-1 text-slate-700">
                <XCircle className="h-3.5 w-3.5" />
                Отменено: {cancelledBookings.length}
              </span>
            ) : null}
          </div>
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
