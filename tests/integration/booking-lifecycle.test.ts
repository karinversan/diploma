import { describe, expect, it } from "vitest";

import { createBookingEvent, readBookingEventsForBooking } from "@/lib/booking-events";
import { LessonBookingRequest, readLessonBookings, updateLessonBooking, upsertLessonBooking } from "@/lib/lesson-bookings";

function createPendingBooking(id = "booking-flow-1"): LessonBookingRequest {
  return {
    id,
    courseId: "course-business-1",
    teacherId: "teacher-jenny",
    teacherName: "Дженни Уилсон",
    studentId: "student-ivan",
    studentName: "Иван Петров",
    subject: "Экономика",
    slot: "2026-04-10 19:00",
    startAt: "2026-04-10T16:00:00.000Z",
    durationMinutes: 60,
    createdAt: "2026-04-01T09:00:00.000Z",
    updatedAt: "2026-04-01T09:00:00.000Z",
    status: "pending",
    source: "course_dialog"
  };
}

describe("booking lifecycle integration", () => {
  it("runs end-to-end request flow: pending -> awaiting_payment -> paid", () => {
    const booking = createPendingBooking();
    upsertLessonBooking(booking);

    createBookingEvent({
      bookingId: booking.id,
      actor: "student",
      action: "student_created",
      title: "Заявка создана",
      description: "Ученик выбрал слот и отправил заявку.",
      createdAt: "2026-04-01T09:01:00.000Z"
    });

    updateLessonBooking(booking.id, {
      status: "awaiting_payment",
      teacherMessage: "Слот подтвержден, ожидаем оплату.",
      updatedAt: "2026-04-01T09:30:00.000Z"
    });
    createBookingEvent({
      bookingId: booking.id,
      actor: "teacher",
      action: "teacher_approved",
      title: "Слот подтвержден",
      description: "Преподаватель подтвердил заявку.",
      createdAt: "2026-04-01T09:31:00.000Z"
    });

    updateLessonBooking(booking.id, {
      status: "paid",
      amountRubles: 2490,
      paidAt: "2026-04-01T10:00:00.000Z",
      updatedAt: "2026-04-01T10:00:00.000Z"
    });
    createBookingEvent({
      bookingId: booking.id,
      actor: "student",
      action: "payment_success",
      title: "Оплата прошла",
      description: "Ученик успешно оплатил занятие.",
      createdAt: "2026-04-01T10:00:30.000Z"
    });

    const finalBooking = readLessonBookings().find((item) => item.id === booking.id);
    const timeline = readBookingEventsForBooking(booking.id);

    expect(finalBooking?.status).toBe("paid");
    expect(finalBooking?.amountRubles).toBe(2490);
    expect(finalBooking?.paidAt).toBe("2026-04-01T10:00:00.000Z");

    expect(timeline.map((event) => event.action)).toEqual(["student_created", "teacher_approved", "payment_success"]);
    expect(new Date(timeline[0]!.createdAt).getTime()).toBeLessThan(new Date(timeline[2]!.createdAt).getTime());
  });
});
