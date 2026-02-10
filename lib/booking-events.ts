import { emitStorageSyncEvent } from "@/lib/storage-sync";

export const BOOKING_EVENTS_STORAGE_KEY = "booking-events-v1";

export type BookingEventActor = "student" | "teacher" | "admin" | "system";

export type BookingEvent = {
  id: string;
  bookingId: string;
  actor: BookingEventActor;
  action: string;
  title: string;
  description: string;
  createdAt: string;
};

type CreateBookingEventPayload = Omit<BookingEvent, "id" | "createdAt"> & {
  id?: string;
  createdAt?: string;
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

function toIso(value: unknown) {
  return typeof value === "string" && value ? value : new Date().toISOString();
}

function normalizeEvent(raw: Partial<BookingEvent>): BookingEvent | null {
  if (
    typeof raw?.id !== "string" ||
    typeof raw.bookingId !== "string" ||
    typeof raw.title !== "string" ||
    typeof raw.description !== "string" ||
    typeof raw.action !== "string"
  ) {
    return null;
  }

  const actor: BookingEventActor =
    raw.actor === "student" || raw.actor === "teacher" || raw.actor === "admin" || raw.actor === "system"
      ? raw.actor
      : "system";

  return {
    id: raw.id,
    bookingId: raw.bookingId,
    actor,
    action: raw.action,
    title: raw.title,
    description: raw.description,
    createdAt: toIso(raw.createdAt)
  };
}

function sortEvents(events: BookingEvent[]) {
  return [...events].sort((left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime());
}

export function readBookingEvents(): BookingEvent[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = parseJson<Partial<BookingEvent>[]>(window.localStorage.getItem(BOOKING_EVENTS_STORAGE_KEY));
  if (!Array.isArray(raw)) {
    return [];
  }

  return sortEvents(raw.map((item) => normalizeEvent(item)).filter((item): item is BookingEvent => Boolean(item)));
}

export function writeBookingEvents(events: BookingEvent[]) {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(BOOKING_EVENTS_STORAGE_KEY, JSON.stringify(events));
  emitStorageSyncEvent();
}

export function createBookingEvent(payload: CreateBookingEventPayload) {
  const current = readBookingEvents();
  const nextItem: BookingEvent = {
    id: payload.id ?? `be-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    bookingId: payload.bookingId,
    actor: payload.actor,
    action: payload.action,
    title: payload.title,
    description: payload.description,
    createdAt: payload.createdAt ?? new Date().toISOString()
  };

  const next = sortEvents([...current, nextItem]);
  writeBookingEvents(next);
  return { next, item: nextItem };
}

export function readBookingEventsForBooking(bookingId: string) {
  return readBookingEvents().filter((event) => event.bookingId === bookingId);
}
