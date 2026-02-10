import { emitStorageSyncEvent } from "@/lib/storage-sync";

export const LESSON_BOOKINGS_STORAGE_KEY = "lesson-booking-requests-v2";
export const LEGACY_BOOKINGS_STORAGE_KEY = "student-bookings-v1";

export type LessonBookingStatus =
  | "pending"
  | "awaiting_payment"
  | "paid"
  | "reschedule_proposed"
  | "declined"
  | "cancelled";

export type LessonBookingRequest = {
  id: string;
  courseId: string;
  teacherId: string;
  teacherName: string;
  studentId?: string;
  studentName?: string;
  subject: string;
  slot: string;
  startAt: string;
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
  status: LessonBookingStatus;
  amountRubles?: number;
  paidAt?: string;
  studentMessage?: string;
  teacherMessage?: string;
  proposedSlot?: string;
  source?: "teacher_profile" | "course_dialog" | "lessons_page";
};

type LegacyBooking = {
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

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function toIso(value: unknown) {
  return typeof value === "string" && value ? value : new Date().toISOString();
}

function normalizeBooking(raw: Partial<LessonBookingRequest>): LessonBookingRequest | null {
  if (
    typeof raw?.id !== "string" ||
    typeof raw.courseId !== "string" ||
    typeof raw.teacherId !== "string" ||
    typeof raw.teacherName !== "string" ||
    typeof raw.subject !== "string" ||
    typeof raw.slot !== "string" ||
    typeof raw.startAt !== "string"
  ) {
    return null;
  }

  const rawStatus: string = typeof raw.status === "string" ? raw.status : "pending";
  const allowedStatuses: LessonBookingStatus[] = [
    "pending",
    "awaiting_payment",
    "paid",
    "reschedule_proposed",
    "declined",
    "cancelled"
  ];
  const normalizedStatus = rawStatus === "confirmed" ? "paid" : rawStatus;
  const status = allowedStatuses.includes(normalizedStatus as LessonBookingStatus)
    ? (normalizedStatus as LessonBookingStatus)
    : "pending";

  return {
    id: raw.id,
    courseId: raw.courseId,
    teacherId: raw.teacherId,
    teacherName: raw.teacherName,
    studentId: typeof raw.studentId === "string" ? raw.studentId : undefined,
    studentName: typeof raw.studentName === "string" ? raw.studentName : undefined,
    subject: raw.subject,
    slot: raw.slot,
    startAt: raw.startAt,
    durationMinutes: typeof raw.durationMinutes === "number" ? raw.durationMinutes : 60,
    createdAt: toIso(raw.createdAt),
    updatedAt: toIso(raw.updatedAt),
    status,
    amountRubles: typeof raw.amountRubles === "number" ? raw.amountRubles : undefined,
    paidAt: typeof raw.paidAt === "string" ? raw.paidAt : undefined,
    studentMessage: typeof raw.studentMessage === "string" ? raw.studentMessage : undefined,
    teacherMessage: typeof raw.teacherMessage === "string" ? raw.teacherMessage : undefined,
    proposedSlot: typeof raw.proposedSlot === "string" ? raw.proposedSlot : undefined,
    source:
      raw.source === "teacher_profile" || raw.source === "course_dialog" || raw.source === "lessons_page"
        ? raw.source
        : undefined
  };
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

function migrateLegacyBookings(raw: LegacyBooking[]): LessonBookingRequest[] {
  return raw.reduce<LessonBookingRequest[]>((acc, legacy) => {
    if (
      typeof legacy?.id !== "string" ||
      typeof legacy.courseId !== "string" ||
      typeof legacy.teacherId !== "string" ||
      typeof legacy.teacherName !== "string" ||
      typeof legacy.subject !== "string" ||
      typeof legacy.slot !== "string" ||
      typeof legacy.startAt !== "string"
    ) {
      return acc;
    }

    const createdAt = toIso(legacy.createdAt);
    acc.push({
      id: legacy.id,
      courseId: legacy.courseId,
      teacherId: legacy.teacherId,
      teacherName: legacy.teacherName,
      studentId: "student-001",
      studentName: "Ученик",
      subject: legacy.subject,
      slot: legacy.slot,
      startAt: legacy.startAt,
      durationMinutes: typeof legacy.durationMinutes === "number" ? legacy.durationMinutes : 60,
      createdAt,
      updatedAt: createdAt,
      status: "paid",
      source: "lessons_page"
    });
    return acc;
  }, []);
}

export function readLessonBookings(): LessonBookingRequest[] {
  if (!canUseStorage()) {
    return [];
  }

  const nextRaw = parseJson<Partial<LessonBookingRequest>[]>(window.localStorage.getItem(LESSON_BOOKINGS_STORAGE_KEY));
  if (Array.isArray(nextRaw)) {
    return nextRaw
      .map((item) => normalizeBooking(item))
      .filter((item): item is LessonBookingRequest => Boolean(item))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  const legacyRaw = parseJson<LegacyBooking[]>(window.localStorage.getItem(LEGACY_BOOKINGS_STORAGE_KEY));
  if (!Array.isArray(legacyRaw)) {
    return [];
  }

  const migrated = migrateLegacyBookings(legacyRaw);
  writeLessonBookings(migrated);
  return migrated;
}

export function writeLessonBookings(bookings: LessonBookingRequest[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(LESSON_BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  emitStorageSyncEvent();
}

export function upsertLessonBooking(booking: LessonBookingRequest) {
  const current = readLessonBookings();
  const next = [...current];
  const index = next.findIndex((item) => item.id === booking.id);

  if (index >= 0) {
    next[index] = booking;
  } else {
    next.unshift(booking);
  }

  writeLessonBookings(next);
  return next;
}

export function updateLessonBooking(
  bookingId: string,
  update: Partial<
    Pick<
      LessonBookingRequest,
      "status" | "teacherMessage" | "proposedSlot" | "slot" | "startAt" | "updatedAt" | "paidAt" | "amountRubles"
    >
  >
) {
  const current = readLessonBookings();
  const next = current.map((booking) => {
    if (booking.id !== bookingId) {
      return booking;
    }

    return {
      ...booking,
      ...update,
      updatedAt: update.updatedAt ?? new Date().toISOString()
    };
  });
  writeLessonBookings(next);
  return next;
}

export function parseSlotToDateTime(slotValue: string) {
  const match = slotValue.trim().match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})$/);

  if (!match) {
    return null;
  }

  const [, datePart, timePart] = match;
  return `${datePart}T${timePart}:00+03:00`;
}

export function buildBookingId(params: { teacherId: string; courseId: string; slot: string }) {
  return `${params.teacherId}__${params.courseId}__${params.slot.replace(/\s+/g, "_").replace(/:/g, "-")}`;
}

export function buildSlotKey(teacherId: string, slot: string) {
  return `${teacherId}__${slot}`;
}

export function formatBookingSlotLabel(slot: string) {
  const isoValue = parseSlotToDateTime(slot);
  if (!isoValue) {
    return slot;
  }

  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  })
    .format(new Date(isoValue))
    .replace(/^[A-Za-zА-Яа-яЁё]/, (first) => first.toLowerCase());
}
