import fs from "node:fs/promises";
import path from "node:path";

import type { BookingEvent } from "@/lib/booking-events";
import type { LessonBookingRequest } from "@/lib/lesson-bookings";

const STORE_PATH = path.join("/tmp", "skillzone-booking-store-v1.json");

type BookingStore = {
  bookings: LessonBookingRequest[];
  bookingEvents: BookingEvent[];
};

type BookingUpdate = Partial<
  Pick<
    LessonBookingRequest,
    "status" | "teacherMessage" | "proposedSlot" | "slot" | "startAt" | "updatedAt" | "paidAt" | "amountRubles"
  >
>;

type CreateBookingEventPayload = Omit<BookingEvent, "id" | "createdAt"> & {
  id?: string;
  createdAt?: string;
};

function fallbackStore(): BookingStore {
  return {
    bookings: [],
    bookingEvents: []
  };
}

function sortBookings(bookings: LessonBookingRequest[]) {
  return [...bookings].sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
}

function sortEvents(events: BookingEvent[]) {
  return [...events].sort((left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime());
}

async function ensureStoreFile() {
  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, JSON.stringify(fallbackStore(), null, 2), "utf-8");
  }
}

async function readStore(): Promise<BookingStore> {
  await ensureStoreFile();

  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<BookingStore>;
    return {
      bookings: Array.isArray(parsed.bookings) ? sortBookings(parsed.bookings) : [],
      bookingEvents: Array.isArray(parsed.bookingEvents) ? sortEvents(parsed.bookingEvents) : []
    };
  } catch {
    return fallbackStore();
  }
}

async function writeStore(store: BookingStore) {
  const normalized: BookingStore = {
    bookings: sortBookings(store.bookings),
    bookingEvents: sortEvents(store.bookingEvents)
  };
  await fs.writeFile(STORE_PATH, JSON.stringify(normalized, null, 2), "utf-8");
  return normalized;
}

export async function listBookings() {
  const store = await readStore();
  return sortBookings(store.bookings);
}

export async function upsertBooking(booking: LessonBookingRequest) {
  const store = await readStore();
  const index = store.bookings.findIndex((item) => item.id === booking.id);

  if (index >= 0) {
    store.bookings[index] = booking;
  } else {
    store.bookings.push(booking);
  }

  const next = await writeStore(store);
  return next.bookings;
}

export async function patchBooking(id: string, update: BookingUpdate) {
  const store = await readStore();
  store.bookings = store.bookings.map((booking) => {
    if (booking.id !== id) {
      return booking;
    }
    return {
      ...booking,
      ...update,
      updatedAt: update.updatedAt ?? new Date().toISOString()
    };
  });

  const next = await writeStore(store);
  return next.bookings;
}

export async function listBookingEvents() {
  const store = await readStore();
  return sortEvents(store.bookingEvents);
}

export async function listBookingEventsForBooking(bookingId: string) {
  const store = await readStore();
  return sortEvents(store.bookingEvents.filter((event) => event.bookingId === bookingId));
}

export async function appendBookingEvent(payload: CreateBookingEventPayload) {
  const store = await readStore();
  const item: BookingEvent = {
    id: payload.id ?? `be-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    bookingId: payload.bookingId,
    actor: payload.actor,
    action: payload.action,
    title: payload.title,
    description: payload.description,
    createdAt: payload.createdAt ?? new Date().toISOString()
  };

  store.bookingEvents.push(item);
  const next = await writeStore(store);
  return { events: next.bookingEvents, item };
}

