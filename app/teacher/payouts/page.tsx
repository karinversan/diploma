import { Filter, Plus } from "lucide-react";

import { teacherPayoutTransactions } from "@/data/teacher-cabinet";
import { cn } from "@/lib/utils";

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function formatAmount(value: number) {
  const normalized = Math.abs(value).toLocaleString("ru-RU");
  return `${value < 0 ? "-" : ""}${normalized} ₽`;
}

function getStatusClass(status: "Завершено" | "В обработке" | "Возврат") {
  if (status === "Завершено") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (status === "В обработке") {
    return "bg-accent/70 text-slate-900";
  }
  return "bg-rose-100 text-rose-700";
}

export default function TeacherPayoutsPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <h1 className="text-3xl font-semibold text-foreground">Выплаты и реквизиты</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Выберите основной счет для выплат и контролируйте все поступления по занятиям.
        </p>

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

      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Детали транзакций</h2>
            <p className="mt-1 text-sm text-muted-foreground">История поступлений, возвратов и текущих выплат.</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground"
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
              {teacherPayoutTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold text-foreground">#{transaction.id.replace("pay-", "30")}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(transaction.date)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", getStatusClass(transaction.status))}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground">{transaction.source}</td>
                  <td className="px-4 py-3 text-muted-foreground">{transaction.studentName}</td>
                  <td className={cn("px-4 py-3 text-right text-base font-semibold", transaction.amount < 0 ? "text-emerald-700" : "text-foreground")}>
                    {formatAmount(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">Показано 1–4 из 4</p>
          <div className="inline-flex items-center gap-2">
            <button type="button" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-muted-foreground">
              Назад
            </button>
            <button type="button" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              1
            </button>
            <button type="button" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground">
              2
            </button>
            <button type="button" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground">
              Вперед
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
