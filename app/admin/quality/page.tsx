"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Play, RefreshCw, TriangleAlert } from "lucide-react";

import { aiQualityMetrics, testRuns, uxMetrics } from "@/data/admin";
import { cn } from "@/lib/utils";

type RunStatus = {
  kind: "ok" | "warning";
  text: string;
};

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) {
    return `${seconds}с`;
  }
  return `${minutes}м ${String(seconds).padStart(2, "0")}с`;
}

function formatDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-");
  return `${day}.${month}.${year}`;
}

export default function AdminQualityPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [lastRunAt, setLastRunAt] = useState<string | null>(null);

  const runStatuses = useMemo<Record<string, RunStatus>>(() => {
    return testRuns.reduce<Record<string, RunStatus>>((acc, run) => {
      const passRate = run.passed / run.total;
      acc[run.id] = passRate >= 0.95 ? { kind: "ok", text: "Стабильно" } : { kind: "warning", text: "Нужна проверка" };
      return acc;
    }, {});
  }, []);

  const triggerSmokeRun = () => {
    setIsRunning(true);
    window.setTimeout(() => {
      setIsRunning(false);
      setLastRunAt(new Date().toISOString());
    }, 1200);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Качество и тестирование</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Раздел соответствует плану главы 4: контроль unit/integration/e2e, UX-метрик и качества ИИ-модулей.
            </p>
          </div>
          <button
            type="button"
            onClick={triggerSmokeRun}
            disabled={isRunning}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-70"
          >
            {isRunning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {isRunning ? "Запуск smoke-проверки…" : "Запустить smoke-проверку"}
          </button>
        </div>

        {lastRunAt ? (
          <p className="mt-3 text-xs text-muted-foreground">Последний запуск smoke-проверки: {formatDate(lastRunAt)}</p>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {testRuns.map((run) => {
          const passRate = Math.round((run.passed / run.total) * 100);
          const status = runStatuses[run.id];

          return (
            <article key={run.id} className="rounded-2xl border border-border bg-white p-4 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{run.suite}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{passRate}%</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {run.passed}/{run.total} пройдено · {run.failed} упало · {formatDuration(run.durationSeconds)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Обновлено: {formatDate(run.updatedAt)}</p>
              <span
                className={cn(
                  "mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                  status.kind === "ok" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                )}
              >
                {status.kind === "ok" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <TriangleAlert className="h-3.5 w-3.5" />}
                {status.text}
              </span>
            </article>
          );
        })}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <h2 className="text-xl font-semibold text-foreground">Качество ИИ-модулей</h2>
          <div className="mt-4 space-y-3">
            {aiQualityMetrics.map((metric) => (
              <article key={metric.id} className="rounded-2xl border border-border bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-foreground">{metric.label}</p>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      metric.status === "ok"
                        ? "bg-emerald-100 text-emerald-700"
                        : metric.status === "warning"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                    )}
                  >
                    {metric.value}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Цель: {metric.target}</p>
                <p className="mt-1 text-xs text-muted-foreground">{metric.hint}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <h2 className="text-xl font-semibold text-foreground">UX-метрики образовательного пути</h2>
          <div className="mt-4 space-y-3">
            {uxMetrics.map((metric) => (
              <article key={metric.id} className="rounded-2xl border border-border bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-foreground">{metric.label}</p>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      metric.trend === "up" ? "text-emerald-700" : metric.trend === "down" ? "text-rose-700" : "text-slate-700"
                    )}
                  >
                    {metric.value}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{metric.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
