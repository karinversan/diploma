import fs from "node:fs/promises";
import path from "node:path";

import { beforeEach, describe, expect, it } from "vitest";

import { GET as getBookingEvents, POST as postBookingEvent } from "@/app/api/booking-events/route";
import { GET as getBookingEventsByBooking } from "@/app/api/booking-events/[bookingId]/route";
import { PATCH as patchBooking } from "@/app/api/bookings/[id]/route";
import { GET as getBookings, POST as postBooking } from "@/app/api/bookings/route";
import type { LessonBookingRequest } from "@/lib/lesson-bookings";

function createBooking(overrides?: Partial<LessonBookingRequest>): LessonBookingRequest {
  return {
    id: "api-booking-1",
    courseId: "course-api-1",
    teacherId: "teacher-api-1",
    teacherName: "Мария Котова",
    studentId: "student-api-1",
    studentName: "Ирина Соколова",
    subject: "Английский язык",
    slot: "2026-04-20 18:30",
    startAt: "2026-04-20T15:30:00.000Z",
    durationMinutes: 60,
    createdAt: "2026-04-01T09:00:00.000Z",
    updatedAt: "2026-04-01T09:00:00.000Z",
    status: "pending",
    source: "course_dialog",
    ...overrides
  };
}

async function asJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

describe("bookings api routes", () => {
  beforeEach(async () => {
    const testStorePath = path.join("/tmp", `skillzone-booking-store-test-${Date.now()}-${Math.random().toString(16).slice(2)}.json`);
    process.env.SKILLZONE_BOOKING_STORE_PATH = testStorePath;
    await fs.writeFile(testStorePath, JSON.stringify({ bookings: [], bookingEvents: [] }, null, 2), "utf-8");
  });

  it("creates and updates booking through api routes", async () => {
    const booking = createBooking();

    const createResponse = await postBooking(
      new Request("http://localhost/api/bookings", {
        method: "POST",
        body: JSON.stringify({ booking })
      })
    );
    expect(createResponse.status).toBe(200);
    const created = await asJson<{ bookings: LessonBookingRequest[] }>(createResponse);
    expect(created.bookings).toHaveLength(1);
    expect(created.bookings[0]?.id).toBe(booking.id);

    const listResponse = await getBookings();
    const listed = await asJson<{ bookings: LessonBookingRequest[] }>(listResponse);
    expect(listed.bookings).toHaveLength(1);
    expect(listed.bookings[0]?.status).toBe("pending");

    const patchResponse = await patchBooking(
      new Request(`http://localhost/api/bookings/${booking.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          update: {
            status: "awaiting_payment",
            teacherMessage: "Слот подтвержден"
          }
        })
      }),
      {
        params: {
          id: booking.id
        }
      }
    );

    expect(patchResponse.status).toBe(200);
    const patched = await asJson<{ bookings: LessonBookingRequest[] }>(patchResponse);
    expect(patched.bookings[0]?.status).toBe("awaiting_payment");
    expect(patched.bookings[0]?.teacherMessage).toBe("Слот подтвержден");
  });

  it("writes and returns booking timeline events", async () => {
    const booking = createBooking({ id: "api-booking-events-1" });
    await postBooking(
      new Request("http://localhost/api/bookings", {
        method: "POST",
        body: JSON.stringify({ booking })
      })
    );

    const eventResponse = await postBookingEvent(
      new Request("http://localhost/api/booking-events", {
        method: "POST",
        body: JSON.stringify({
          event: {
            bookingId: booking.id,
            actor: "teacher",
            action: "teacher_approved",
            title: "Слот подтвержден преподавателем",
            description: "Можно переходить к оплате."
          }
        })
      })
    );
    expect(eventResponse.status).toBe(200);

    const listResponse = await getBookingEvents();
    const listed = await asJson<{ events: Array<{ bookingId: string; action: string }> }>(listResponse);
    expect(listed.events).toHaveLength(1);
    expect(listed.events[0]?.bookingId).toBe(booking.id);
    expect(listed.events[0]?.action).toBe("teacher_approved");

    const byBookingResponse = await getBookingEventsByBooking(new Request(`http://localhost/api/booking-events/${booking.id}`), {
      params: {
        bookingId: booking.id
      }
    });
    expect(byBookingResponse.status).toBe(200);
    const byBooking = await asJson<{ events: Array<{ bookingId: string }> }>(byBookingResponse);
    expect(byBooking.events).toHaveLength(1);
    expect(byBooking.events[0]?.bookingId).toBe(booking.id);
  });
});

