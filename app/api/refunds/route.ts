import { NextResponse } from "next/server";

import type { RefundTicket } from "@/data/admin";
import { createRefundTicket, listRefundTickets } from "@/lib/server/refund-store";

export const runtime = "nodejs";

type CreateRefundBody = {
  ticket?: {
    bookingId?: string;
    invoice?: string;
    studentName?: string;
    amountRubles?: number;
    reason?: string;
    createdAt?: string;
    status?: RefundTicket["status"];
  };
};

export async function GET() {
  const tickets = await listRefundTickets();
  return NextResponse.json({ tickets }, { status: 200 });
}

export async function POST(request: Request) {
  let body: CreateRefundBody;

  try {
    body = (await request.json()) as CreateRefundBody;
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  const ticket = body.ticket;
  if (!ticket) {
    return NextResponse.json({ error: "Не передан ticket" }, { status: 400 });
  }
  if (typeof ticket.invoice !== "string" || !ticket.invoice.trim()) {
    return NextResponse.json({ error: "Поле invoice обязательно" }, { status: 400 });
  }
  if (typeof ticket.studentName !== "string" || !ticket.studentName.trim()) {
    return NextResponse.json({ error: "Поле studentName обязательно" }, { status: 400 });
  }
  if (typeof ticket.amountRubles !== "number" || ticket.amountRubles <= 0) {
    return NextResponse.json({ error: "Поле amountRubles должно быть положительным числом" }, { status: 400 });
  }
  if (typeof ticket.reason !== "string" || !ticket.reason.trim()) {
    return NextResponse.json({ error: "Поле reason обязательно" }, { status: 400 });
  }

  const created = await createRefundTicket({
    bookingId: ticket.bookingId,
    invoice: ticket.invoice,
    studentName: ticket.studentName,
    amountRubles: ticket.amountRubles,
    reason: ticket.reason,
    createdAt: ticket.createdAt,
    status: ticket.status
  });

  return NextResponse.json(created, { status: 200 });
}
