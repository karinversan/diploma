"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Flame, Target } from "lucide-react";
import { useEffect, useState } from "react";

import { ActiveCourses } from "@/components/dashboard/ActiveCourses";
import { AiInsights } from "@/components/dashboard/AiInsights";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { HomeworkPreview } from "@/components/dashboard/HomeworkPreview";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { UpcomingLessons } from "@/components/dashboard/UpcomingLessons";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { aiInsights, dashboardMetrics, weeklyProgress } from "@/data/analytics";
import { courses } from "@/data/courses";
import { homeworkItems } from "@/data/homework";
import { upcomingLessons } from "@/data/lessons";
import { studentProfile } from "@/data/student";
import { useLessonCalendar } from "@/hooks/useLessonCalendar";
import { formatBookingSlotLabel, LessonBookingRequest, readLessonBookings } from "@/lib/lesson-bookings";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [bookings, setBookings] = useState<LessonBookingRequest[]>([]);

  useEffect(() => {
    setBookings(readLessonBookings());

    const syncBookings = () => setBookings(readLessonBookings());
    window.addEventListener("storage", syncBookings);
    return () => window.removeEventListener("storage", syncBookings);
  }, []);

  const activeCourses = useMemo(() => {
    return courses
      .filter((course) => course.lessonsCompleted < course.lessonsTotal)
      .sort((a, b) => b.lessonsCompleted / b.lessonsTotal - a.lessonsCompleted / a.lessonsTotal)
      .slice(0, 4);
  }, []);

  const orderedUpcomingLessons = useMemo(() => {
    return [...upcomingLessons].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  }, []);

  const homeworkPreviewItems = useMemo(() => {
    const activeStatuses = new Set(["new", "in_progress", "submitted"]);
    const activeHomework = homeworkItems.filter((item) => activeStatuses.has(item.status));
    const source = activeHomework.length > 0 ? activeHomework : homeworkItems;

    return [...source].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 4);
  }, []);

  const { currentMonth, setCurrentMonth, selectedDay, setSelectedDay, lessonDays, daysInMonth, filteredByDay } =
    useLessonCalendar(orderedUpcomingLessons);

  const upcomingLessonsByDate = useMemo(() => {
    return [...filteredByDay].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  }, [filteredByDay]);

  const bookingStatusSummary = useMemo(() => {
    const pending = bookings.filter((item) => item.status === "pending");
    const awaitingPayment = bookings.filter((item) => item.status === "awaiting_payment");
    const proposed = bookings.filter((item) => item.status === "reschedule_proposed");
    const declined = bookings.filter((item) => item.status === "declined");
    const nearestAwaiting = awaitingPayment.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())[0];

    return { pending, awaitingPayment, proposed, declined, nearestAwaiting };
  }, [bookings]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-primary/20 bg-[linear-gradient(135deg,rgba(116,76,255,0.12),rgba(185,250,119,0.2))] p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Добро пожаловать</p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground">{studentProfile.name}, ваш прогресс стабильно растёт</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/75 px-3 py-1.5 font-semibold text-foreground">
            <Flame className="h-4 w-4 text-primary" />
            Серия занятий: {studentProfile.streakDays} дней
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/75 px-3 py-1.5 font-semibold text-foreground">
            <Target className="h-4 w-4 text-primary" />
            Цель: {studentProfile.targetHoursPerWeek} часов в неделю
          </span>
        </div>
      </section>

      {bookingStatusSummary.awaitingPayment.length > 0 ||
      bookingStatusSummary.pending.length > 0 ||
      bookingStatusSummary.proposed.length > 0 ||
      bookingStatusSummary.declined.length > 0 ? (
        <section
          className={cn(
            "rounded-3xl border p-4 shadow-soft sm:p-5",
            bookingStatusSummary.awaitingPayment.length > 0
              ? "border-primary/20 bg-primary/5"
              : bookingStatusSummary.declined.length > 0
                ? "border-rose-200 bg-rose-50"
                : "border-border bg-white"
          )}
        >
          <p className="text-base font-semibold text-foreground">Статусы записи на занятия</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Подтвержденный преподавателем урок появляется в календаре только после оплаты.
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {bookingStatusSummary.pending.length > 0 ? (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 font-semibold text-amber-700">
                Ожидают подтверждения: {bookingStatusSummary.pending.length}
              </span>
            ) : null}
            {bookingStatusSummary.awaitingPayment.length > 0 ? (
              <span className="rounded-full bg-primary/15 px-2.5 py-1 font-semibold text-primary">
                Ожидают оплаты: {bookingStatusSummary.awaitingPayment.length}
              </span>
            ) : null}
            {bookingStatusSummary.proposed.length > 0 ? (
              <span className="rounded-full bg-violet-100 px-2.5 py-1 font-semibold text-violet-700">
                Нужен ответ по переносу: {bookingStatusSummary.proposed.length}
              </span>
            ) : null}
            {bookingStatusSummary.declined.length > 0 ? (
              <span className="rounded-full bg-rose-100 px-2.5 py-1 font-semibold text-rose-700">
                Отклонены: {bookingStatusSummary.declined.length}
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {bookingStatusSummary.nearestAwaiting ? (
              <Link
                href={`/app/payments?booking=${encodeURIComponent(bookingStatusSummary.nearestAwaiting.id)}`}
                className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Оплатить урок на {formatBookingSlotLabel(bookingStatusSummary.nearestAwaiting.slot)}
              </Link>
            ) : null}
            <Link
              href="/app/lessons"
              className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground"
            >
              Открыть раздел занятий
            </Link>
          </div>
        </section>
      ) : null}

      <section className="grid gap-3 md:grid-cols-3">
        <article className="rounded-3xl border border-border bg-white p-4 shadow-card">
          <p className="text-sm font-semibold text-foreground">1. Курс и цель</p>
          <p className="mt-1 text-xs text-muted-foreground">Выбираете курс, формат и преподавателя под ваш результат.</p>
        </article>
        <article className="rounded-3xl border border-border bg-white p-4 shadow-card">
          <p className="text-sm font-semibold text-foreground">2. Уроки и практика</p>
          <p className="mt-1 text-xs text-muted-foreground">Проходите занятия, получаете конспект и выполняете домашние задания.</p>
        </article>
        <article className="rounded-3xl border border-border bg-white p-4 shadow-card">
          <p className="text-sm font-semibold text-foreground">3. Прогресс и результат</p>
          <p className="mt-1 text-xs text-muted-foreground">Смотрите аналитику, закрываете пробелы и улучшаете итоговые показатели.</p>
        </article>
      </section>

      <KpiCards metrics={dashboardMetrics} />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="space-y-6">
          <ActiveCourses courses={activeCourses} />
          <UpcomingLessons lessons={upcomingLessonsByDate} />
        </div>

        <div className="space-y-6">
          <CalendarWidget
            currentMonth={currentMonth}
            onPrevMonth={() =>
              setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
            }
            onNextMonth={() =>
              setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
            }
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            lessonDays={lessonDays}
            daysInMonth={daysInMonth}
          />
          <HomeworkPreview items={homeworkPreviewItems} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AiInsights
          summary={aiInsights.summary}
          frequentMistakes={aiInsights.frequentMistakes}
          recommendedTasks={aiInsights.recommendedTasks}
          lessonId={aiInsights.latestLessonId}
        />

        <section id="analytics" className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">Прогресс по неделям</h2>
          <p className="mt-1 text-sm text-muted-foreground">Сколько часов вы уделяете обучению каждую неделю</p>
          <div className="mt-4 space-y-3">
            {weeklyProgress.map((point) => (
              <div key={point.week}>
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{point.week}</span>
                  <span>{point.hours} ч</span>
                </div>
                <ProgressBar
                  value={(point.hours / Math.max(...weeklyProgress.map((item) => item.hours))) * 100}
                  ariaLabel={`Прогресс ${point.week}`}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
