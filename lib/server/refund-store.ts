import fs from "node:fs/promises";
import path from "node:path";

import { refundTickets, type RefundTicket } from "@/data/admin";

function resolveStorePath() {
  return process.env.SKILLZONE_REFUND_STORE_PATH || path.join("/tmp", "skillzone-refund-store-v1.json");
}

type RefundStore = {
  tickets: RefundTicket[];
};

type CreateRefundPayload = Omit<RefundTicket, "id" | "createdAt" | "status"> & {
  id?: string;
  createdAt?: string;
  status?: RefundTicket["status"];
};

type RefundUpdate = Partial<Pick<RefundTicket, "status" | "reason" | "invoice" | "amountRubles" | "studentName">>;

function sortTickets(tickets: RefundTicket[]) {
  return [...tickets].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

function fallbackStore(): RefundStore {
  return {
    tickets: sortTickets(refundTickets.map((ticket) => ({ ...ticket })))
  };
}

async function ensureStoreFile() {
  const storePath = resolveStorePath();
  try {
    await fs.access(storePath);
  } catch {
    await fs.writeFile(storePath, JSON.stringify(fallbackStore(), null, 2), "utf-8");
  }
}

async function readStore(): Promise<RefundStore> {
  const storePath = resolveStorePath();
  await ensureStoreFile();

  try {
    const raw = await fs.readFile(storePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<RefundStore>;
    return {
      tickets: Array.isArray(parsed.tickets) ? sortTickets(parsed.tickets) : fallbackStore().tickets
    };
  } catch {
    return fallbackStore();
  }
}

async function writeStore(store: RefundStore) {
  const normalized = {
    tickets: sortTickets(store.tickets)
  };

  await fs.writeFile(resolveStorePath(), JSON.stringify(normalized, null, 2), "utf-8");
  return normalized;
}

export async function listRefundTickets() {
  const store = await readStore();
  return sortTickets(store.tickets);
}

export async function createRefundTicket(payload: CreateRefundPayload) {
  const store = await readStore();
  const duplicate = payload.bookingId ? store.tickets.find((ticket) => ticket.bookingId === payload.bookingId) : undefined;

  if (duplicate) {
    return {
      tickets: sortTickets(store.tickets),
      item: duplicate,
      mode: "existing" as const
    };
  }

  const item: RefundTicket = {
    id: payload.id ?? `rf-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    bookingId: payload.bookingId,
    invoice: payload.invoice,
    studentName: payload.studentName,
    amountRubles: payload.amountRubles,
    reason: payload.reason,
    createdAt: payload.createdAt ?? new Date().toISOString(),
    status: payload.status ?? "pending"
  };

  store.tickets.push(item);
  const next = await writeStore(store);
  return {
    tickets: next.tickets,
    item,
    mode: "created" as const
  };
}

export async function patchRefundTicket(ticketId: string, update: RefundUpdate) {
  const store = await readStore();

  store.tickets = store.tickets.map((ticket) => {
    if (ticket.id !== ticketId) {
      return ticket;
    }

    return {
      ...ticket,
      ...update
    };
  });

  const next = await writeStore(store);
  return next.tickets;
}
