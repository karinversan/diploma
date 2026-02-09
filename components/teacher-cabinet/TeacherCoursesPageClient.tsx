"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FilePlus2, Search } from "lucide-react";

import { TeacherCourseStatus, teacherCourses } from "@/data/teacher-cabinet";
import { cn } from "@/lib/utils";

import { ProgressBar } from "@/components/shared/ProgressBar";
import { PillBadge } from "@/components/shared/PillBadge";

const statusFilters: Array<{ id: "all" | TeacherCourseStatus; label: string }> = [
  { id: "all", label: "Все" },
  { id: "Опубликован", label: "Опубликованы" },
  { id: "Черновик", label: "Черновики" },
  { id: "На проверке", label: "На проверке" },
  { id: "Архив", label: "Архив" }
];

function getStatusVariant(status: TeacherCourseStatus) {
  if (status === "Опубликован") {
    return "success";
  }
  if (status === "На проверке") {
    return "accent";
  }
  if (status === "Черновик") {
    return "warning";
  }
  return "neutral";
}

export function TeacherCoursesPageClient() {
  const [query, setQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState<(typeof statusFilters)[number]["id"]>("all");

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return teacherCourses.filter((course) => {
      const matchesStatus = activeStatus === "all" || course.status === activeStatus;
      if (!matchesStatus) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        course.title.toLowerCase().includes(normalizedQuery) ||
        course.category.toLowerCase().includes(normalizedQuery) ||
        course.level.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query, activeStatus]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Управление курсами</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Собирайте программы как в Coursera: модули, уроки, задания, тесты и контроль прогресса.
            </p>
          </div>
          <Link
            href="/teacher/courses/teacher-course-3"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <FilePlus2 className="h-4 w-4" />
            Создать курс
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveStatus(filter.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                activeStatus === filter.id ? "bg-primary text-primary-foreground" : "bg-slate-100 text-muted-foreground hover:bg-slate-200"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <label className="relative mt-4 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по названию курса, категории или уровню"
            className="w-full rounded-2xl border border-border bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary"
          />
        </label>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredCourses.map((course) => (
          <article key={course.id} className="group rounded-3xl border border-border bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-slate-100">
              <Image src={course.imageUrl} alt={course.title} width={520} height={280} className="h-36 w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
              <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-foreground">
                {course.category}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <PillBadge variant={getStatusVariant(course.status)}>{course.status}</PillBadge>
              <span className="text-xs text-muted-foreground">{course.level}</span>
            </div>

            <h2 className="mt-2 line-clamp-2 text-base font-semibold text-foreground">{course.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{course.shortDescription}</p>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl border border-border bg-slate-50 py-2 text-muted-foreground">{course.studentsCount} учеников</div>
              <div className="rounded-xl border border-border bg-slate-50 py-2 text-muted-foreground">{course.lessonsCount} уроков</div>
              <div className="rounded-xl border border-border bg-slate-50 py-2 text-muted-foreground">★ {course.rating || "—"}</div>
            </div>

            <div className="mt-3">
              <ProgressBar value={course.completionRate} ariaLabel={`Средний прогресс курса ${course.title}`} />
              <p className="mt-1 text-xs text-muted-foreground">Средний прогресс: {course.completionRate}%</p>
            </div>

            <div className="mt-4 grid gap-2">
              <Link
                href={`/teacher/courses/${encodeURIComponent(course.id)}`}
                className="inline-flex justify-center rounded-full border border-border bg-white px-3 py-2 text-sm font-semibold text-foreground"
              >
                Редактировать курс
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={`/teacher/courses/${encodeURIComponent(course.id)}/preview`}
                  className="inline-flex justify-center rounded-full border border-border bg-slate-50 px-3 py-2 text-xs font-semibold text-foreground"
                >
                  Предпросмотр
                </Link>
                <Link
                  href="/teacher/quizzes/quiz-business-week1/builder"
                  className="inline-flex justify-center rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                >
                  Квизы
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
