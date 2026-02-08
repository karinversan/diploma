import { CreditCard, Package } from "lucide-react";

import { lessonPackages, paymentMethods, paymentTransactions } from "@/data/payments";

function formatAmount(amount: number) {
  const formatter = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  });

  return formatter.format(amount);
}

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(dateValue));
}

export default function PaymentsPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <h1 className="text-3xl font-semibold text-foreground">Платежи</h1>
        <p className="mt-1 text-sm text-muted-foreground">История оплат, пакеты занятий и способы оплаты</p>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="overflow-hidden rounded-3xl border border-border bg-white shadow-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-foreground">
              <CreditCard className="h-4 w-4 text-primary" />
              История платежей
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Дата</th>
                  <th className="px-4 py-3">Описание</th>
                  <th className="px-4 py-3">Сумма</th>
                  <th className="px-4 py-3">Статус</th>
                  <th className="px-4 py-3">Способ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paymentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(transaction.date)}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{transaction.description}</td>
                    <td className={`px-4 py-3 font-semibold ${transaction.amount >= 0 ? "text-foreground" : "text-emerald-700"}`}>
                      {formatAmount(transaction.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{transaction.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-3xl border border-border bg-white p-5 shadow-card">
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-foreground">
              <Package className="h-4 w-4 text-primary" />
              Пакеты занятий
            </h2>
            <div className="mt-4 space-y-3">
              {lessonPackages.map((pack) => (
                <article key={pack.id} className="rounded-2xl border border-border bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-foreground">{pack.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Осталось {pack.lessonsLeft} из {pack.totalLessons} занятий
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Действует до {formatDate(pack.expiresAt)}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-white p-5 shadow-card">
            <h2 className="text-lg font-semibold text-foreground">Способы оплаты</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {paymentMethods.map((method) => (
                <li key={method} className="rounded-2xl border border-border bg-slate-50 px-3 py-2">
                  {method}
                </li>
              ))}
            </ul>
            <button type="button" className="mt-4 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">
              Добавить способ оплаты (демо)
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
