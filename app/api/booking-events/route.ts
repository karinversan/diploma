import { NextResponse } from "next/server";

import type { BookingEvent } from "@/lib/booking-events";
import { appendBookingEvent, listBookingEvents } from "@/lib/server/booking-store";

export const runtime = "nodejs";

type CreateBookingEventPayload = Omit<BookingEvent, "id" | "createdAt"> & {
  id?: string;
  createdAt?: string;
};

type CreateBookingEventBody = {
  event?: CreateBookingEventPayload;
};

export async function GET() {
  const events = await listBookingEvents();
  return NextResponse.json({ events }, { status: 200 });
}

export async function POST(request: Request) {
  let body: CreateBookingEventBody;

  try {
    body = (await request.json()) as CreateBookingEventBody;
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  const event = body.event;
  if (!event || typeof event.bookingId !== "string") {
    return NextResponse.json({ error: "Не передан объект event" }, { status: 400 });
  }

  const next = await appendBookingEvent(event);
  return NextResponse.json(next, { status: 200 });
}

