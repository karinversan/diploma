import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3, Layers, PlayCircle } from "lucide-react";

import { getCourseEstimatedWeeks, getCourseModuleCount, StudentCourse } from "@/data/courses";

import { ProgressBar } from "@/components/shared/ProgressBar";

function calculateProgress(course: StudentCourse) {
  if (course.lessonsTotal <= 0) {
    return 0;
  }

  return Math.round((course.lessonsCompleted / course.lessonsTotal) * 100);
}

type CourseCardProps = {
  course: StudentCourse;
};

export function CourseCard({ course }: CourseCardProps) {
  const progress = calculateProgress(course);
  const moduleCount = getCourseModuleCount(course.id);
  const estimatedWeeks = getCourseEstimatedWeeks(course.id);
  const actionLabel = progress > 0 ? "Продолжить курс" : "Открыть программу";
  const actionHint =
    course.accessType === "По расписанию"
      ? "Модули + живые уроки по расписанию"
      : "Материалы доступны сразу";

  return (
    <Link
      href={`/app/courses/${course.id}`}
      aria-label={`Открыть курс ${course.title}`}
      className={`block transform-gpu overflow-hidden rounded-3xl border shadow-card transition duration-200 hover:-translate-y-1 hover:scale-[1.015] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
        course.isFeatured
          ? "border-primary/25 bg-[linear-gradient(140deg,rgba(116,76,255,0.14),rgba(185,250,119,0.14))]"
          : "border-border bg-white"
      }`}
    >
      <div className="relative h-40 w-full">
        <Image src={course.imageUrl} alt={`Обложка курса ${course.title}`} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-slate-900/10 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground">{course.category}</span>
          <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-foreground">{course.level}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" />
            {moduleCount} модулей • {course.lessonsTotal} уроков
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {course.durationHours} часов
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {estimatedWeeks} недель
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-slate-100 px-2 py-0.5">
            {actionHint}
          </span>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Прогресс {course.lessonsCompleted}/{course.lessonsTotal}
            </span>
            <span>{progress}%</span>
          </div>
          <ProgressBar value={progress} ariaLabel={`Прогресс курса ${course.title}`} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">{course.teacherName}</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
            <PlayCircle className="h-3.5 w-3.5" />
            {actionLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
