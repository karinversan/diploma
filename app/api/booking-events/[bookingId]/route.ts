import { NextResponse } from "next/server";

import { listBookingEventsForBooking } from "@/lib/server/booking-store";

export const runtime = "nodejs";

type BookingEventsByIdRouteContext = {
  params: {
    bookingId: string;
  };
};

export async function GET(_: Request, context: BookingEventsByIdRouteContext) {
  const bookingId = context.params?.bookingId;
  if (!bookingId) {
    return NextResponse.json({ error: "Не передан bookingId" }, { status: 400 });
  }

  const events = await listBookingEventsForBooking(bookingId);
  return NextResponse.json({ events }, { status: 200 });
}

