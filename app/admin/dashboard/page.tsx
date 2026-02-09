"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, ShieldAlert, Sparkles, XCircle } from "lucide-react";

import { platformKpis, tutorVerificationQueue, type TutorVerificationRequest } from "@/data/admin";
import { cn } from "@/lib/utils";

function formatDate(value: string) {
  const datePart = value.slice(0, 10);
  const [year, month, day] = datePart.split("-");
  return `${day}.${month}.${year}`;
}

export default function AdminDashboardPage() {
  const [verificationQueue, setVerificationQueue] = useState(tutorVerificationQueue);

  const pendingCount = useMemo(
    () => verificationQueue.filter((item) => item.status === "pending").length,
    [verificationQueue]
  );

  const updateVerification = (requestId: string, status: TutorVerificationRequest["status"], note: string) => {
    setVerificationQueue((prev) =>
      prev.map((item) => (item.id === requestId ? { ...item, status, note } : item))
    );
  };

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <h1 className="text-3xl font-semibold text-foreground">Операционный обзор платформы</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Центр контроля ролей, качества и ключевых пользовательских сценариев по плану дипломного проекта.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {platformKpis.map((kpi) => (
            <article key={kpi.id} className="rounded-2xl border border-border bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{kpi.value}</p>
              <p
                className={cn(
                  "mt-1 text-xs font-medium",
                  kpi.trend === "up"
                    ? "text-emerald-700"
                    : kpi.trend === "down"
                      ? "text-rose-700"
                      : "text-slate-600"
                )}
              >
                {kpi.delta}
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
        <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Верификация преподавателей</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ожидают решения: <span className="font-semibold text-foreground">{pendingCount}</span>
              </p>
            </div>
            <Link href="/admin/users" className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">
              Все пользователи
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {verificationQueue.map((request) => (
              <article key={request.id} className="rounded-2xl border border-border bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-foreground">{request.tutorName}</p>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      request.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : request.status === "rejected"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                    )}
                  >
                    {request.status === "pending"
                      ? "На проверке"
                      : request.status === "approved"
                        ? "Одобрен"
                        : "Отклонен"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Предметы: {request.subjects.join(", ")} · Опыт: {request.experienceYears} лет · Заявка от {formatDate(request.submittedAt)}
                </p>
                {request.note ? <p className="mt-1 text-xs text-muted-foreground">Комментарий: {request.note}</p> : null}

                {request.status === "pending" ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => updateVerification(request.id, "approved", "Профиль прошел модерацию")}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Одобрить
                    </button>
                    <button
                      type="button"
                      onClick={() => updateVerification(request.id, "rejected", "Требуется доработка документов")}
                      className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Отклонить
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <article className="rounded-3xl border border-primary/20 bg-primary/5 p-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              ИИ и качество
            </p>
            <h2 className="mt-3 text-xl font-semibold text-foreground">Контроль точности ИИ-модулей</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Проверяйте качество распознавания речи, конспектов, рекомендаций и переводов в одном разделе.
            </p>
            <Link href="/admin/quality" className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Открыть качество и тесты
            </Link>
          </article>

          <article className="rounded-3xl border border-border bg-white p-5 shadow-card">
            <p className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              <ShieldAlert className="h-3.5 w-3.5" />
              Операционные действия
            </p>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>1. Проверка новых преподавателей и подтверждение профилей.</p>
              <p>2. Контроль очереди заявок на возвраты и спорные занятия.</p>
              <p>3. Мониторинг тестовых прогонов (unit/integration/e2e) перед релизом.</p>
              <p>4. Анализ UX-метрик: конверсия в урок, удержание и завершение домашек.</p>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
