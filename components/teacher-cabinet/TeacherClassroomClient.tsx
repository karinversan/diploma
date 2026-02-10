"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react";

import {
  ClassroomEvent,
  teacherCabinetProfile,
  teacherClassroomEvents,
  teacherCourses,
  teacherStudents
} from "@/data/teacher-cabinet";
import { studentProfile } from "@/data/student";
import { getTeacherById } from "@/data/teachers";
import {
  formatBookingSlotLabel,
  LessonBookingRequest,
  readLessonBookings,
  updateLessonBooking
} from "@/lib/lesson-bookings";
import { BookingEvent, createBookingEvent, readBookingEvents } from "@/lib/booking-events";
import { sendMessageToSharedChatThread } from "@/lib/chat-threads";
import { createRefundTicket } from "@/lib/refund-tickets";
import { STORAGE_SYNC_EVENT } from "@/lib/storage-sync";
import { cn } from "@/lib/utils";

const classroomTabs = [
  { id: "courses", label: "Мои курсы" },
  { id: "calendar", label: "Календарь" },
  { id: "students", label: "Ученики" },
  { id: "account", label: "Аккаунт преподавателя" }
] as const;

type ClassroomTabId = (typeof classroomTabs)[number]["id"];
type CalendarMode = "week" | "month";
type RequestStatusFilter = "all" | "pending" | "reschedule_proposed" | "awaiting_payment" | "paid" | "declined";
type RequestAction = "confirm" | "propose" | "decline";
type RequestViewMode = "list" | "kanban";
type MessageTone = "standard" | "friendly" | "strict";

type TeacherClassroomClientProps = {
  initialStatusFilter?: string;
  initialViewMode?: string;
  initialSearchQuery?: string;
};

const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const requestStatusFilterOptions: Array<{ value: RequestStatusFilter; label: string }> = [
  { value: "all", label: "Все статусы" },
  { value: "pending", label: "Новые заявки" },
  { value: "reschedule_proposed", label: "Перенос предложен" },
  { value: "awaiting_payment", label: "Ожидают оплату" },
  { value: "paid", label: "Оплачено" },
  { value: "declined", label: "Отклоненные" }
];

const requestViewModeOptions: Array<{ value: RequestViewMode; label: string }> = [
  { value: "list", label: "Лента" },
  { value: "kanban", label: "Канбан" }
];

const messageToneOptions: Array<{ value: MessageTone; label: string }> = [
  { value: "standard", label: "Шаблон: стандарт" },
  { value: "friendly", label: "Шаблон: дружелюбно" },
  { value: "strict", label: "Шаблон: формально" }
];

const queueColumnConfig: Array<{
  status: Exclude<RequestStatusFilter, "all">;
  label: string;
  description: string;
  className: string;
}> = [
  {
    status: "pending",
    label: "Новые заявки",
    description: "Нужна проверка слота и ответ ученику.",
    className: "border-amber-300/80 bg-amber-50"
  },
  {
    status: "reschedule_proposed",
    label: "Предложен перенос",
    description: "Ждем подтверждения переноса от ученика.",
    className: "border-primary/30 bg-primary/5"
  },
  {
    status: "awaiting_payment",
    label: "Ожидают оплату",
    description: "Слот подтвержден, урок появится после оплаты.",
    className: "border-emerald-300/80 bg-emerald-50"
  },
  {
    status: "paid",
    label: "Оплачено",
    description: "Уроки уже зафиксированы в календаре.",
    className: "border-emerald-300/80 bg-white"
  },
  {
    status: "declined",
    label: "Отклонено",
    description: "Можно продолжить обсуждение в чате.",
    className: "border-rose-300/80 bg-rose-50"
  }
];

function parseEventMinutes(value: string) {
  const [hoursText, minutesText] = value.split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);
  return hours * 60 + minutes;
}

function getEventColor(type: ClassroomEvent["type"]) {
  if (type === "Лекция") {
    return "border-blue-400/60 bg-blue-100 text-blue-900";
  }
  if (type === "Практика") {
    return "border-orange-400/60 bg-orange-100 text-orange-900";
  }
  if (type === "Дискуссия") {
    return "border-violet-400/60 bg-violet-100 text-violet-900";
  }
  return "border-emerald-400/60 bg-emerald-100 text-emerald-900";
}

function getWeekStart(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const shift = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + shift);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function formatShortDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}`;
}

function formatMonthYear(date: Date) {
  const monthNames = [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь"
  ];
  return `${monthNames[date.getMonth()] ?? ""} ${date.getFullYear()}`;
}

function createWeekDays(baseDate: Date) {
  const start = getWeekStart(baseDate);
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function formatTimeFromMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function createStudentIdFallback(studentName: string | undefined, requestId: string) {
  if (!studentName) {
    return `student-${requestId.slice(-6)}`;
  }

  const normalized = studentName.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-zа-я0-9_-]/gi, "");
  return normalized ? `student-${normalized}` : `student-${requestId.slice(-6)}`;
}

function getRequestStatusMeta(status: LessonBookingRequest["status"]) {
  if (status === "pending") {
    return { label: "Новая заявка", className: "border-amber-300 bg-amber-50 text-amber-800" };
  }
  if (status === "reschedule_proposed") {
    return { label: "Перенос предложен", className: "border-primary/30 bg-primary/10 text-primary" };
  }
  if (status === "awaiting_payment") {
    return { label: "Ожидает оплату", className: "border-emerald-300 bg-emerald-50 text-emerald-800" };
  }
  if (status === "paid") {
    return { label: "Оплачено", className: "border-emerald-300 bg-white text-emerald-700" };
  }
  return { label: "Отклонено", className: "border-rose-300 bg-rose-50 text-rose-700" };
}

function isActionableRequestStatus(status: LessonBookingRequest["status"]) {
  return status === "pending" || status === "reschedule_proposed";
}

function buildNextDaySlotForRequest(request: LessonBookingRequest) {
  const sourceDate = new Date(request.startAt);
  const proposedDate = new Date(sourceDate.getTime() + 24 * 60 * 60 * 1000);
  const datePart = `${proposedDate.getFullYear()}-${String(proposedDate.getMonth() + 1).padStart(2, "0")}-${String(proposedDate.getDate()).padStart(2, "0")}`;
  const timePart = `${String(sourceDate.getHours()).padStart(2, "0")}:${String(sourceDate.getMinutes()).padStart(2, "0")}`;
  return `${datePart} ${timePart}`;
}

function buildTeacherActionMessage({
  action,
  request,
  tone,
  proposedSlot
}: {
  action: RequestAction;
  request: LessonBookingRequest;
  tone: MessageTone;
  proposedSlot?: string;
}) {
  const slotLabel = formatBookingSlotLabel(request.slot);
  const proposedLabel = proposedSlot ? formatBookingSlotLabel(proposedSlot) : undefined;

  if (action === "confirm") {
    if (tone === "friendly") {
      return `Отлично, подтверждаю слот ${slotLabel}. Как только пройдет оплата, урок сразу закрепится в расписании.`;
    }
    if (tone === "strict") {
      return `Слот ${slotLabel} подтвержден. Для проведения занятия требуется оплата в разделе «Платежи».`;
    }
    return `Подтвердил(а) ваш слот ${slotLabel}. Следующий шаг: оплата в разделе «Платежи».`;
  }

  if (action === "propose") {
    if (tone === "friendly") {
      return proposedLabel
        ? `Предлагаю удобный перенос на ${proposedLabel}. Подтвердите, и я сразу зафиксирую занятие.`
        : "Предлагаю выбрать другое удобное время для переноса.";
    }
    if (tone === "strict") {
      return proposedLabel
        ? `Предлагаю перенос на ${proposedLabel}. Подтвердите перенос в разделе «Занятия».`
        : "Предлагаю перенос. Подтвердите новый слот в разделе «Занятия».";
    }
    return proposedLabel
      ? `Предлагаю перенести занятие на ${proposedLabel}. Подтвердите перенос в разделе «Занятия».`
      : "Предлагаю перенос. Подтвердите новый слот в разделе «Занятия».";
  }

  if (tone === "friendly") {
    return "К сожалению, выбранный слот уже недоступен. Давайте подберем другое удобное время.";
  }
  if (tone === "strict") {
    return "Заявка отклонена из-за недоступности слота. Выберите другое время для записи.";
  }
  return "К сожалению, выбранный слот недоступен. Пожалуйста, выберите другое время.";
}

export function TeacherClassroomClient({
  initialStatusFilter,
  initialViewMode,
  initialSearchQuery
}: TeacherClassroomClientProps = {}) {
  const resolvedInitialStatusFilter = requestStatusFilterOptions.some((option) => option.value === initialStatusFilter)
    ? (initialStatusFilter as RequestStatusFilter)
    : "all";
  const resolvedInitialViewMode = requestViewModeOptions.some((option) => option.value === initialViewMode)
    ? (initialViewMode as RequestViewMode)
    : "list";

  const [activeTab, setActiveTab] = useState<ClassroomTabId>("calendar");
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("week");
  const [anchorDate, setAnchorDate] = useState(() => new Date("2026-04-09T08:00:00"));
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery ?? "");
  const [manualCalendarEvents, setManualCalendarEvents] = useState<ClassroomEvent[]>(teacherClassroomEvents);
  const [selectedEvent, setSelectedEvent] = useState<ClassroomEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [bookingRequests, setBookingRequests] = useState<LessonBookingRequest[]>([]);
  const [bookingEvents, setBookingEvents] = useState<BookingEvent[]>([]);
  const [teacherActionNote, setTeacherActionNote] = useState<string | null>(null);
  const [requestStatusFilter, setRequestStatusFilter] = useState<RequestStatusFilter>(resolvedInitialStatusFilter);
  const [requestViewMode, setRequestViewMode] = useState<RequestViewMode>(resolvedInitialViewMode);
  const [messageTone, setMessageTone] = useState<MessageTone>("standard");
  const [teacherMessageDraft, setTeacherMessageDraft] = useState("");
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);
  const [pendingBulkAction, setPendingBulkAction] = useState<RequestAction | null>(null);
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);

  const weekDays = useMemo(() => createWeekDays(anchorDate), [anchorDate]);

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return teacherStudents;
    }

    return teacherStudents.filter((student) => {
      return student.name.toLowerCase().includes(query) || student.activeCourse.toLowerCase().includes(query);
    });
  }, [searchQuery]);

  useEffect(() => {
    setBookingRequests(readLessonBookings());
    setBookingEvents(readBookingEvents());
    const syncAll = () => {
      setBookingRequests(readLessonBookings());
      setBookingEvents(readBookingEvents());
    };
    window.addEventListener("storage", syncAll);
    window.addEventListener(STORAGE_SYNC_EVENT, syncAll);
    return () => {
      window.removeEventListener("storage", syncAll);
      window.removeEventListener(STORAGE_SYNC_EVENT, syncAll);
    };
  }, []);

  const requestsForTeacher = useMemo(
    () => {
      const active = bookingRequests.filter((request) => request.status !== "cancelled");
      const personal = active.filter(
        (request) => request.teacherId === teacherCabinetProfile.id || request.teacherName === teacherCabinetProfile.name
      );

      return (personal.length > 0 ? personal : active).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    },
    [bookingRequests]
  );

  const isDemoRequestsMode = useMemo(
    () =>
      requestsForTeacher.length > 0 &&
      requestsForTeacher.some(
        (request) => request.teacherId !== teacherCabinetProfile.id && request.teacherName !== teacherCabinetProfile.name
      ),
    [requestsForTeacher]
  );

  const pendingRequests = requestsForTeacher.filter((request) => request.status === "pending");
  const proposedRequests = requestsForTeacher.filter((request) => request.status === "reschedule_proposed");
  const awaitingPaymentRequests = requestsForTeacher.filter((request) => request.status === "awaiting_payment");
  const paidRequests = requestsForTeacher.filter((request) => request.status === "paid");
  const declinedRequests = requestsForTeacher.filter((request) => request.status === "declined");

  const requestQueue = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return requestsForTeacher.filter((request) => {
      const byStatus = requestStatusFilter === "all" ? true : request.status === requestStatusFilter;
      if (!byStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [request.subject, request.studentName ?? "Ученик", request.slot, request.status]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [requestStatusFilter, requestsForTeacher, searchQuery]);

  const queueColumns = useMemo(() => {
    return queueColumnConfig
      .filter((column) => requestStatusFilter === "all" || requestStatusFilter === column.status)
      .map((column) => ({
        ...column,
        items: requestQueue.filter((request) => request.status === column.status)
      }));
  }, [requestQueue, requestStatusFilter]);

  const selectableQueueRequestIds = useMemo(() => {
    return requestQueue
      .filter((request) => request.status === "pending" || request.status === "reschedule_proposed")
      .map((request) => request.id);
  }, [requestQueue]);

  const selectableQueueSet = useMemo(() => new Set(selectableQueueRequestIds), [selectableQueueRequestIds]);
  const selectedSelectableCount = selectedRequestIds.filter((id) => selectableQueueSet.has(id)).length;
  const allSelectableSelected = selectableQueueRequestIds.length > 0 && selectedSelectableCount === selectableQueueRequestIds.length;
  const selectedActionableRequests = useMemo(() => {
    return requestQueue.filter((request) => selectedRequestIds.includes(request.id) && isActionableRequestStatus(request.status));
  }, [requestQueue, selectedRequestIds]);

  useEffect(() => {
    const allowedIds = new Set(requestsForTeacher.map((request) => request.id));
    setSelectedRequestIds((prev) => prev.filter((id) => allowedIds.has(id)));
  }, [requestsForTeacher]);

  const paidRequestEvents = useMemo(() => {
    return paidRequests.map<ClassroomEvent>((request) => {
      const slotMatch = request.slot.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})$/);
      const date = slotMatch?.[1] ?? request.startAt.slice(0, 10);
      const startTime = slotMatch?.[2] ?? request.startAt.slice(11, 16);
      const startMinutes = parseEventMinutes(startTime);
      const endMinutes = Math.min(23 * 60 + 59, startMinutes + request.durationMinutes);
      const endTime = formatTimeFromMinutes(endMinutes);

      return {
        id: `booking-${request.id}`,
        title: "Индивидуальный урок",
        type: "Лекция",
        date,
        startTime,
        endTime,
        participantName: request.studentName ?? "Ученик",
        participantAvatarUrl: "/avatars/avatar-2.svg",
        courseId: request.courseId
      };
    });
  }, [paidRequests]);

  const calendarEvents = useMemo(() => {
    return [...manualCalendarEvents, ...paidRequestEvents];
  }, [manualCalendarEvents, paidRequestEvents]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, ClassroomEvent[]>();
    calendarEvents.forEach((event) => {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    });
    return map;
  }, [calendarEvents]);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return calendarEvents;
    }
    return calendarEvents.filter((event) => {
      return event.participantName.toLowerCase().includes(query) || event.title.toLowerCase().includes(query);
    });
  }, [calendarEvents, searchQuery]);

  const eventFilterSet = useMemo(() => new Set(filteredEvents.map((event) => event.id)), [filteredEvents]);

  const weekEvents = useMemo(() => {
    return weekDays.flatMap((day) => {
      const dateKey = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
      return (eventsByDate.get(dateKey) ?? []).filter((event) => eventFilterSet.has(event.id));
    });
  }, [eventsByDate, eventFilterSet, weekDays]);

  const calendarTimeRange = useMemo(() => {
    if (weekEvents.length === 0) {
      const defaultStart = 8 * 60;
      const defaultEnd = 16 * 60;
      const markers = Array.from({ length: 9 }).map((_, index) => defaultStart + index * 60);
      return { startMinute: defaultStart, endMinute: defaultEnd, markers };
    }

    const minStart = Math.min(...weekEvents.map((event) => parseEventMinutes(event.startTime)));
    const maxEnd = Math.max(...weekEvents.map((event) => parseEventMinutes(event.endTime)));

    let startMinute = Math.max(6 * 60, Math.floor(minStart / 30) * 30 - 30);
    let endMinute = Math.min(23 * 60, Math.ceil(maxEnd / 30) * 30 + 30);

    if (endMinute - startMinute < 6 * 60) {
      endMinute = Math.min(23 * 60, startMinute + 6 * 60);
    }

    const markers: number[] = [];
    const firstMarker = Math.ceil(startMinute / 60) * 60;
    for (let minute = firstMarker; minute <= endMinute; minute += 60) {
      markers.push(minute);
    }
    if (markers.length === 0) {
      markers.push(startMinute);
    }

    return { startMinute, endMinute, markers };
  }, [weekEvents]);

  const bookingEventsByRequest = useMemo(() => {
    const map = new Map<string, BookingEvent[]>();
    for (const event of bookingEvents) {
      const list = map.get(event.bookingId) ?? [];
      list.push(event);
      map.set(event.bookingId, list);
    }

    for (const [key, list] of Array.from(map.entries())) {
      map.set(
        key,
        [...list].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
      );
    }

    return map;
  }, [bookingEvents]);

  const formatEventLogDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "сейчас";
    }
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  const notifyStudentByChat = (request: LessonBookingRequest, text: string) => {
    const teacherFromCatalog = getTeacherById(request.teacherId);
    const studentId = resolveRequestStudentId(request);
    const studentAvatarUrl = request.studentName === studentProfile.name ? studentProfile.avatarUrl : "/avatars/avatar-3.svg";

    sendMessageToSharedChatThread({
      teacherId: request.teacherId,
      teacherName: request.teacherName,
      teacherAvatarUrl: teacherFromCatalog?.avatarUrl ?? teacherCabinetProfile.avatarUrl,
      studentId,
      studentName: request.studentName ?? "Ученик",
      studentAvatarUrl,
      subject: request.subject,
      courseTitle: request.subject,
      sender: "teacher",
      text
    });
  };

  const resolveRequestStudentId = (request: LessonBookingRequest) =>
    request.studentId ??
    (request.studentName === studentProfile.name ? studentProfile.id : createStudentIdFallback(request.studentName, request.id));
  const applyRequestAction = (
    request: LessonBookingRequest,
    action: RequestAction,
    options?: { silentNote?: boolean; skipStateSync?: boolean; tone?: MessageTone; customMessage?: string }
  ) => {
    const tone = options?.tone ?? messageTone;
    const customMessage = options?.customMessage?.trim();

    if (action === "confirm") {
      const teacherMessage =
        customMessage ??
        buildTeacherActionMessage({
          action,
          request,
          tone
        });
      const next = updateLessonBooking(request.id, {
        status: "awaiting_payment",
        teacherMessage,
        proposedSlot: undefined
      });
      if (!options?.skipStateSync) {
        setBookingRequests(next);
      }
      createBookingEvent({
        bookingId: request.id,
        actor: "teacher",
        action: "teacher_approved",
        title: "Слот подтвержден преподавателем",
        description: "Ученик может перейти к оплате занятия."
      });
      if (!options?.skipStateSync) {
        setBookingEvents(readBookingEvents());
      }
      notifyStudentByChat(request, teacherMessage);
      if (!options?.silentNote) {
        setTeacherActionNote(
          `Заявка на ${formatBookingSlotLabel(request.slot)} подтверждена. Теперь ученик увидит кнопку оплаты в разделе «Занятия».`
        );
      }
      return;
    }

    if (action === "propose") {
      const sourceDate = new Date(request.startAt);
      const proposedDate = new Date(sourceDate.getTime() + 24 * 60 * 60 * 1000);
      const datePart = `${proposedDate.getFullYear()}-${String(proposedDate.getMonth() + 1).padStart(2, "0")}-${String(proposedDate.getDate()).padStart(2, "0")}`;
      const timePart = `${String(sourceDate.getHours()).padStart(2, "0")}:${String(sourceDate.getMinutes()).padStart(2, "0")}`;
      const proposedSlot = `${datePart} ${timePart}`;
      const teacherMessage =
        customMessage ??
        buildTeacherActionMessage({
          action,
          request,
          tone,
          proposedSlot
        });

      const next = updateLessonBooking(request.id, {
        status: "reschedule_proposed",
        proposedSlot,
        teacherMessage
      });
      if (!options?.skipStateSync) {
        setBookingRequests(next);
      }
      createBookingEvent({
        bookingId: request.id,
        actor: "teacher",
        action: "teacher_reschedule_proposed",
        title: "Предложен перенос",
        description: `Новый слот: ${formatBookingSlotLabel(proposedSlot)}.`
      });
      if (!options?.skipStateSync) {
        setBookingEvents(readBookingEvents());
      }
      notifyStudentByChat(request, teacherMessage);
      if (!options?.silentNote) {
        setTeacherActionNote(`По заявке отправлен перенос на ${formatBookingSlotLabel(proposedSlot)}.`);
      }
      return;
    }

    const teacherMessage =
      customMessage ??
      buildTeacherActionMessage({
        action,
        request,
        tone
      });
    const next = updateLessonBooking(request.id, {
      status: "declined",
      teacherMessage
    });
    if (!options?.skipStateSync) {
      setBookingRequests(next);
    }
    createBookingEvent({
      bookingId: request.id,
      actor: "teacher",
      action: "teacher_declined",
      title: "Заявка отклонена преподавателем",
      description: teacherMessage
    });
    if (!options?.skipStateSync) {
      setBookingEvents(readBookingEvents());
    }
    notifyStudentByChat(request, teacherMessage);
    if (!options?.silentNote) {
      setTeacherActionNote("Заявка отклонена с комментарием преподавателя.");
    }
  };

  const consumeCustomMessage = () => {
    const normalized = teacherMessageDraft.trim();
    return normalized.length > 0 ? normalized : undefined;
  };

  const confirmRequest = (request: LessonBookingRequest) => {
    const customMessage = consumeCustomMessage();
    applyRequestAction(request, "confirm", { tone: messageTone, customMessage });
    if (customMessage) {
      setTeacherMessageDraft("");
    }
  };

  const proposeNewTime = (request: LessonBookingRequest) => {
    const customMessage = consumeCustomMessage();
    applyRequestAction(request, "propose", { tone: messageTone, customMessage });
    if (customMessage) {
      setTeacherMessageDraft("");
    }
  };

  const declineRequest = (request: LessonBookingRequest) => {
    const customMessage = consumeCustomMessage();
    applyRequestAction(request, "decline", { tone: messageTone, customMessage });
    if (customMessage) {
      setTeacherMessageDraft("");
    }
  };

  const toggleRequestSelection = (requestId: string) => {
    setSelectedRequestIds((prev) => (prev.includes(requestId) ? prev.filter((id) => id !== requestId) : [...prev, requestId]));
  };

  const toggleSelectAllQueue = () => {
    if (allSelectableSelected) {
      setSelectedRequestIds((prev) => prev.filter((id) => !selectableQueueSet.has(id)));
      return;
    }

    setSelectedRequestIds((prev) => Array.from(new Set([...prev, ...selectableQueueRequestIds])));
  };

  const runBulkAction = (action: RequestAction) => {
    const selectedRequests = requestQueue.filter((request) => selectedRequestIds.includes(request.id));
    const actionableRequests = selectedRequests.filter((request) => isActionableRequestStatus(request.status));
    const customMessage = consumeCustomMessage();

    if (actionableRequests.length === 0) {
      return;
    }

    for (const request of actionableRequests) {
      applyRequestAction(request, action, {
        silentNote: true,
        skipStateSync: true,
        tone: messageTone,
        customMessage
      });
    }

    setBookingRequests(readLessonBookings());
    setBookingEvents(readBookingEvents());
    setSelectedRequestIds((prev) => prev.filter((id) => !actionableRequests.some((request) => request.id === id)));
    if (customMessage) {
      setTeacherMessageDraft("");
    }

    if (action === "confirm") {
      setTeacherActionNote(`Массовое действие: подтверждено ${actionableRequests.length} заявок.`);
    } else if (action === "propose") {
      setTeacherActionNote(`Массовое действие: отправлен перенос для ${actionableRequests.length} заявок.`);
    } else {
      setTeacherActionNote(`Массовое действие: отклонено ${actionableRequests.length} заявок.`);
    }
  };

  const openBulkActionConfirm = (action: RequestAction) => {
    if (selectedSelectableCount === 0) {
      return;
    }
    setPendingBulkAction(action);
    setIsBulkConfirmOpen(true);
  };

  const getBulkActionUi = (action: RequestAction) => {
    if (action === "confirm") {
      return {
        title: "Подтвердить выбранные заявки",
        button: "Подтвердить заявки",
        buttonClass: "bg-primary text-primary-foreground"
      };
    }
    if (action === "propose") {
      return {
        title: "Отправить перенос по выбранным заявкам",
        button: "Отправить перенос",
        buttonClass: "border border-border bg-white text-foreground"
      };
    }
    return {
      title: "Отклонить выбранные заявки",
      button: "Отклонить заявки",
      buttonClass: "border border-rose-200 bg-rose-50 text-rose-700"
    };
  };

  const bulkActionPreviewMessage = useMemo(() => {
    if (!pendingBulkAction || selectedActionableRequests.length === 0) {
      return "";
    }

    const customMessage = teacherMessageDraft.trim();
    if (customMessage) {
      return customMessage;
    }

    const sampleRequest = selectedActionableRequests[0];
    if (pendingBulkAction === "propose") {
      return buildTeacherActionMessage({
        action: "propose",
        request: sampleRequest,
        tone: messageTone,
        proposedSlot: buildNextDaySlotForRequest(sampleRequest)
      });
    }

    return buildTeacherActionMessage({
      action: pendingBulkAction,
      request: sampleRequest,
      tone: messageTone
    });
  }, [messageTone, pendingBulkAction, selectedActionableRequests, teacherMessageDraft]);

  const confirmBulkAction = () => {
    if (!pendingBulkAction) {
      return;
    }
    runBulkAction(pendingBulkAction);
    setIsBulkConfirmOpen(false);
    setPendingBulkAction(null);
  };

  const selectedEventCourse = useMemo(() => {
    if (!selectedEvent) {
      return undefined;
    }
    return teacherCourses.find((course) => course.id === selectedEvent.courseId);
  }, [selectedEvent]);

  const formatEventDateLabel = (date: string) => {
    return new Intl.DateTimeFormat("ru-RU", {
      weekday: "short",
      day: "2-digit",
      month: "long"
    })
      .format(new Date(`${date}T12:00:00+03:00`))
      .replace(/^[A-Za-zА-Яа-яЁё]/, (first) => first.toUpperCase());
  };

  const cancelCalendarEvent = () => {
    if (!selectedEvent) {
      return;
    }

    if (selectedEvent.id.startsWith("booking-")) {
      const bookingId = selectedEvent.id.replace("booking-", "");
      const relatedBooking = bookingRequests.find((request) => request.id === bookingId);

      if (relatedBooking && relatedBooking.amountRubles && relatedBooking.amountRubles > 0) {
        const refundResult = createRefundTicket({
          bookingId: relatedBooking.id,
          invoice: `#${Math.floor(1000 + Math.random() * 8999)}`,
          studentName: relatedBooking.studentName ?? "Ученик платформы",
          amountRubles: relatedBooking.amountRubles,
          reason: "Отмена оплаченного занятия преподавателем"
        });

        createBookingEvent({
          bookingId: relatedBooking.id,
          actor: "system",
          action: "refund_created",
          title: refundResult.mode === "created" ? "Заявка на возврат создана" : "Возврат уже в обработке",
          description:
            refundResult.mode === "created"
              ? `Создан возврат ${refundResult.item.invoice} на сумму ${relatedBooking.amountRubles.toLocaleString("ru-RU")} ₽.`
              : `Возврат ${refundResult.item.invoice} уже существует в системе.`
        });
      }

      const next = updateLessonBooking(bookingId, {
        status: "cancelled",
        teacherMessage:
          "Занятие отменено преподавателем. Мы создали заявку на возврат, статус будет виден в разделе «Платежи»."
      });
      setBookingRequests(next);
      createBookingEvent({
        bookingId,
        actor: "teacher",
        action: "teacher_cancelled",
        title: "Занятие отменено преподавателем",
        description: "Ученик получил уведомление об отмене и инструкции по возврату."
      });
      setBookingEvents(readBookingEvents());
      if (relatedBooking) {
        notifyStudentByChat(
          relatedBooking,
          "Занятие отменено преподавателем. Мы создали заявку на возврат, статус можно отслеживать в разделе «Платежи»."
        );
      }
      setTeacherActionNote(
        `Оплаченное занятие (${formatEventDateLabel(selectedEvent.date)} ${selectedEvent.startTime}–${selectedEvent.endTime}) отменено, заявка на возврат создана.`
      );
    } else {
      setManualCalendarEvents((prev) => prev.filter((event) => event.id !== selectedEvent.id));
      setTeacherActionNote(
        `Занятие «${selectedEvent.title}» с ${selectedEvent.participantName} (${formatEventDateLabel(selectedEvent.date)} ${selectedEvent.startTime}–${selectedEvent.endTime}) отменено.`
      );
    }

    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  const proposeCalendarEventReschedule = () => {
    if (!selectedEvent) {
      return;
    }

    if (selectedEvent.id.startsWith("booking-")) {
      const bookingId = selectedEvent.id.replace("booking-", "");
      const relatedBooking = bookingRequests.find((request) => request.id === bookingId);

      if (!relatedBooking) {
        return;
      }

      const proposedSlot = buildNextDaySlotForRequest(relatedBooking);
      const teacherMessage = buildTeacherActionMessage({
        action: "propose",
        request: relatedBooking,
        tone: messageTone,
        proposedSlot
      });

      const next = updateLessonBooking(bookingId, {
        status: "reschedule_proposed",
        proposedSlot,
        teacherMessage
      });
      setBookingRequests(next);
      createBookingEvent({
        bookingId,
        actor: "teacher",
        action: "teacher_reschedule_proposed",
        title: "Перенос предложен преподавателем",
        description: `Новый слот: ${formatBookingSlotLabel(proposedSlot)}.`
      });
      setBookingEvents(readBookingEvents());
      notifyStudentByChat(relatedBooking, teacherMessage);
      setTeacherActionNote(
        `Для занятия ${formatEventDateLabel(selectedEvent.date)} ${selectedEvent.startTime} предложен перенос на ${formatBookingSlotLabel(proposedSlot)}.`
      );
    } else {
      const sourceDate = new Date(`${selectedEvent.date}T12:00:00+03:00`);
      const shifted = new Date(sourceDate.getTime() + 24 * 60 * 60 * 1000);
      const nextDate = `${shifted.getFullYear()}-${String(shifted.getMonth() + 1).padStart(2, "0")}-${String(shifted.getDate()).padStart(2, "0")}`;

      setManualCalendarEvents((prev) =>
        prev.map((event) => (event.id === selectedEvent.id ? { ...event, date: nextDate } : event))
      );
      setTeacherActionNote(
        `Занятие «${selectedEvent.title}» перенесено на ${formatEventDateLabel(nextDate)} ${selectedEvent.startTime}.`
      );
    }

    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  const renderRequestCard = (request: LessonBookingRequest, layout: "list" | "kanban" = "list") => {
    const statusMeta = getRequestStatusMeta(request.status);
    const actionable = isActionableRequestStatus(request.status);
    const isSelected = selectedRequestIds.includes(request.id);
    const history = bookingEventsByRequest.get(request.id) ?? [];

    return (
      <article
        key={request.id}
        className={cn(
          "rounded-xl border p-3",
          request.status === "paid"
            ? "border-emerald-200 bg-emerald-50"
            : request.status === "declined"
              ? "border-rose-200 bg-rose-50"
              : "border-primary/20 bg-white",
          layout === "kanban" ? "h-full" : ""
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">
            {request.subject} · {request.studentName ?? "Ученик"}
          </p>
          <div className="flex items-center gap-2">
            {actionable ? (
              <label className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2 py-0.5 text-xs font-semibold text-foreground">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleRequestSelection(request.id)}
                  className="h-3.5 w-3.5 accent-primary"
                />
                В очередь
              </label>
            ) : null}
            <span className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold", statusMeta.className)}>{statusMeta.label}</span>
          </div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Текущий слот: {formatBookingSlotLabel(request.slot)}
          {request.proposedSlot ? ` · Предложен: ${formatBookingSlotLabel(request.proposedSlot)}` : ""}
        </p>
        {request.studentMessage ? <p className="mt-1 text-xs text-muted-foreground">Сообщение ученика: {request.studentMessage}</p> : null}

        {layout === "list" && history.length > 0 ? (
          <details className="mt-2 rounded-xl border border-border bg-slate-50 p-2">
            <summary className="cursor-pointer text-xs font-semibold text-foreground">История действий</summary>
            <div className="mt-2 space-y-2">
              {history.map((event) => (
                <div key={event.id} className="rounded-lg border border-border bg-white px-2.5 py-2">
                  <p className="text-xs font-semibold text-foreground">{event.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{event.description}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {formatEventLogDate(event.createdAt)} · {event.actor}
                  </p>
                </div>
              ))}
            </div>
          </details>
        ) : null}

        {request.status === "awaiting_payment" ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-xs text-emerald-700">Слот подтвержден. Ожидаем оплату от ученика.</p>
            <Link
              href={`/teacher/messages?student=${encodeURIComponent(resolveRequestStudentId(request))}`}
              className="inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
            >
              Открыть чат
            </Link>
          </div>
        ) : actionable ? (
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => confirmRequest(request)}
              className="inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
            >
              Подтвердить
            </button>
            <button
              type="button"
              onClick={() => proposeNewTime(request)}
              className="inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
            >
              Предложить другое время
            </button>
            <button
              type="button"
              onClick={() => declineRequest(request)}
              className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700"
            >
              Отклонить
            </button>
            <Link
              href={`/teacher/messages?student=${encodeURIComponent(resolveRequestStudentId(request))}`}
              className="inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
            >
              Открыть чат
            </Link>
          </div>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href={`/teacher/messages?student=${encodeURIComponent(resolveRequestStudentId(request))}`}
              className="inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
            >
              Написать ученику
            </Link>
          </div>
        )}
      </article>
    );
  };

  const bulkActionUi = pendingBulkAction ? getBulkActionUi(pendingBulkAction) : null;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Мой класс</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Управляйте курсами, учениками и расписанием занятий в одном рабочем пространстве.
            </p>
          </div>
          <Link
            href="/teacher/courses"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Создать новый курс
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-b border-border pb-3">
          {classroomTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-slate-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <label className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Поиск по ученикам, курсам или бронированиям"
              className="w-full rounded-2xl border border-border bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary"
            />
          </label>

          {activeTab === "calendar" ? (
            <div className="inline-flex items-center rounded-2xl border border-border bg-slate-50 p-1 text-sm">
              <button
                type="button"
                onClick={() => setCalendarMode("week")}
                className={cn("rounded-xl px-4 py-2 font-semibold", calendarMode === "week" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground")}
              >
                Неделя
              </button>
              <button
                type="button"
                onClick={() => setCalendarMode("month")}
                className={cn("rounded-xl px-4 py-2 font-semibold", calendarMode === "month" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground")}
              >
                Месяц
              </button>
            </div>
          ) : null}
        </div>
      </section>

      {activeTab === "courses" ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {teacherCourses.map((course) => (
            <article key={course.id} className="rounded-3xl border border-border bg-white p-4 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{course.category}</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">{course.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{course.shortDescription}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-slate-100 px-2.5 py-1">{course.level}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">{course.studentsCount} учеников</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">{course.lessonsCount} уроков</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/teacher/courses/${encodeURIComponent(course.id)}`}
                  className="inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  Редактировать
                </Link>
                <Link
                  href={`/teacher/courses/${encodeURIComponent(course.id)}/preview`}
                  className="inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                >
                  Предпросмотр
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {activeTab === "calendar" ? (
        <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Заявки на занятия от учеников</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Здесь преподаватель подтверждает запись, предлагает перенос или отклоняет заявку.
                </p>
                {isDemoRequestsMode ? (
                  <p className="mt-2 rounded-xl border border-primary/20 bg-white px-2.5 py-1.5 text-xs text-primary">
                    Режим демо: показаны все заявки платформы, чтобы можно было протестировать сценарии подтверждения.
                  </p>
                ) : null}
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>Новых заявок: {pendingRequests.length}</p>
                <p>Ожидают ответа ученика: {proposedRequests.length}</p>
                <p>Ожидают оплату: {awaitingPaymentRequests.length}</p>
                <p>Оплачено: {paidRequests.length}</p>
                <p>Отклонено: {declinedRequests.length}</p>
              </div>
            </div>

            {teacherActionNote ? (
              <div className="mt-3 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                {teacherActionNote}
              </div>
            ) : null}

            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-primary/20 bg-white p-2">
              <select
                value={requestStatusFilter}
                onChange={(event) => setRequestStatusFilter(event.target.value as RequestStatusFilter)}
                className="rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary"
                aria-label="Фильтр заявок по статусу"
              >
                {requestStatusFilterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={requestViewMode}
                onChange={(event) => setRequestViewMode(event.target.value as RequestViewMode)}
                className="rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary"
                aria-label="Режим отображения очереди"
              >
                {requestViewModeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={messageTone}
                onChange={(event) => setMessageTone(event.target.value as MessageTone)}
                className="rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary"
                aria-label="Шаблон сообщений ученику"
              >
                {messageToneOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <label className="min-w-[220px] flex-1">
                <span className="sr-only">Дополнительный комментарий к действию</span>
                <input
                  type="text"
                  value={teacherMessageDraft}
                  onChange={(event) => setTeacherMessageDraft(event.target.value)}
                  placeholder="Доп. комментарий ученику (необязательно)"
                  className="w-full rounded-xl border border-border bg-white px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                />
              </label>

              <button
                type="button"
                onClick={toggleSelectAllQueue}
                disabled={selectableQueueRequestIds.length === 0}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {allSelectableSelected ? "Снять выделение" : "Выбрать активные"}
              </button>
              <button
                type="button"
                onClick={() => openBulkActionConfirm("confirm")}
                disabled={selectedSelectableCount === 0}
                className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                Подтвердить выбранные
              </button>
              <button
                type="button"
                onClick={() => openBulkActionConfirm("propose")}
                disabled={selectedSelectableCount === 0}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                Перенести выбранные
              </button>
              <button
                type="button"
                onClick={() => openBulkActionConfirm("decline")}
                disabled={selectedSelectableCount === 0}
                className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Отклонить выбранные
              </button>
              <span className="ml-auto text-[11px] text-muted-foreground">Выделено: {selectedSelectableCount}</span>
            </div>

            {requestQueue.length === 0 ? (
              <p className="mt-3 rounded-xl border border-dashed border-primary/30 bg-white/80 px-3 py-2 text-sm text-muted-foreground">
                По текущим фильтрам заявок нет. Измените статусный фильтр или строку поиска.
              </p>
            ) : requestViewMode === "list" ? (
              <div className="mt-3 space-y-2">
                {requestQueue.slice(0, 8).map((request) => renderRequestCard(request, "list"))}

                {requestQueue.length > 8 ? (
                  <p className="rounded-xl border border-dashed border-border bg-white px-3 py-2 text-xs text-muted-foreground">
                    Показаны первые 8 заявок. Уточните фильтр или поиск для точечной обработки.
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="mt-3 grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
                {queueColumns.map((column) => (
                  <section key={column.status} className={cn("rounded-xl border p-3", column.className)}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{column.label}</h3>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">{column.description}</p>
                      </div>
                      <span className="rounded-full border border-border bg-white px-2 py-0.5 text-xs font-semibold text-foreground">
                        {column.items.length}
                      </span>
                    </div>

                    {column.items.length === 0 ? (
                      <p className="mt-2 rounded-lg border border-dashed border-border/70 bg-white/80 px-2 py-1.5 text-[11px] text-muted-foreground">
                        Нет заявок в этой колонке.
                      </p>
                    ) : (
                      <div className="mt-2 space-y-2">{column.items.map((request) => renderRequestCard(request, "kanban"))}</div>
                    )}
                  </section>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const next = new Date(anchorDate);
                next.setDate(anchorDate.getDate() - 7);
                setAnchorDate(next);
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white text-foreground"
              aria-label="Предыдущая неделя"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-lg font-semibold text-foreground">{formatMonthYear(anchorDate)}</p>
            <button
              type="button"
              onClick={() => {
                const next = new Date(anchorDate);
                next.setDate(anchorDate.getDate() + 7);
                setAnchorDate(next);
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white text-foreground"
              aria-label="Следующая неделя"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {calendarMode === "month" ? (
            <div className="mt-4 rounded-2xl border border-border bg-slate-50 p-6 text-center text-sm text-muted-foreground">
              Месячный режим доступен как демо. Для точного планирования используйте недельный вид.
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <div className="min-w-[920px] rounded-2xl border border-border bg-slate-50 p-3">
                <div className="grid grid-cols-[64px_repeat(7,minmax(120px,1fr))] gap-2">
                  <div />
                  {weekDays.map((day, index) => {
                    const dateKey = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
                    const hasEvents = (eventsByDate.get(dateKey) ?? []).some((event) => eventFilterSet.has(event.id));
                    return (
                      <div
                        key={dateKey}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-center",
                          hasEvents ? "border-primary/40 bg-primary/5" : "border-border bg-white"
                        )}
                      >
                        <p className="text-xs font-medium text-muted-foreground">{dayNames[index]}</p>
                        <p className="text-lg font-semibold text-foreground">{formatShortDate(day)}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 grid grid-cols-[64px_repeat(7,minmax(120px,1fr))] gap-2">
                  <div className="relative h-[520px] rounded-xl border border-border bg-white">
                    {calendarTimeRange.markers.map((minute) => {
                      const top = ((minute - calendarTimeRange.startMinute) / (calendarTimeRange.endMinute - calendarTimeRange.startMinute)) * 100;
                      return (
                        <p
                          key={minute}
                          className="absolute left-2 text-[11px] font-semibold text-muted-foreground"
                          style={{ top: `${top}%`, transform: "translateY(-50%)" }}
                        >
                          {formatTimeFromMinutes(minute)}
                        </p>
                      );
                    })}
                  </div>

                  {weekDays.map((day) => {
                    const dateKey = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
                    const events = (eventsByDate.get(dateKey) ?? []).filter((event) => eventFilterSet.has(event.id));

                    return (
                      <div key={dateKey} className="relative h-[520px] overflow-hidden rounded-xl border border-border bg-white">
                        {calendarTimeRange.markers.map((minute) => {
                          const top = ((minute - calendarTimeRange.startMinute) / (calendarTimeRange.endMinute - calendarTimeRange.startMinute)) * 100;
                          return <span key={`line-${dateKey}-${minute}`} className="absolute inset-x-0 border-t border-slate-100" style={{ top: `${top}%` }} />;
                        })}

                        {events.map((event) => {
                          const start = parseEventMinutes(event.startTime);
                          const end = parseEventMinutes(event.endTime);
                          const clampedStart = Math.max(start, calendarTimeRange.startMinute);
                          const clampedEnd = Math.min(end, calendarTimeRange.endMinute);

                          if (clampedEnd <= clampedStart) {
                            return null;
                          }

                          const totalHeightPx = 520;
                          const rangeDuration = calendarTimeRange.endMinute - calendarTimeRange.startMinute;
                          const topPx = ((clampedStart - calendarTimeRange.startMinute) / rangeDuration) * totalHeightPx;
                          const rawHeightPx = ((clampedEnd - clampedStart) / rangeDuration) * totalHeightPx;
                          const heightPx = Math.max(52, Math.min(rawHeightPx, totalHeightPx - topPx - 4));

                          return (
                            <button
                              key={event.id}
                              type="button"
                              onClick={() => {
                                setSelectedEvent(event);
                                setIsEventModalOpen(true);
                              }}
                              className={cn(
                                "absolute left-1.5 right-1.5 overflow-hidden rounded-xl border p-2 text-left text-xs shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                                getEventColor(event.type)
                              )}
                              style={{ top: `${Math.max(topPx, 0)}px`, height: `${heightPx}px` }}
                              aria-label={`Открыть детали занятия ${event.title} ${event.startTime}-${event.endTime}`}
                            >
                              <p className="truncate text-sm font-semibold">{event.title}</p>
                              <p className="text-[11px]">
                                {event.startTime}–{event.endTime}
                              </p>
                              <div className="mt-1 flex items-center gap-1.5">
                                <Image
                                  src={event.participantAvatarUrl}
                                  alt={event.participantName}
                                  width={18}
                                  height={18}
                                  className="h-[18px] w-[18px] rounded-full"
                                />
                                <span className="truncate text-[11px]">{event.participantName}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
      ) : null}

      <Dialog.Root
        open={isBulkConfirmOpen}
        onOpenChange={(nextOpen) => {
          setIsBulkConfirmOpen(nextOpen);
          if (!nextOpen) {
            setPendingBulkAction(null);
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[84] bg-slate-950/70" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[85] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Dialog.Title className="text-lg font-semibold text-foreground">
                  {bulkActionUi?.title ?? "Подтверждение действия"}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                  Проверьте выбранные заявки и текст сообщения перед отправкой.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-muted-foreground"
                  aria-label="Закрыть окно подтверждения"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Выбрано заявок: {selectedActionableRequests.length}
              </p>
              {selectedActionableRequests.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">Нет заявок для обработки. Выберите заявки в очереди.</p>
              ) : (
                <ul className="mt-2 space-y-1.5 text-sm text-foreground">
                  {selectedActionableRequests.slice(0, 6).map((request) => (
                    <li key={request.id} className="rounded-xl border border-border bg-white px-3 py-2">
                      {request.studentName ?? "Ученик"} · {request.subject} · {formatBookingSlotLabel(request.slot)}
                    </li>
                  ))}
                  {selectedActionableRequests.length > 6 ? (
                    <li className="text-xs text-muted-foreground">
                      И еще {selectedActionableRequests.length - 6} заявок будут обработаны этим действием.
                    </li>
                  ) : null}
                </ul>
              )}
            </div>

            <div className="mt-3 rounded-2xl border border-primary/20 bg-primary/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Текст сообщения ученику</p>
              <p className="mt-1 text-sm text-foreground">{bulkActionPreviewMessage || "Сообщение будет сформировано автоматически."}</p>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground"
                >
                  Отмена
                </button>
              </Dialog.Close>
              <button
                type="button"
                onClick={confirmBulkAction}
                disabled={selectedActionableRequests.length === 0 || !pendingBulkAction}
                className={cn(
                  "inline-flex rounded-full px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50",
                  bulkActionUi?.buttonClass ?? "bg-primary text-primary-foreground"
                )}
              >
                {bulkActionUi?.button ?? "Подтвердить"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root
        open={isEventModalOpen}
        onOpenChange={(nextOpen) => {
          setIsEventModalOpen(nextOpen);
          if (!nextOpen) {
            setSelectedEvent(null);
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-slate-950/70" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[81] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Dialog.Title className="text-lg font-semibold text-foreground">
                  {selectedEvent ? `${selectedEvent.title}: ${selectedEvent.participantName}` : "Детали занятия"}
                </Dialog.Title>
                {selectedEvent ? (
                  <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                    {formatEventDateLabel(selectedEvent.date)} · {selectedEvent.startTime}–{selectedEvent.endTime}
                  </Dialog.Description>
                ) : null}
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-muted-foreground"
                  aria-label="Закрыть окно"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            {selectedEvent ? (
              <div className="mt-4 rounded-2xl border border-border bg-slate-50 p-4 text-sm">
                <p className="font-semibold text-foreground">Ученик: {selectedEvent.participantName}</p>
                <p className="mt-1 text-muted-foreground">
                  Курс: {selectedEventCourse?.title ?? "Индивидуальное занятие"}
                </p>
                <p className="mt-1 text-muted-foreground">Тип занятия: {selectedEvent.type}</p>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground"
                >
                  Закрыть
                </button>
              </Dialog.Close>
              <button
                type="button"
                onClick={proposeCalendarEventReschedule}
                className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground"
              >
                Предложить перенос
              </button>
              <button
                type="button"
                onClick={cancelCalendarEvent}
                className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
              >
                Отменить занятие
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {activeTab === "students" ? (
        <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <h2 className="text-xl font-semibold text-foreground">Ученики и прогресс</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2">Ученик</th>
                  <th className="px-3 py-2">Курс</th>
                  <th className="px-3 py-2">Прогресс</th>
                  <th className="px-3 py-2">Посещаемость</th>
                  <th className="px-3 py-2">Домашка</th>
                  <th className="px-3 py-2">Активность</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-border/70">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Image src={student.avatarUrl} alt={student.name} width={32} height={32} className="h-8 w-8 rounded-full" />
                        <span className="font-medium text-foreground">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{student.activeCourse}</td>
                    <td className="px-3 py-3 font-medium text-foreground">{student.progress}%</td>
                    <td className="px-3 py-3 text-muted-foreground">{student.attendance}%</td>
                    <td className="px-3 py-3 text-muted-foreground">{student.homeworkStatus}</td>
                    <td className="px-3 py-3 text-muted-foreground">{student.lastActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {activeTab === "account" ? (
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr),320px]">
          <article className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
            <h2 className="text-xl font-semibold text-foreground">Профиль преподавателя</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Данные из анкеты преподавателя, которые видят ученики в каталоге.
            </p>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-slate-50 p-3">
                <dt className="text-xs text-muted-foreground">ФИО</dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">{teacherCabinetProfile.name}</dd>
              </div>
              <div className="rounded-2xl border border-border bg-slate-50 p-3">
                <dt className="text-xs text-muted-foreground">Email</dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">{teacherCabinetProfile.email}</dd>
              </div>
              <div className="rounded-2xl border border-border bg-slate-50 p-3">
                <dt className="text-xs text-muted-foreground">Часовой пояс</dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">{teacherCabinetProfile.timezone}</dd>
              </div>
              <div className="rounded-2xl border border-border bg-slate-50 p-3">
                <dt className="text-xs text-muted-foreground">Рейтинг</dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">
                  {teacherCabinetProfile.rating} ({teacherCabinetProfile.reviewsCount} отзывов)
                </dd>
              </div>
            </dl>
          </article>

          <article className="rounded-3xl border border-border bg-white p-5 shadow-card">
            <h3 className="text-lg font-semibold text-foreground">Ссылки</h3>
            <div className="mt-3 grid gap-2">
              <Link
                href="/teacher/settings"
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-slate-50 px-3 py-2 text-sm font-semibold text-foreground"
              >
                <CalendarDays className="h-4 w-4 text-primary" />
                Настройки кабинета
              </Link>
              <Link
                href="/app/teachers/teacher-jenny-wilson"
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-slate-50 px-3 py-2 text-sm font-semibold text-foreground"
              >
                Публичный профиль
              </Link>
            </div>
          </article>
        </section>
      ) : null}
    </div>
  );
}
