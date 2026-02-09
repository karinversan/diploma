import { ArrowUpRight, TrendingUp } from "lucide-react";

import { teacherAnalyticsTrend, teacherCourses, teacherDashboardMetrics } from "@/data/teacher-cabinet";

import { ProgressBar } from "@/components/shared/ProgressBar";
import { StatCard } from "@/components/shared/StatCard";

function formatCurrency(value: number) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

export default function TeacherAnalyticsPage() {
  const maxRevenue = Math.max(...teacherAnalyticsTrend.map((point) => point.revenue));
  const avgRetention = Math.round(
    teacherAnalyticsTrend.reduce((sum, point) => sum + point.retention, 0) / Math.max(teacherAnalyticsTrend.length, 1)
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {teacherDashboardMetrics.map((metric) => (
          <StatCard key={metric.id} label={metric.label} value={metric.value} hint={metric.delta} icon={<TrendingUp className="h-4 w-4" />} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr),320px]">
        <article className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Динамика выручки и уроков</h1>
              <p className="mt-1 text-sm text-muted-foreground">Сравнение недельных показателей по обучению и доходу.</p>
            </div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Среднее удержание: {avgRetention}%
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {teacherAnalyticsTrend.map((point) => {
              const revenueScale = Math.round((point.revenue / maxRevenue) * 100);
              return (
                <article key={point.label} className="rounded-2xl border border-border bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{point.label}</p>
                    <p className="text-sm font-semibold text-foreground">{formatCurrency(point.revenue)}</p>
                  </div>
                  <div className="mt-2 h-2.5 w-full rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${revenueScale}%` }} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{point.lessons} занятий</span>
                    <span>Удержание {point.retention}%</span>
                  </div>
                </article>
              );
            })}
          </div>
        </article>

        <aside className="space-y-4">
          <article className="rounded-3xl border border-border bg-white p-5 shadow-card">
            <h2 className="text-lg font-semibold text-foreground">Курсы по вовлечению</h2>
            <div className="mt-3 space-y-3">
              {teacherCourses.map((course) => (
                <article key={course.id} className="rounded-2xl border border-border bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-foreground">{course.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {course.studentsCount} учеников · {course.lessonsCount} уроков
                  </p>
                  <div className="mt-2">
                    <ProgressBar value={course.completionRate} ariaLabel={`Прогресс ${course.title}`} />
                    <p className="mt-1 text-xs text-muted-foreground">Прогресс: {course.completionRate}%</p>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-primary/25 bg-primary/5 p-5 shadow-card">
            <h2 className="text-lg font-semibold text-foreground">Рекомендация ИИ</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Добавьте короткий автоквиз в модуль 3 курса «Экономика для старта карьеры»: это может поднять завершение на 7–10%.
            </p>
            <button type="button" className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Внедрить в курс
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </article>
        </aside>
      </section>
    </div>
  );
}
