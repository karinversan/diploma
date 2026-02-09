"use client";

import Link from "next/link";
import { CheckCircle2, Filter, Landmark, Plus, Search, Wifi } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import {
  paymentCards,
  paymentSettingsTabs,
  paymentStatusFilters,
  paymentTransactions,
  type PaymentCard,
  type PaymentTransactionStatus
} from "@/data/payments";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 5;

const statusBadgeStyles: Record<PaymentTransactionStatus, string> = {
  Оплачен: "bg-emerald-100 text-emerald-700",
  "В обработке": "bg-amber-100 text-amber-700",
  Возврат: "bg-blue-100 text-blue-700",
  Отменен: "bg-rose-100 text-rose-700"
};

const cardThemeStyles: Record<PaymentCard["theme"], string> = {
  dark: "bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.14),rgba(255,255,255,0)_55%),linear-gradient(155deg,#1a1f2d,#0f1320)] text-white",
  purple: "bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.35),transparent_48%),linear-gradient(135deg,#c8b3ff,#a07cff)] text-slate-900",
  light: "bg-[linear-gradient(145deg,#f8f9ff,#eef2ff)] text-slate-900"
};

function formatAmount(amount: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(amount);
}

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(dateValue));
}

function maskCardNumber(last4: string) {
  return `1234 1234 1234 ${last4}`;
}

function PaymentCardTile({
  card,
  isSelected,
  onSelect
}: {
  card: PaymentCard;
  isSelected: boolean;
  onSelect: (cardId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(card.id)}
      className={cn(
        "w-full rounded-[24px] border p-4 text-left shadow-card transition hover:-translate-y-0.5",
        isSelected ? "border-primary ring-2 ring-primary/25" : "border-border",
        cardThemeStyles[card.theme]
      )}
      aria-pressed={isSelected}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-base font-semibold">{card.bankName}</p>
        <Wifi className="h-4 w-4 opacity-80" />
      </div>
      <p className="mt-6 text-xs uppercase tracking-[0.12em] opacity-80">{card.holderName}</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="text-lg font-semibold tracking-[0.08em]">{maskCardNumber(card.last4)}</p>
        <p className="text-xs font-semibold opacity-80">{card.brand}</p>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-xs opacity-80">Срок: {card.exp}</span>
        {isSelected ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-[11px] font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Основная
          </span>
        ) : null}
      </div>
    </button>
  );
}

export default function PaymentsPage() {
  const [cards, setCards] = useState(paymentCards);
  const [selectedCardId, setSelectedCardId] = useState(paymentCards.find((card) => card.isPrimary)?.id ?? paymentCards[0]?.id ?? "");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof paymentStatusFilters)[number]["id"]>("all");
  const [selectedCardFilter, setSelectedCardFilter] = useState<"all" | string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [newCard, setNewCard] = useState({
    bankName: "",
    holderName: "",
    last4: "",
    exp: "",
    brand: "Visa" as PaymentCard["brand"],
    theme: "light" as PaymentCard["theme"]
  });

  useEffect(() => {
    setPage(1);
  }, [searchValue, statusFilter, selectedCardFilter]);

  const cardsById = useMemo(() => new Map(cards.map((card) => [card.id, card])), [cards]);

  const filteredTransactions = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return paymentTransactions.filter((transaction) => {
      if (statusFilter !== "all" && transaction.status !== statusFilter) {
        return false;
      }

      if (selectedCardFilter !== "all" && transaction.cardId !== selectedCardFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      const linkedCard = cardsById.get(transaction.cardId);
      const searchable = [transaction.invoice, transaction.productTitle, transaction.teacherName, linkedCard?.last4 ?? ""]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [cardsById, searchValue, selectedCardFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const paginatedTransactions = filteredTransactions.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleAddCard = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedLast4 = newCard.last4.replace(/\D/g, "").slice(-4);
    if (newCard.bankName.trim().length < 2 || newCard.holderName.trim().length < 2 || normalizedLast4.length !== 4 || !newCard.exp.trim()) {
      return;
    }

    const cardId = `card-${Date.now()}`;
    setCards((prev) => [
      ...prev,
      {
        id: cardId,
        bankName: newCard.bankName.trim(),
        holderName: newCard.holderName.trim(),
        last4: normalizedLast4,
        exp: newCard.exp.trim(),
        brand: newCard.brand,
        theme: newCard.theme,
        isPrimary: false
      }
    ]);

    setSelectedCardId(cardId);
    setSelectedCardFilter("all");
    setNewCard({ bankName: "", holderName: "", last4: "", exp: "", brand: "Visa", theme: "light" });
    setIsAddCardOpen(false);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-border bg-white p-5 shadow-card sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Настройки</h1>
            <p className="mt-1 text-sm text-muted-foreground">Управляйте картами, смотрите историю платежей и чеки по занятиям.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-2xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-slate-50"
            >
              Отменить
            </button>
            <button type="button" className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft">
              Сохранить
            </button>
          </div>
        </div>

        <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-border pb-0.5" aria-label="Разделы настроек оплаты">
          {paymentSettingsTabs.map((tab) => {
            const isActive = tab.id === "payment";
            const href = tab.id === "payment" ? "/app/payments" : `/app/settings?tab=${tab.id}`;
            return (
              <Link
                key={tab.id}
                href={href}
                className={cn(
                  "whitespace-nowrap rounded-t-2xl px-4 py-3 text-sm font-semibold transition",
                  isActive ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 space-y-6">
            <section className="rounded-3xl border border-border bg-white p-4 shadow-soft sm:p-5">
              <h2 className="text-xl font-semibold text-foreground">Платежные данные</h2>
              <p className="mt-1 text-sm text-muted-foreground">Выберите основную карту и добавляйте новые способы оплаты для занятий.</p>

              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                {cards.map((card) => (
                  <PaymentCardTile key={card.id} card={card} isSelected={card.id === selectedCardId} onSelect={setSelectedCardId} />
                ))}

                <button
                  type="button"
                  onClick={() => setIsAddCardOpen((prev) => !prev)}
                  className="flex min-h-[196px] w-full flex-col items-center justify-center rounded-[24px] border border-dashed border-primary/45 bg-primary/5 p-4 text-center transition hover:bg-primary/10"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-soft">
                    <Plus className="h-5 w-5 text-primary" />
                  </span>
                  <span className="mt-3 text-sm font-semibold text-foreground">Добавить новую карту</span>
                  <span className="mt-1 text-xs text-muted-foreground">UI-демо без настоящей оплаты</span>
                </button>
              </div>

              {isAddCardOpen ? (
                <form onSubmit={handleAddCard} className="mt-4 rounded-2xl border border-border bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-foreground">Новая карта</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <label className="text-sm">
                      <span className="mb-1 block text-xs font-medium text-muted-foreground">Банк</span>
                      <input
                        value={newCard.bankName}
                        onChange={(event) => setNewCard((prev) => ({ ...prev, bankName: event.target.value }))}
                        className="w-full rounded-xl border border-border bg-white px-3 py-2 outline-none focus:border-primary"
                        placeholder="Название банка"
                        required
                      />
                    </label>
                    <label className="text-sm">
                      <span className="mb-1 block text-xs font-medium text-muted-foreground">Владелец</span>
                      <input
                        value={newCard.holderName}
                        onChange={(event) => setNewCard((prev) => ({ ...prev, holderName: event.target.value }))}
                        className="w-full rounded-xl border border-border bg-white px-3 py-2 outline-none focus:border-primary"
                        placeholder="Имя и фамилия"
                        required
                      />
                    </label>
                    <label className="text-sm">
                      <span className="mb-1 block text-xs font-medium text-muted-foreground">Последние 4 цифры</span>
                      <input
                        value={newCard.last4}
                        onChange={(event) => setNewCard((prev) => ({ ...prev, last4: event.target.value }))}
                        className="w-full rounded-xl border border-border bg-white px-3 py-2 outline-none focus:border-primary"
                        placeholder="1234"
                        maxLength={4}
                        required
                      />
                    </label>
                    <label className="text-sm">
                      <span className="mb-1 block text-xs font-medium text-muted-foreground">Срок действия</span>
                      <input
                        value={newCard.exp}
                        onChange={(event) => setNewCard((prev) => ({ ...prev, exp: event.target.value }))}
                        className="w-full rounded-xl border border-border bg-white px-3 py-2 outline-none focus:border-primary"
                        placeholder="MM/YY"
                        required
                      />
                    </label>
                    <label className="text-sm">
                      <span className="mb-1 block text-xs font-medium text-muted-foreground">Платежная система</span>
                      <select
                        value={newCard.brand}
                        onChange={(event) => setNewCard((prev) => ({ ...prev, brand: event.target.value as PaymentCard["brand"] }))}
                        className="w-full rounded-xl border border-border bg-white px-3 py-2 outline-none focus:border-primary"
                      >
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                        <option value="Мир">Мир</option>
                      </select>
                    </label>
                    <label className="text-sm">
                      <span className="mb-1 block text-xs font-medium text-muted-foreground">Тема карты</span>
                      <select
                        value={newCard.theme}
                        onChange={(event) => setNewCard((prev) => ({ ...prev, theme: event.target.value as PaymentCard["theme"] }))}
                        className="w-full rounded-xl border border-border bg-white px-3 py-2 outline-none focus:border-primary"
                      >
                        <option value="dark">Темная</option>
                        <option value="purple">Фиолетовая</option>
                        <option value="light">Светлая</option>
                      </select>
                    </label>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddCardOpen(false)}
                      className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground"
                    >
                      Закрыть
                    </button>
                    <button type="submit" className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
                      Добавить карту
                    </button>
                  </div>
                </form>
              ) : null}
            </section>

            <section className="rounded-3xl border border-border bg-white p-4 shadow-soft sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Детали транзакций</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Смотрите историю оплат и статусы возвратов по каждому заказу.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition",
                    isFilterOpen ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:bg-slate-50"
                  )}
                >
                  <Filter className="h-4 w-4" />
                  Фильтры
                </button>
              </div>

              {isFilterOpen ? (
                <div className="mt-4 grid gap-3 rounded-2xl border border-border bg-slate-50 p-3 md:grid-cols-3">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-muted-foreground">Поиск</span>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                        placeholder="Счет, курс или преподаватель"
                        className="w-full rounded-xl border border-border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
                      />
                    </div>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-muted-foreground">Статус</span>
                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value as (typeof paymentStatusFilters)[number]["id"])}
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                    >
                      {paymentStatusFilters.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-muted-foreground">Карта</span>
                    <select
                      value={selectedCardFilter}
                      onChange={(event) => setSelectedCardFilter(event.target.value)}
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                    >
                      <option value="all">Все карты</option>
                      {cards.map((card) => (
                        <option key={card.id} value={card.id}>
                          {card.brand} •••• {card.last4}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ) : null}

              <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
                <table className="min-w-[760px] divide-y divide-border text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Счет</th>
                      <th className="px-4 py-3">Дата</th>
                      <th className="px-4 py-3">Статус</th>
                      <th className="px-4 py-3">Продукт</th>
                      <th className="px-4 py-3">Карта</th>
                      <th className="px-4 py-3 text-right">Сумма</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-white">
                    {paginatedTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                          По заданным фильтрам транзакции не найдены.
                        </td>
                      </tr>
                    ) : (
                      paginatedTransactions.map((transaction) => {
                        const linkedCard = cardsById.get(transaction.cardId);
                        return (
                          <tr key={transaction.id}>
                            <td className="px-4 py-3 font-semibold text-foreground">{transaction.invoice}</td>
                            <td className="px-4 py-3 text-muted-foreground">{formatDate(transaction.date)}</td>
                            <td className="px-4 py-3">
                              <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusBadgeStyles[transaction.status])}>
                                {transaction.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-start gap-2">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                  <Landmark className="h-4 w-4" />
                                </span>
                                <div>
                                  <p className="font-semibold text-foreground">{transaction.productTitle}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {transaction.productSubtitle} · {transaction.teacherName}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">
                              {linkedCard ? `${linkedCard.brand} •••• ${linkedCard.last4}` : "Карта не найдена"}
                            </td>
                            <td className={cn("px-4 py-3 text-right font-semibold", transaction.amount < 0 ? "text-emerald-700" : "text-foreground")}>
                              {formatAmount(transaction.amount)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Показано {filteredTransactions.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–
                  {Math.min(safePage * PAGE_SIZE, filteredTransactions.length)} из {filteredTransactions.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    className="rounded-xl border border-border px-3 py-1.5 text-sm font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-45"
                    disabled={safePage <= 1}
                  >
                    Назад
                  </button>
                  {Array.from({ length: pageCount }).map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setPage(pageNumber)}
                        className={cn(
                          "h-9 w-9 rounded-xl text-sm font-semibold transition",
                          pageNumber === safePage ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-slate-50"
                        )}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
                    className="rounded-xl border border-border px-3 py-1.5 text-sm font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-45"
                    disabled={safePage >= pageCount}
                  >
                    Вперед
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-medium text-foreground">
                Выбранная основная карта:{" "}
                <span className="font-semibold">
                  {cards.find((card) => card.id === selectedCardId)?.brand} ••••{" "}
                  {cards.find((card) => card.id === selectedCardId)?.last4}
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">При следующих покупках она будет подставляться автоматически (демо-логика).</p>
            </section>
        </div>
      </section>
    </div>
  );
}
