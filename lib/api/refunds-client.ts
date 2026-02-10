"use client";

import type { RefundTicket } from "@/data/admin";
import {
  type CreateRefundTicketPayload,
  createRefundTicket,
  readRefundTickets,
  updateRefundTicket,
  writeRefundTickets
} from "@/lib/refund-tickets";

type RefundResponse = {
  tickets: RefundTicket[];
};

type CreateRefundResponse = RefundResponse & {
  item: RefundTicket;
  mode: "created" | "existing";
};

type RefundUpdate = {
  status?: RefundTicket["status"];
  reason?: string;
  invoice?: string;
  amountRubles?: number;
  studentName?: string;
};

async function requestJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      },
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function hydrateRefundsLocal(tickets: RefundTicket[]) {
  writeRefundTickets(tickets);
  return tickets;
}

export async function syncRefundTicketsFromApi() {
  const remote = await requestJson<RefundResponse>("/api/refunds");
  if (remote?.tickets) {
    return hydrateRefundsLocal(remote.tickets);
  }
  return readRefundTickets();
}

export async function createRefundTicketViaApi(payload: CreateRefundTicketPayload) {
  const remote = await requestJson<CreateRefundResponse>("/api/refunds", {
    method: "POST",
    body: JSON.stringify({ ticket: payload })
  });

  if (remote?.tickets && remote.item) {
    hydrateRefundsLocal(remote.tickets);
    return {
      next: remote.tickets,
      item: remote.item,
      mode: remote.mode
    };
  }

  return createRefundTicket(payload);
}

export async function updateRefundTicketViaApi(ticketId: string, update: RefundUpdate) {
  const remote = await requestJson<RefundResponse>(`/api/refunds/${encodeURIComponent(ticketId)}`, {
    method: "PATCH",
    body: JSON.stringify({ update })
  });

  if (remote?.tickets) {
    return hydrateRefundsLocal(remote.tickets);
  }

  if (typeof update.status === "string") {
    return updateRefundTicket(ticketId, update.status);
  }

  return readRefundTickets();
}
