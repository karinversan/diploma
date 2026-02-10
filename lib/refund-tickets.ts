import { refundTickets, type RefundTicket } from "@/data/admin";
import { emitStorageSyncEvent } from "@/lib/storage-sync";

export const REFUND_TICKETS_STORAGE_KEY = "refund-tickets-v1";

type CreateRefundTicketPayload = {
  bookingId: string;
  invoice: string;
  studentName: string;
  amountRubles: number;
  reason: string;
};
export type { CreateRefundTicketPayload };

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function parseJson<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function toIso(value: unknown) {
  return typeof value === "string" && value ? value : new Date().toISOString();
}

function normalizeTicket(raw: Partial<RefundTicket>): RefundTicket | null {
  if (
    typeof raw?.id !== "string" ||
    typeof raw.invoice !== "string" ||
    typeof raw.studentName !== "string" ||
    typeof raw.amountRubles !== "number" ||
    typeof raw.reason !== "string"
  ) {
    return null;
  }

  return {
    id: raw.id,
    bookingId: typeof raw.bookingId === "string" ? raw.bookingId : undefined,
    invoice: raw.invoice,
    studentName: raw.studentName,
    amountRubles: raw.amountRubles,
    reason: raw.reason,
    createdAt: toIso(raw.createdAt),
    status: raw.status === "approved" || raw.status === "declined" || raw.status === "pending" ? raw.status : "pending"
  };
}

export function readRefundTickets(): RefundTicket[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = parseJson<Partial<RefundTicket>[]>(window.localStorage.getItem(REFUND_TICKETS_STORAGE_KEY));
  if (Array.isArray(raw)) {
    return raw
      .map((item) => normalizeTicket(item))
      .filter((item): item is RefundTicket => Boolean(item))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  writeRefundTickets(refundTickets);
  return refundTickets;
}

export function writeRefundTickets(tickets: RefundTicket[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(REFUND_TICKETS_STORAGE_KEY, JSON.stringify(tickets));
  emitStorageSyncEvent();
}

export function createRefundTicket(payload: CreateRefundTicketPayload) {
  const current = readRefundTickets();
  const existingByBooking = current.find((item) => item.bookingId === payload.bookingId);

  if (existingByBooking) {
    return { next: current, item: existingByBooking, mode: "existing" as const };
  }

  const nextItem: RefundTicket = {
    id: `rf-${Date.now()}`,
    bookingId: payload.bookingId,
    invoice: payload.invoice,
    studentName: payload.studentName,
    amountRubles: payload.amountRubles,
    reason: payload.reason,
    createdAt: new Date().toISOString(),
    status: "pending"
  };

  const next = [nextItem, ...current];
  writeRefundTickets(next);
  return { next, item: nextItem, mode: "created" as const };
}

export function updateRefundTicket(ticketId: string, status: RefundTicket["status"]) {
  const current = readRefundTickets();
  const next = current.map((ticket) => (ticket.id === ticketId ? { ...ticket, status } : ticket));
  writeRefundTickets(next);
  return next;
}
