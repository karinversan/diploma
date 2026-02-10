import { NextResponse } from "next/server";

import { patchBooking } from "@/lib/server/booking-store";

export const runtime = "nodejs";

type BookingUpdate = {
  status?: "pending" | "awaiting_payment" | "paid" | "reschedule_proposed" | "declined" | "cancelled";
  teacherMessage?: string;
  proposedSlot?: string;
  slot?: string;
  startAt?: string;
  updatedAt?: string;
  paidAt?: string;
  amountRubles?: number;
};

type PatchBookingBody = {
  update?: BookingUpdate;
};

type BookingByIdRouteContext = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, context: BookingByIdRouteContext) {
  let body: PatchBookingBody;

  try {
    body = (await request.json()) as PatchBookingBody;
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  const id = context.params?.id;
  if (!id) {
    return NextResponse.json({ error: "Не передан id бронирования" }, { status: 400 });
  }

  const update = body.update;
  if (!update || typeof update !== "object") {
    return NextResponse.json({ error: "Не передан update" }, { status: 400 });
  }

  const bookings = await patchBooking(id, update);
  return NextResponse.json({ bookings }, { status: 200 });
}

