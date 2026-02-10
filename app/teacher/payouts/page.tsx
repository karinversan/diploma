"use client";

import { Filter, Plus, Search, WalletCards } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { type RefundTicket } from "@/data/admin";
import {
  teacherCabinetProfile,
  teacherPayoutTransactions,
  type TeacherPayoutStatus,
  type TeacherPayoutTransaction
} from "@/data/teacher-cabinet";
import { type LessonBookingRequest, readLessonBookings } from "@/lib/lesson-bookings";
import { readRefundTickets } from "@/lib/refund-tickets";
import { STORAGE_SYNC_EVENT } from "@/lib/storage-sync";
import { cn } from "@/lib/utils";

type PayoutFilter = "all" | TeacherPayoutStatus;

function parseDateSafe(value: string) {
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }
  return new Date(`${value}T00:00:00`);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(parseDateSafe(value));
}

function formatAmount(value: number) {
  const normalized = Math.abs(value).toLocaleString("ru-RU");
  return `${value < 0 ? "-" : ""}${normalized} ₽`;
}

function formatTransactionId(id: string) {
  if (id.startsWith("pay-")) {
    return `#${id.replace("pay-", "30")}`;
  }

  if (id.startsWith("lesson-")) {
    return `#L-${id.slice(-6).toUpperCase()}`;
  }

  if (id.startsWith("refund-")) {
    return `#R-${id.slice(-6).toUpperCase()}`;
  }

  return `#${id}`;
}

function getStatusClass(status: TeacherPayoutStatus) {
  if (status === "Завершено") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (status === "В обработке") {
    return "bg-accent/70 text-slate-900";
  }
  return "bg-rose-100 text-rose-700";
}

function bookingToPayout(booking: LessonBookingRequest): TeacherPayoutTransaction {
  const isLessonCompleted = new Date(booking.startAt).getTime() <= Date.now();
  const teacherShare = Math.round((booking.amountRubles ?? 1990) * 0.8);

  return {
    id: `lesson-${booking.id}`,
    date: booking.paidAt ?? booking.updatedAt,
    source: `Индивидуальный урок: ${booking.subject}`,
    studentName: booking.studentName ?? "Ученик",
    amount: teacherShare,
    status: isLessonCompleted ? "Завершено" : "В обработке"
  };
}

function refundToPayout(refund: RefundTicket): TeacherPayoutTransaction | null {
  if (refund.status === "declined") {
    return null;
  }

  const amount = -Math.round(refund.amountRubles * 0.8);
  return {
    id: `refund-${refund.id}`,
    date: refund.createdAt,
    source: refund.status === "approved" ? "Возврат по отмененному уроку" : "Возврат в обработке",
    studentName: refund.studentName,
    amount,
    status: refund.status === "approved" ? "Возврат" : "В обработке"
  };
}

export default function TeacherPayoutsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<PayoutFilter>("all");
  const [lessonBookings, setLessonBookings] = useState<LessonBookingRequest[]>([]);
  const [refundTickets, setRefundTickets] = useState<RefundTicket[]>([]);

  useEffect(() => {
    setLessonBookings(readLessonBookings());
    setRefundTickets(readRefundTickets());

    const sync = () => {
      setLessonBookings(readLessonBookings());
      setRefundTickets(readRefundTickets());
    };

    window.addEventListener("storage", sync);
    window.addEventListener(STORAGE_SYNC_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(STORAGE_SYNC_EVENT, sync);
    };
  }, []);

  const teacherBookings = useMemo(
    () => {
      const personal = lessonBookings.filter(
        (booking) =>
          booking.teacherId === teacherCabinetProfile.id || booking.teacherName.toLowerCase() === teacherCabinetProfile.name.toLowerCase()
      );
      return personal.length > 0 ? personal : lessonBookings;
    },
    [lessonBookings]
  );

  const isDemoPayoutMode = useMemo(
    () =>
      teacherBookings.length > 0 &&
      teacherBookings.some(
        (booking) => booking.teacherId !== teacherCabinetProfile.id && booking.teacherName !== teacherCabinetProfile.name
      ),
    [teacherBookings]
  );

  const dynamicTransactions = useMemo(() => {
    const bookingIds = new Set(teacherBookings.map((booking) => booking.id));

    const lessonPayouts = teacherBookings
      .filter((booking) => booking.status === "paid")
      .map((booking) => bookingToPayout(booking));

    const refundPayouts = refundTickets
      .filter((ticket) => ticket.bookingId && bookingIds.has(ticket.bookingId))
      .map((ticket) => refundToPayout(ticket))
      .filter((ticket): ticket is TeacherPayoutTransaction => Boolean(ticket));

    return [...lessonPayouts, ...refundPayouts];
  }, [refundTickets, teacherBookings]);

  const allTransactions = useMemo(() => {
    return [...dynamicTransactions, ...teacherPayoutTransactions].sort(
      (left, right) => parseDateSafe(right.date).getTime() - parseDateSafe(left.date).getTime()
    );
  }, [dynamicTransactions]);

  const filteredTransactions = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return allTransactions.filter((transaction) => {
      if (statusFilter !== "all" && transaction.status !== statusFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [transaction.id, transaction.source, transaction.studentName].join(" ").toLowerCase().includes(query);
    });
  }, [allTransactions, searchValue, statusFilter]);

  const summary = useMemo(() => {
    const completed = filteredTransactions
      .filter((transaction) => transaction.status === "Завершено")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const processing = filteredTransactions
      .filter((transaction) => transaction.status === "В обработке")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const refunds = filteredTransactions
      .filter((transaction) => transaction.status === "Возврат")
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

    return {
      completed,
      processing,
      refunds
    };
  }, [filteredTransactions]);

  const upcomingPaidLessons = teacherBookings.filter(
    (booking) => booking.status === "paid" && new Date(booking.startAt).getTime() > Date.now()
  ).length;

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <h1 className="text-3xl font-semibold text-foreground">Выплаты и реквизиты</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Выплата по занятию формируется после оплаты учеником и закрытия урока. Здесь видны поступления и удержания по возвратам.
        </p>
        {isDemoPayoutMode ? (
          <p className="mt-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary">
            Режим демо: пока нет персональных транзакций преподавателя, поэтому отображается общий поток выплат платформы.
          </p>
        ) : null}

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <article className="rounded-3xl border border-slate-900 bg-slate-950 p-4 text-white">
            <p className="text-sm text-slate-300">Основной счет</p>
            <p className="mt-2 text-xl font-semibold">УмныйКласс Основная</p>
            <p className="mt-5 text-xs text-slate-400">СОФИЯ АНИСИМОВА</p>
            <p className="mt-1 text-2xl font-semibold tracking-[0.16em]">1234 1234 1234 3139</p>
            <p className="mt-1 text-sm text-slate-400">Срок: 10/28</p>
          </article>

          <article className="rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/30 to-primary/10 p-4">
            <p className="text-sm text-muted-foreground">Резервная карта</p>
            <p className="mt-2 text-xl font-semibold text-foreground">УмныйКласс Плюс</p>
            <p className="mt-5 text-xs text-muted-foreground">СОФИЯ АНИСИМОВА</p>
            <p className="mt-1 text-2xl font-semibold tracking-[0.16em] text-foreground">1234 1234 1234 5320</p>
            <p className="mt-1 text-sm text-muted-foreground">Срок: 08/29</p>
          </article>

          <button
            type="button"
            className="flex min-h-[198px] flex-col items-center justify-center rounded-3xl border border-dashed border-primary/40 bg-primary/5 text-center"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary">
              <Plus className="h-5 w-5" />
            </span>
            <span className="mt-3 text-lg font-semibold text-foreground">Добавить новую карту</span>
            <span className="mt-1 text-sm text-muted-foreground">Демо без реальной оплаты</span>
          </button>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-border bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Завершенные выплаты</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{formatAmount(summary.completed)}</p>
        </article>
        <article className="rounded-2xl border border-border bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">В обработке</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{formatAmount(summary.processing)}</p>
        </article>
        <article className="rounded-2xl border border-border bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Удержания / возвраты</p>
          <p className="mt-2 text-2xl font-semibold text-rose-700">{formatAmount(-summary.refunds)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Оплаченных уроков до проведения: {upcomingPaidLessons}</p>
        </article>
      </section>

      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Детали транзакций</h2>
            <p className="mt-1 text-sm text-muted-foreground">История поступлений, возвратов и текущих выплат по реальным заявкам.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
            <WalletCards className="h-4 w-4" />
            Транзакций: {filteredTransactions.length}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px_220px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              type="search"
              placeholder="Поиск по ученику, id или источнику"
              className="w-full rounded-2xl border border-border bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="sr-only">Статус</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as PayoutFilter)}
              className="w-full rounded-2xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="all">Все статусы</option>
              <option value="Завершено">Завершено</option>
              <option value="В обработке">В обработке</option>
              <option value="Возврат">Возврат</option>
            </select>
          </label>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground"
          >
            <Filter className="h-4 w-4" />
            Фильтры
          </button>
        </div>

        <div className="mt-4 overflow-x-auto rounded-3xl border border-border">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Дата</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Источник</th>
                <th className="px-4 py-3">Ученик</th>
                <th className="px-4 py-3 text-right">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    По текущим фильтрам транзакции не найдены.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t border-border">
                    <td className="px-4 py-3 font-semibold text-foreground">{formatTransactionId(transaction.id)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(transaction.date)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", getStatusClass(transaction.status))}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{transaction.source}</td>
                    <td className="px-4 py-3 text-muted-foreground">{transaction.studentName}</td>
                    <td className={cn("px-4 py-3 text-right text-base font-semibold", transaction.amount < 0 ? "text-rose-700" : "text-foreground")}>
                      {formatAmount(transaction.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
