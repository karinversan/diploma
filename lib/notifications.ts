import { tutorVerificationQueue, type RefundTicket } from "@/data/admin";
import { studentProfile } from "@/data/student";
import { teacherCabinetProfile } from "@/data/teacher-cabinet";
import { type SharedChatThread, readSharedChatThreads } from "@/lib/chat-threads";
import { type LessonBookingRequest, readLessonBookings } from "@/lib/lesson-bookings";
import { type BookingEvent, readBookingEvents } from "@/lib/booking-events";
import { readRefundTickets } from "@/lib/refund-tickets";
import { type TutorApplication, readTutorApplications } from "@/lib/tutor-applications";
import { readAdminLessonIncidents } from "@/lib/admin-incidents";

export type NotificationRole = "student" | "teacher" | "admin";
export type NotificationKind = "booking" | "payment" | "refund" | "message" | "moderation";

export type NotificationItem = {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  createdAt: string;
  href: string;
};

const NOTIFICATION_READ_KEYS: Record<NotificationRole, string> = {
  student: "notifications-read-student-v1",
  teacher: "notifications-read-teacher-v1",
  admin: "notifications-read-admin-v1"
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function parseJson<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function toIso(value: string | undefined) {
  if (!value) {
    return new Date().toISOString();
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}

function isStudentBooking(booking: LessonBookingRequest) {
  if (booking.studentId && booking.studentId === studentProfile.id) {
    return true;
  }

  return (booking.studentName ?? "").trim().toLowerCase() === studentProfile.name.toLowerCase();
}

function selectTeacherBookings(bookings: LessonBookingRequest[]) {
  const personal = bookings.filter(
    (booking) =>
      booking.teacherId === teacherCabinetProfile.id ||
      (booking.teacherName ?? "").trim().toLowerCase() === teacherCabinetProfile.name.toLowerCase()
  );
  return personal.length > 0 ? personal : bookings;
}

function selectTeacherThreads(threads: SharedChatThread[]) {
  const personal = threads.filter(
    (thread) =>
      thread.teacherId === teacherCabinetProfile.id ||
      (thread.teacherName ?? "").trim().toLowerCase() === teacherCabinetProfile.name.toLowerCase()
  );
  return personal.length > 0 ? personal : threads;
}

function buildStudentBookingNotification(booking: LessonBookingRequest): NotificationItem | null {
  const slotText = booking.slot;
  const baseId = `student-booking-${booking.id}-${booking.status}-${booking.updatedAt}`;
  const createdAt = toIso(booking.updatedAt || booking.createdAt);

  if (booking.status === "pending") {
    return {
      id: baseId,
      kind: "booking",
      title: "Заявка отправлена",
      description: `${booking.teacherName}: ${slotText}. Ожидайте подтверждения преподавателя.`,
      createdAt,
      href: `/app/lessons?booking=${encodeURIComponent(booking.id)}`
    };
  }

  if (booking.status === "awaiting_payment") {
    return {
      id: baseId,
      kind: "payment",
      title: "Слот подтвержден, нужна оплата",
      description: `${booking.teacherName} подтвердил(а) занятие. Оплатите урок, чтобы он попал в расписание.`,
      createdAt,
      href: `/app/payments?booking=${encodeURIComponent(booking.id)}`
    };
  }

  if (booking.status === "reschedule_proposed") {
    return {
      id: baseId,
      kind: "booking",
      title: "Преподаватель предложил перенос",
      description: booking.proposedSlot
        ? `Новый слот: ${booking.proposedSlot}. Подтвердите или отмените заявку.`
        : "Откройте заявку, чтобы принять перенос.",
      createdAt,
      href: `/app/lessons?booking=${encodeURIComponent(booking.id)}`
    };
  }

  if (booking.status === "declined") {
    return {
      id: baseId,
      kind: "booking",
      title: "Заявка отклонена",
      description: booking.teacherMessage ?? "Преподаватель отклонил заявку. Выберите новый слот.",
      createdAt,
      href: `/app/teachers?subject=${encodeURIComponent(booking.subject)}`
    };
  }

  if (booking.status === "cancelled") {
    return {
      id: baseId,
      kind: "booking",
      title: "Занятие отменено",
      description: booking.teacherMessage ?? "Занятие отменено. Откройте раздел «Занятия» для выбора нового слота.",
      createdAt,
      href: `/app/lessons?booking=${encodeURIComponent(booking.id)}`
    };
  }

  if (booking.status === "paid") {
    return {
      id: baseId,
      kind: "payment",
      title: "Оплата прошла успешно",
      description: `Урок «${booking.subject}» добавлен в ваше расписание.`,
      createdAt: toIso(booking.paidAt ?? booking.updatedAt),
      href: `/app/lessons?booking=${encodeURIComponent(booking.id)}`
    };
  }

  return null;
}

function buildTeacherBookingNotification(booking: LessonBookingRequest): NotificationItem | null {
  const baseId = `teacher-booking-${booking.id}-${booking.status}-${booking.updatedAt}`;
  const createdAt = toIso(booking.updatedAt || booking.createdAt);
  const student = booking.studentName ?? "Ученик";

  if (booking.status === "pending") {
    return {
      id: baseId,
      kind: "booking",
      title: "Новая заявка на урок",
      description: `${student}: ${booking.subject} (${booking.slot}).`,
      createdAt,
      href: "/teacher/classroom"
    };
  }

  if (booking.status === "awaiting_payment") {
    return {
      id: baseId,
      kind: "payment",
      title: "Ожидается оплата ученика",
      description: `${student} подтвержден, ожидаем оплату по слоту ${booking.slot}.`,
      createdAt,
      href: "/teacher/classroom"
    };
  }

  if (booking.status === "paid") {
    return {
      id: baseId,
      kind: "payment",
      title: "Урок оплачен учеником",
      description: `${student} оплатил(а) урок «${booking.subject}».`,
      createdAt: toIso(booking.paidAt ?? booking.updatedAt),
      href: "/teacher/classroom"
    };
  }

  if (booking.status === "cancelled") {
    return {
      id: baseId,
      kind: "booking",
      title: "Занятие отменено",
      description: `${student}: занятие отменено. Проверьте статус возврата.`,
      createdAt,
      href: "/teacher/payouts"
    };
  }

  return null;
}

function buildStudentRefundNotification(ticket: RefundTicket, bookingIds: Set<string>): NotificationItem | null {
  if (!bookingIds.has(ticket.bookingId ?? "__none__")) {
    return null;
  }

  const createdAt = toIso(ticket.createdAt);
  const baseId = `student-refund-${ticket.id}-${ticket.status}-${ticket.createdAt}`;

  if (ticket.status === "pending") {
    return {
      id: baseId,
      kind: "refund",
      title: "Возврат в обработке",
      description: `${ticket.invoice}: заявка на возврат принята, ожидайте решение.`,
      createdAt,
      href: "/app/payments"
    };
  }

  if (ticket.status === "approved") {
    return {
      id: baseId,
      kind: "refund",
      title: "Возврат подтвержден",
      description: `${ticket.invoice}: средства будут зачислены на карту.`,
      createdAt,
      href: "/app/payments"
    };
  }

  return {
    id: baseId,
    kind: "refund",
    title: "Возврат отклонен",
    description: `${ticket.invoice}: заявка отклонена. Обратитесь в поддержку при необходимости.`,
    createdAt,
    href: "/contacts"
  };
}

function buildTeacherRefundNotification(ticket: RefundTicket, bookingIds: Set<string>): NotificationItem | null {
  if (!bookingIds.has(ticket.bookingId ?? "__none__")) {
    return null;
  }

  const createdAt = toIso(ticket.createdAt);
  const baseId = `teacher-refund-${ticket.id}-${ticket.status}-${ticket.createdAt}`;

  if (ticket.status === "pending") {
    return {
      id: baseId,
      kind: "refund",
      title: "Создан возврат по отмене",
      description: `${ticket.invoice}: заявка на возврат принята в обработку.`,
      createdAt,
      href: "/teacher/payouts"
    };
  }

  if (ticket.status === "approved") {
    return {
      id: baseId,
      kind: "refund",
      title: "Возврат выполнен",
      description: `${ticket.invoice}: удержание отражено в выплатах.`,
      createdAt,
      href: "/teacher/payouts"
    };
  }

  return {
    id: baseId,
    kind: "refund",
    title: "Возврат отклонен",
    description: `${ticket.invoice}: проверка завершена без удержания.`,
    createdAt,
    href: "/teacher/payouts"
  };
}

function buildStudentMessageNotifications(threads: SharedChatThread[]) {
  return threads
    .filter((thread) => thread.unreadForStudent > 0)
    .map<NotificationItem>((thread) => ({
      id: `student-chat-${thread.id}-${thread.updatedAt}-${thread.unreadForStudent}`,
      kind: "message",
      title: `Новое сообщение от ${thread.teacherName}`,
      description: thread.lastMessage,
      createdAt: toIso(thread.updatedAt),
      href: `/app/messages?thread=${encodeURIComponent(thread.id)}&teacher=${encodeURIComponent(thread.teacherId)}`
    }));
}

function buildTeacherMessageNotifications(threads: SharedChatThread[]) {
  return threads
    .filter((thread) => thread.unreadForTeacher > 0)
    .map<NotificationItem>((thread) => ({
      id: `teacher-chat-${thread.id}-${thread.updatedAt}-${thread.unreadForTeacher}`,
      kind: "message",
      title: `Новое сообщение от ${thread.studentName}`,
      description: thread.lastMessage,
      createdAt: toIso(thread.updatedAt),
      href: `/teacher/messages?thread=${encodeURIComponent(thread.id)}&student=${encodeURIComponent(thread.studentId)}`
    }));
}

function readTutorApplicationsForAdmin() {
  const stored = readTutorApplications();
  if (stored.length > 0) {
    return stored;
  }

  return tutorVerificationQueue.map<TutorApplication>((request, index) => ({
    id: request.id,
    fullName: request.tutorName,
    email: `tutor${index + 1}@example.com`,
    phone: "+7 (900) 000-00-00",
    subjects: request.subjects.join(", "),
    experience: `${request.experienceYears} лет`,
    source: "lead_form",
    status: request.status,
    adminNote: request.note,
    createdAt: request.submittedAt,
    updatedAt: request.submittedAt
  }));
}

function buildAdminTutorApplicationNotifications(applications: TutorApplication[]) {
  return applications
    .filter((application) => application.status === "pending")
    .map<NotificationItem>((application) => ({
      id: `admin-tutor-${application.id}-${application.status}-${application.updatedAt}`,
      kind: "moderation",
      title: "Новая заявка преподавателя",
      description: `${application.fullName}: ${application.subjects}. Требуется решение модератора.`,
      createdAt: toIso(application.updatedAt || application.createdAt),
      href: "/admin/users"
    }));
}

function buildAdminRefundNotifications(tickets: RefundTicket[]) {
  return tickets
    .filter((ticket) => ticket.status === "pending")
    .map<NotificationItem>((ticket) => ({
      id: `admin-refund-${ticket.id}-${ticket.status}-${ticket.createdAt}`,
      kind: "refund",
      title: "Новый возврат в обработке",
      description: `${ticket.invoice}: ${ticket.studentName}, сумма ${ticket.amountRubles.toLocaleString("ru-RU")} ₽.`,
      createdAt: toIso(ticket.createdAt),
      href: "/admin/payments"
    }));
}

function buildAdminBookingNotifications(bookings: LessonBookingRequest[]) {
  return bookings
    .filter((booking) => booking.status === "pending" || booking.status === "awaiting_payment")
    .map<NotificationItem>((booking) => ({
      id: `admin-booking-${booking.id}-${booking.status}-${booking.updatedAt}`,
      kind: booking.status === "awaiting_payment" ? "payment" : "booking",
      title: booking.status === "awaiting_payment" ? "Слот подтвержден, ожидается оплата" : "Новая заявка на слот",
      description:
        booking.status === "awaiting_payment"
          ? `${booking.studentName ?? "Ученик"}: ${booking.subject}, слот ${booking.slot}.`
          : `${booking.teacherName}: ${booking.subject}, слот ${booking.slot}.`,
      createdAt: toIso(booking.updatedAt || booking.createdAt),
      href: "/admin/dashboard"
    }));
}

function buildAdminIncidentNotifications() {
  return readAdminLessonIncidents()
    .filter((incident) => incident.status !== "resolved")
    .map<NotificationItem>((incident) => ({
      id: `admin-incident-${incident.id}-${incident.status}-${incident.createdAt}`,
      kind: "moderation",
      title: incident.severity === "высокий" ? "Критичный инцидент урока" : "Новый инцидент урока",
      description: `${incident.lessonTitle}: ${incident.type}, уровень ${incident.severity}.`,
      createdAt: toIso(incident.createdAt),
      href: "/admin/lessons"
    }));
}

function buildAdminBookingEventNotifications(events: BookingEvent[], bookings: LessonBookingRequest[]) {
  const bookingsById = new Map(bookings.map((booking) => [booking.id, booking]));

  return events
    .filter((event) => event.action === "refund_created" || event.action === "teacher_cancelled")
    .map<NotificationItem>((event) => {
      const booking = bookingsById.get(event.bookingId);
      const context = booking
        ? `${booking.teacherName} · ${booking.studentName ?? "Ученик"}`
        : "Занятие без привязки к карточке";

      return {
        id: `admin-booking-event-${event.id}`,
        kind: event.action === "refund_created" ? "refund" : "booking",
        title: event.title,
        description: `${context}. ${event.description}`,
        createdAt: toIso(event.createdAt),
        href: event.action === "refund_created" ? "/admin/payments" : "/admin/dashboard"
      };
    });
}

function sortNotifications(items: NotificationItem[]) {
  return [...items].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

export function readNotificationsForRole(role: NotificationRole) {
  const bookings = readLessonBookings();
  const refunds = readRefundTickets();

  if (role === "student") {
    const threads = readSharedChatThreads();
    const studentBookings = bookings.filter((booking) => isStudentBooking(booking));
    const bookingIds = new Set(studentBookings.map((booking) => booking.id));

    const bookingNotifications = studentBookings
      .map((booking) => buildStudentBookingNotification(booking))
      .filter((item): item is NotificationItem => Boolean(item));
    const refundNotifications = refunds
      .map((ticket) => buildStudentRefundNotification(ticket, bookingIds))
      .filter((item): item is NotificationItem => Boolean(item));
    const threadNotifications = buildStudentMessageNotifications(threads.filter((thread) => thread.studentId === studentProfile.id));

    return sortNotifications([...bookingNotifications, ...refundNotifications, ...threadNotifications]);
  }

  if (role === "teacher") {
    const threads = readSharedChatThreads();
    const teacherBookings = selectTeacherBookings(bookings);
    const bookingIds = new Set(teacherBookings.map((booking) => booking.id));

    const bookingNotifications = teacherBookings
      .map((booking) => buildTeacherBookingNotification(booking))
      .filter((item): item is NotificationItem => Boolean(item));
    const refundNotifications = refunds
      .map((ticket) => buildTeacherRefundNotification(ticket, bookingIds))
      .filter((item): item is NotificationItem => Boolean(item));
    const threadNotifications = buildTeacherMessageNotifications(selectTeacherThreads(threads));

    return sortNotifications([...bookingNotifications, ...refundNotifications, ...threadNotifications]);
  }

  const adminNotifications = [
    ...buildAdminTutorApplicationNotifications(readTutorApplicationsForAdmin()),
    ...buildAdminRefundNotifications(refunds),
    ...buildAdminBookingNotifications(bookings),
    ...buildAdminIncidentNotifications(),
    ...buildAdminBookingEventNotifications(readBookingEvents(), bookings)
  ];

  return sortNotifications(adminNotifications);
}

export function readSeenNotificationIds(role: NotificationRole) {
  if (!canUseStorage()) {
    return [];
  }

  const raw = parseJson<string[]>(window.localStorage.getItem(NOTIFICATION_READ_KEYS[role]));
  return Array.isArray(raw) ? raw : [];
}

export function markNotificationAsRead(role: NotificationRole, notificationId: string) {
  const seen = new Set(readSeenNotificationIds(role));
  seen.add(notificationId);
  if (canUseStorage()) {
    window.localStorage.setItem(NOTIFICATION_READ_KEYS[role], JSON.stringify(Array.from(seen)));
  }
  return Array.from(seen);
}

export function markAllNotificationsAsRead(role: NotificationRole, notifications: NotificationItem[]) {
  const seen = new Set(readSeenNotificationIds(role));
  notifications.forEach((notification) => seen.add(notification.id));
  if (canUseStorage()) {
    window.localStorage.setItem(NOTIFICATION_READ_KEYS[role], JSON.stringify(Array.from(seen)));
  }
  return Array.from(seen);
}
