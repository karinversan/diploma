"use client";

import {
  type LessonBookingRequest,
  readLessonBookings,
  updateLessonBooking,
  upsertLessonBooking,
  writeLessonBookings
} from "@/lib/lesson-bookings";
import {
  type BookingEvent,
  createBookingEvent,
  readBookingEvents,
  writeBookingEvents
} from "@/lib/booking-events";

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

async function requestJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      },
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function hydrateBookingsLocal(bookings: LessonBookingRequest[]) {
  writeLessonBookings(bookings);
  return bookings;
}

function hydrateEventsLocal(events: BookingEvent[]) {
  writeBookingEvents(events);
  return events;
}

export async function syncBookingsFromApi() {
  const remote = await requestJson<{ bookings: LessonBookingRequest[] }>("/api/bookings");
  if (remote?.bookings) {
    return hydrateBookingsLocal(remote.bookings);
  }
  return readLessonBookings();
}

export async function syncBookingEventsFromApi() {
  const remote = await requestJson<{ events: BookingEvent[] }>("/api/booking-events");
  if (remote?.events) {
    return hydrateEventsLocal(remote.events);
  }
  return readBookingEvents();
}

export async function upsertBookingViaApi(booking: LessonBookingRequest) {
  const remote = await requestJson<{ bookings: LessonBookingRequest[] }>("/api/bookings", {
    method: "POST",
    body: JSON.stringify({ booking })
  });

  if (remote?.bookings) {
    return hydrateBookingsLocal(remote.bookings);
  }

  return upsertLessonBooking(booking);
}

export async function updateBookingViaApi(bookingId: string, update: BookingUpdate) {
  const remote = await requestJson<{ bookings: LessonBookingRequest[] }>(`/api/bookings/${encodeURIComponent(bookingId)}`, {
    method: "PATCH",
    body: JSON.stringify({ update })
  });

  if (remote?.bookings) {
    return hydrateBookingsLocal(remote.bookings);
  }

  return updateLessonBooking(bookingId, update);
}

export async function createBookingEventViaApi(payload: CreateBookingEventPayload) {
  const remote = await requestJson<{ events: BookingEvent[]; item: BookingEvent }>("/api/booking-events", {
    method: "POST",
    body: JSON.stringify({ event: payload })
  });

  if (remote?.events && remote.item) {
    hydrateEventsLocal(remote.events);
    return { next: remote.events, item: remote.item };
  }

  return createBookingEvent(payload);
}

