"use client";

import Link from "next/link";
import { Brain, CalendarClock, CheckCircle2, Clock3, Sparkles, Target, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

import { PillBadge } from "@/components/shared/PillBadge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { StatCard } from "@/components/shared/StatCard";
import {
  achievementTimeline,
  aiInsights,
  dashboardMetrics,
  focusAreas,
  learningTrendByPeriod,
  monthlyGoals,
  subjectProgress
} from "@/data/analytics";

type PeriodKey = "week" | "month" | "quarter";

const periodOptions: Array<{ key: PeriodKey; label: string }> = [
  { key: "week", label: "Неделя" },
  { key: "month", label: "Месяц" },
  { key: "quarter", label: "Квартал" }
];

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long" }).format(new Date(dateValue));
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<PeriodKey>("month");

  const trend = learningTrendByPeriod[period];

  const calculated = useMemo(() => {
    const totalHours = trend.reduce((acc, point) => acc + point.hours, 0);
    const totalLessons = trend.reduce((acc, point) => acc + point.lessons, 0);
    const avgAccuracy = Math.round(trend.reduce((acc, point) => acc + point.accuracy, 0) / trend.length);
    const maxHours = Math.max(...trend.map((point) => point.hours));

    return { totalHours, totalLessons, avgAccuracy, maxHours };
  }, [trend]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-primary/20 bg-[linear-gradient(130deg,rgba(116,76,255,0.14),rgba(185,250,119,0.2))] p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Аналитика обучения</p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">Динамика прогресса и персональные рекомендации</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Следите за часами обучения, точностью выполнения заданий и ключевыми зонами роста по каждому предмету.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 rounded-2xl border border-white/70 bg-white/80 p-1.5">
            {periodOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setPeriod(option.key)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  period === option.key ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <StatCard key={metric.id} label={metric.label} value={metric.value} hint={metric.delta} />
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            Динамика обучения
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Часы занятий, количество уроков и точность по выбранному периоду</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <article className="rounded-2xl border border-border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Часы за период</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{calculated.totalHours.toFixed(1)} ч</p>
            </article>
            <article className="rounded-2xl border border-border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Проведено уроков</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{calculated.totalLessons}</p>
            </article>
            <article className="rounded-2xl border border-border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Средняя точность</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{calculated.avgAccuracy}%</p>
            </article>
          </div>

          <div className="mt-5 grid gap-2 rounded-2xl border border-border bg-slate-50 p-4 sm:grid-cols-[repeat(auto-fit,minmax(80px,1fr))]">
            {trend.map((point) => {
              const height = Math.max(14, (point.hours / calculated.maxHours) * 100);

              return (
                <article key={point.label} className="flex flex-col items-center gap-2">
                  <div className="flex h-28 w-full items-end justify-center rounded-xl bg-white px-2 pb-2">
                    <div className="w-full rounded-lg bg-primary/85" style={{ height: `${height}%` }} />
                  </div>
                  <p className="text-xs font-semibold text-foreground">{point.label}</p>
                  <p className="text-[11px] text-muted-foreground">{point.hours} ч</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-foreground">
            <Target className="h-4 w-4 text-primary" />
            Цели месяца
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Прогресс по личному учебному плану</p>

          <div className="mt-4 space-y-4">
            {monthlyGoals.map((goal) => {
              const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));

              return (
                <article key={goal.id} className="rounded-2xl border border-border bg-slate-50 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                    <p className="font-semibold text-foreground">{goal.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                  </div>
                  <ProgressBar value={progress} ariaLabel={goal.title} />
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-foreground">
            <Clock3 className="h-4 w-4 text-primary" />
            Прогресс по предметам
          </h2>

          <div className="mt-4 space-y-3">
            {subjectProgress.map((item) => (
              <article key={item.subject} className="rounded-2xl border border-border bg-slate-50 p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{item.subject}</p>
                  <PillBadge variant="primary">{item.averageScore}% точность</PillBadge>
                </div>
                <ProgressBar value={item.progress} ariaLabel={`Прогресс по предмету ${item.subject}`} />
                <p className="mt-2 text-xs text-muted-foreground">
                  {item.completedLessons}/{item.totalLessons} уроков завершено
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-foreground">
            <Brain className="h-4 w-4 text-primary" />
            Зоны внимания
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Темы, в которых чаще всего возникают ошибки</p>

          <div className="mt-4 space-y-3">
            {focusAreas.map((focus) => (
              <article key={focus.id} className="rounded-2xl border border-border bg-slate-50 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{focus.title}</p>
                  <PillBadge variant="warning">Ошибок: {focus.errorRate}%</PillBadge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{focus.recommendation}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            ИИ-рекомендации
          </h2>

          <p className="mt-3 rounded-2xl border border-primary/20 bg-primary/5 p-3 text-sm text-foreground">{aiInsights.summary}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-border bg-slate-50 p-3">
              <p className="text-sm font-semibold text-foreground">Частые ошибки</p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {aiInsights.frequentMistakes.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border border-border bg-slate-50 p-3">
              <p className="text-sm font-semibold text-foreground">Что делать дальше</p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {aiInsights.recommendedTasks.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
          </div>

          <Link
            href={`/app/lessons/${aiInsights.latestLessonId}`}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Открыть подробный конспект
          </Link>
        </section>

        <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-foreground">
            <CalendarClock className="h-4 w-4 text-primary" />
            Лента достижений
          </h2>

          <div className="mt-4 space-y-3">
            {achievementTimeline.map((item) => (
              <article key={item.id} className="rounded-2xl border border-border bg-slate-50 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(item.date)}</p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
