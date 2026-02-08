import Link from "next/link";
import { Clock3, MessageSquareText, Video } from "lucide-react";

import { isLessonStartingSoon, StudentLesson } from "@/data/lessons";

import { EmptyState } from "@/components/shared/EmptyState";
import { PillBadge } from "@/components/shared/PillBadge";

function formatDateLabel(dateValue: string) {
  const date = new Date(dateValue);

  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

type UpcomingLessonsProps = {
  lessons: StudentLesson[];
};

export function UpcomingLessons({ lessons }: UpcomingLessonsProps) {
  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Ближайшие занятия</h2>
          <p className="text-sm text-muted-foreground">Подключайтесь за 5 минут до начала урока</p>
        </div>
        <Link href="/app/lessons" className="text-sm font-semibold text-primary hover:underline">
          Открыть расписание
        </Link>
      </div>

      {lessons.length === 0 ? (
        <EmptyState
          className="mt-5 border-dashed shadow-none"
          title="На выбранную дату занятий нет"
          description="Снимите фильтр по дате или перейдите к полному расписанию уроков."
          actionLabel="К расписанию"
          actionHref="/app/lessons"
        />
      ) : (
        <div className="mt-5 space-y-3">
          {lessons.map((lesson) => {
            const startsSoon = isLessonStartingSoon(lesson);

            return (
              <article key={lesson.id} className="rounded-2xl border border-border bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-foreground">{lesson.subject}</p>
                      {startsSoon ? <PillBadge variant="accent">Скоро начнётся</PillBadge> : null}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{lesson.teacherName}</p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock3 className="h-4 w-4" />
                      {formatDateLabel(lesson.startAt)} • {lesson.durationMinutes} мин
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/app/lessons/${lesson.id}`}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground transition hover:border-primary"
                    >
                      <MessageSquareText className="h-3.5 w-3.5" />
                      Детали
                    </Link>
                    <Link
                      href={`/app/lessons/${lesson.id}`}
                      className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                    >
                      <Video className="h-3.5 w-3.5" />
                      Перейти в урок
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
