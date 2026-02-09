import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, CalendarDays, CircleCheckBig, FilePenLine, Sparkles } from "lucide-react";

import {
  teacherClassroomEvents,
  teacherCourses,
  teacherDashboardMetrics,
  teacherTodayTasks
} from "@/data/teacher-cabinet";

import { ProgressBar } from "@/components/shared/ProgressBar";
import { PillBadge } from "@/components/shared/PillBadge";
import { StatCard } from "@/components/shared/StatCard";
import { TeacherOnboardingAlert } from "@/components/teacher-cabinet/TeacherOnboardingAlert";

const monthNames = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря"
];

function formatEventDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);
  const day = date.getDate();
  const month = monthNames[date.getMonth()] ?? "";
  return `${day} ${month}`;
}

function getPriorityVariant(priority: "Низкий" | "Средний" | "Высокий") {
  if (priority === "Высокий") {
    return "warning";
  }
  if (priority === "Средний") {
    return "accent";
  }
  return "neutral";
}

export default function TeacherDashboardPage() {
  const sortedEvents = [...teacherClassroomEvents].sort((a, b) => {
    const left = new Date(`${a.date}T${a.startTime}:00`).getTime();
    const right = new Date(`${b.date}T${b.startTime}:00`).getTime();
    return left - right;
  });

  const featuredCourses = teacherCourses.filter((course) => course.status === "Опубликован").slice(0, 3);

  return (
    <div className="space-y-6">
      <TeacherOnboardingAlert />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {teacherDashboardMetrics.map((metric) => (
          <StatCard key={metric.id} label={metric.label} value={metric.value} hint={metric.delta} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr),360px]">
        <article className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Ближайшие занятия</h2>
              <p className="text-sm text-muted-foreground">Расписание на ближайшие дни и быстрый переход в комнату урока.</p>
            </div>
            <Link
              href="/teacher/classroom"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-semibold text-foreground"
            >
              Весь календарь
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {sortedEvents.slice(0, 5).map((event) => (
              <article
                key={event.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-slate-50 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {event.title}: {event.participantName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatEventDate(event.date)} · {event.startTime}–{event.endTime}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <PillBadge variant={event.type === "Проверка" ? "warning" : "primary"}>{event.type}</PillBadge>
                  <Link
                    href={`/teacher/classroom?event=${encodeURIComponent(event.id)}`}
                    className="inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    Открыть урок
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </article>

        <aside className="space-y-4">
          <article className="rounded-3xl border border-border bg-white p-5 shadow-card">
            <h3 className="text-lg font-semibold text-foreground">План на сегодня</h3>
            <ul className="mt-3 space-y-2">
              {teacherTodayTasks.map((task) => (
                <li key={task.id} className="rounded-2xl border border-border bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-foreground">{task.title}</p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{task.deadline}</span>
                    <PillBadge variant={getPriorityVariant(task.priority)}>{task.priority}</PillBadge>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-primary/20 bg-primary/5 p-5 shadow-card">
            <h3 className="text-lg font-semibold text-foreground">Быстрые действия</h3>
            <div className="mt-3 grid gap-2">
              <Link
                href="/teacher/courses/teacher-course-1"
                className="inline-flex items-center gap-2 rounded-2xl border border-primary/30 bg-white px-3 py-2 text-sm font-semibold text-foreground"
              >
                <FilePenLine className="h-4 w-4 text-primary" />
                Редактор курса
              </Link>
              <Link
                href="/teacher/quizzes/quiz-business-week1/builder"
                className="inline-flex items-center gap-2 rounded-2xl border border-primary/30 bg-white px-3 py-2 text-sm font-semibold text-foreground"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                Конструктор квиза
              </Link>
              <Link
                href="/teacher/classroom"
                className="inline-flex items-center gap-2 rounded-2xl border border-primary/30 bg-white px-3 py-2 text-sm font-semibold text-foreground"
              >
                <CalendarDays className="h-4 w-4 text-primary" />
                Календарь уроков
              </Link>
            </div>
          </article>
        </aside>
      </section>

      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Мои курсы</h2>
            <p className="text-sm text-muted-foreground">Публикация, прогресс учеников и качество прохождения.</p>
          </div>
          <Link
            href="/teacher/courses"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Все курсы
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <article key={course.id} className="rounded-3xl border border-border bg-slate-50 p-4">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-white">
                <Image src={course.imageUrl} alt={course.title} width={520} height={280} className="h-36 w-full object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground">
                  {course.category}
                </span>
              </div>
              <h3 className="mt-3 line-clamp-2 text-base font-semibold text-foreground">{course.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{course.studentsCount} учеников · {course.lessonsCount} урока</p>
              <div className="mt-3">
                <ProgressBar value={course.completionRate} ariaLabel={`Прогресс курса ${course.title}`} />
                <p className="mt-1 text-xs text-muted-foreground">Средний прогресс группы: {course.completionRate}%</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/teacher/courses/${encodeURIComponent(course.id)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  <BookOpenCheck className="h-3.5 w-3.5" />
                  Открыть курс
                </Link>
                <Link
                  href={`/teacher/quizzes/quiz-business-week1/builder`}
                  className="inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                >
                  Квизы
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-accent/60 bg-gradient-to-r from-accent/40 via-white to-primary/10 p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Подсказка ИИ для преподавателя</h2>
            <p className="text-sm text-muted-foreground">
              3 ученика из группы «Экономика для старта карьеры» снизили активность. Запланируйте короткий квиз и практику.
            </p>
          </div>
          <Link
            href="/teacher/analytics"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white"
          >
            <CircleCheckBig className="h-4 w-4" />
            Открыть аналитику
          </Link>
        </div>
      </section>
    </div>
  );
}
