import { describe, expect, it } from "vitest";

import {
  LEGACY_BOOKINGS_STORAGE_KEY,
  LESSON_BOOKINGS_STORAGE_KEY,
  LessonBookingRequest,
  buildBookingId,
  formatBookingSlotLabel,
  parseSlotToDateTime,
  readLessonBookings,
  updateLessonBooking,
  upsertLessonBooking
} from "@/lib/lesson-bookings";

function createBooking(partial?: Partial<LessonBookingRequest>): LessonBookingRequest {
  return {
    id: "booking-1",
    courseId: "course-1",
    teacherId: "teacher-1",
    teacherName: "Анна Смирнова",
    studentId: "student-1",
    studentName: "Иван Петров",
    subject: "Английский язык",
    slot: "2026-04-10 18:00",
    startAt: "2026-04-10T15:00:00.000Z",
    durationMinutes: 60,
    createdAt: "2026-04-01T10:00:00.000Z",
    updatedAt: "2026-04-01T10:00:00.000Z",
    status: "pending",
    ...partial
  };
}

describe("lesson bookings storage", () => {
  it("reads empty list when storage is empty", () => {
    expect(readLessonBookings()).toEqual([]);
  });

  it("upserts and sorts bookings by updatedAt desc", () => {
    upsertLessonBooking(
      createBooking({
        id: "booking-old",
        updatedAt: "2026-04-01T10:00:00.000Z"
      })
    );
    upsertLessonBooking(
      createBooking({
        id: "booking-new",
        updatedAt: "2026-04-02T10:00:00.000Z"
      })
    );

    const rows = readLessonBookings();
    expect(rows).toHaveLength(2);
    expect(rows[0]?.id).toBe("booking-new");
    expect(rows[1]?.id).toBe("booking-old");
  });

  it("updates booking status and payment fields", () => {
    upsertLessonBooking(createBooking({ id: "booking-pay" }));

    const next = updateLessonBooking("booking-pay", {
      status: "paid",
      amountRubles: 2490,
      paidAt: "2026-04-02T11:30:00.000Z"
    });
    const updated = next.find((item) => item.id === "booking-pay");

    expect(updated?.status).toBe("paid");
    expect(updated?.amountRubles).toBe(2490);
    expect(updated?.paidAt).toBe("2026-04-02T11:30:00.000Z");
  });

  it("migrates legacy bookings into new storage format", () => {
    window.localStorage.setItem(
      LEGACY_BOOKINGS_STORAGE_KEY,
      JSON.stringify([
        {
          id: "legacy-1",
          courseId: "course-legacy",
          teacherId: "teacher-legacy",
          teacherName: "Legacy Teacher",
          subject: "Математика",
          slot: "2026-05-15 12:30",
          startAt: "2026-05-15T09:30:00.000Z",
          durationMinutes: 45,
          createdAt: "2026-04-05T10:00:00.000Z"
        }
      ])
    );

    const migrated = readLessonBookings();
    expect(migrated).toHaveLength(1);
    expect(migrated[0]?.id).toBe("legacy-1");
    expect(migrated[0]?.status).toBe("paid");
    expect(migrated[0]?.source).toBe("lessons_page");
    expect(window.localStorage.getItem(LESSON_BOOKINGS_STORAGE_KEY)).toBeTruthy();
  });
});

describe("lesson booking helpers", () => {
  it("builds deterministic booking id", () => {
    expect(
      buildBookingId({
        teacherId: "teacher-7",
        courseId: "course-9",
        slot: "2026-04-10 18:30"
      })
    ).toBe("teacher-7__course-9__2026-04-10_18-30");
  });

  it("parses slot value and formats a readable label", () => {
    const isoValue = parseSlotToDateTime("2026-04-10 18:30");
    expect(isoValue).toBe("2026-04-10T18:30:00+03:00");

    const label = formatBookingSlotLabel("2026-04-10 18:30");
    expect(label).toContain("апреля");
    expect(label).toContain("18:30");
  });
});
