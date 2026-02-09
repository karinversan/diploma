import Image from "next/image";
import Link from "next/link";

import { StudentCourse } from "@/data/courses";

import { ProgressBar } from "@/components/shared/ProgressBar";

function progressOf(course: StudentCourse) {
  if (course.lessonsTotal <= 0) {
    return 0;
  }

  return (course.lessonsCompleted / course.lessonsTotal) * 100;
}

type ActiveCoursesProps = {
  courses: StudentCourse[];
};

export function ActiveCourses({ courses }: ActiveCoursesProps) {
  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Активные курсы</h2>
          <p className="text-sm text-muted-foreground">Продолжайте обучение там, где остановились</p>
        </div>
        <Link href="/app/courses" className="text-sm font-semibold text-primary hover:underline">
          Смотреть все
        </Link>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {courses.map((course) => {
          const progress = progressOf(course);
          const actionLabel = course.lessonsCompleted > 0 ? "Продолжить" : "Начать";

          return (
            <article
              key={course.id}
              className={`rounded-3xl border p-4 transition ${
                course.isFeatured
                  ? "border-primary/30 bg-[linear-gradient(130deg,rgba(116,76,255,0.12),rgba(185,250,119,0.2))]"
                  : "border-border bg-slate-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <Image
                  src={course.imageUrl}
                  alt={`Обложка курса ${course.title}`}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] rounded-2xl border border-white/60 object-cover"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-foreground">{course.category}</span>
                    <span className="rounded-full border border-border bg-white px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {course.level}
                    </span>
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-base font-semibold text-foreground">{course.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {course.lessonsCompleted}/{course.lessonsTotal} уроков
                  </p>
                </div>
              </div>

              <ProgressBar value={progress} className="mt-4" ariaLabel={`Прогресс курса ${course.title}`} />

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Преподаватель: {course.teacherName}</p>
                <Link
                  href={`/app/courses/${course.id}`}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  {actionLabel}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
