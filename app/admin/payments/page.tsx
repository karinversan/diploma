"use client";

import { useEffect, useMemo, useState } from "react";

import { type RefundTicket } from "@/data/admin";
import { readRefundTickets, updateRefundTicket } from "@/lib/refund-tickets";
import { cn } from "@/lib/utils";

function formatDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-");
  return `${day}.${month}.${year}`;
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(amount);
}

export default function AdminPaymentsPage() {
  const [tickets, setTickets] = useState<RefundTicket[]>([]);

  useEffect(() => {
    setTickets(readRefundTickets());
    const syncTickets = () => setTickets(readRefundTickets());
    window.addEventListener("storage", syncTickets);
    return () => window.removeEventListener("storage", syncTickets);
  }, []);

  const totalPendingAmount = useMemo(() => {
    return tickets
      .filter((ticket) => ticket.status === "pending")
      .reduce((acc, ticket) => acc + ticket.amountRubles, 0);
  }, [tickets]);

  const updateTicket = (ticketId: string, status: RefundTicket["status"]) => {
    setTickets(updateRefundTicket(ticketId, status));
  };

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <h1 className="text-3xl font-semibold text-foreground">Платежи и возвраты</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Обрабатывайте спорные оплаты занятий. В очереди на решение: {tickets.filter((t) => t.status === "pending").length} заявок.
        </p>

        <div className="mt-4 inline-flex rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
          Сумма ожидающих возвратов: {formatAmount(totalPendingAmount)}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-border bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full text-sm">
            <thead className="border-b border-border bg-slate-50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Заявка</th>
                <th className="px-4 py-3">Счет</th>
                <th className="px-4 py-3">Ученик</th>
                <th className="px-4 py-3">Причина</th>
                <th className="px-4 py-3">Сумма</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-4 py-3 font-semibold text-foreground">{ticket.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {ticket.invoice}
                    <p className="text-xs">{formatDate(ticket.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3 text-foreground">{ticket.studentName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{ticket.reason}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{formatAmount(ticket.amountRubles)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        ticket.status === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : ticket.status === "declined"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                      )}
                    >
                      {ticket.status === "pending"
                        ? "Ожидает решения"
                        : ticket.status === "approved"
                          ? "Одобрен"
                          : "Отклонен"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {ticket.status === "pending" ? (
                      <div className="inline-flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => updateTicket(ticket.id, "approved")}
                          className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Одобрить
                        </button>
                        <button
                          type="button"
                          onClick={() => updateTicket(ticket.id, "declined")}
                          className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Отклонить
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Решение принято</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
