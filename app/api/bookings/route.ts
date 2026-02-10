import { NextResponse } from "next/server";

import type { LessonBookingRequest } from "@/lib/lesson-bookings";
import { listBookings, upsertBooking } from "@/lib/server/booking-store";

export const runtime = "nodejs";

type UpsertBookingBody = {
  booking?: LessonBookingRequest;
};

export async function GET() {
  const bookings = await listBookings();
  return NextResponse.json({ bookings }, { status: 200 });
}

export async function POST(request: Request) {
  let body: UpsertBookingBody;

  try {
    body = (await request.json()) as UpsertBookingBody;
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  const booking = body.booking;
  if (!booking || typeof booking.id !== "string") {
    return NextResponse.json({ error: "Не передан объект booking" }, { status: 400 });
  }

  const bookings = await upsertBooking(booking);
  return NextResponse.json({ bookings }, { status: 200 });
}

