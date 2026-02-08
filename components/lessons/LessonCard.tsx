import Link from "next/link";
import { Clock3, MessageSquare, Video } from "lucide-react";

import { isLessonStartingSoon, StudentLesson } from "@/data/lessons";

import { PillBadge } from "@/components/shared/PillBadge";

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(dateValue));
}

const statusText: Record<StudentLesson["status"], { label: string; variant: "neutral" | "success" | "warning" }> = {
  upcoming: { label: "Предстоящее", variant: "neutral" },
  completed: { label: "Прошедшее", variant: "success" },
  cancelled: { label: "Отменено", variant: "warning" }
};

type LessonCardProps = {
  lesson: StudentLesson;
};

export function LessonCard({ lesson }: LessonCardProps) {
  const startsSoon = isLessonStartingSoon(lesson);

  return (
    <article className="rounded-3xl border border-border bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">{lesson.subject}</h3>
            <PillBadge variant={statusText[lesson.status].variant}>{statusText[lesson.status].label}</PillBadge>
            {startsSoon ? <PillBadge variant="accent">Скоро начнётся</PillBadge> : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Преподаватель: {lesson.teacherName}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock3 className="h-4 w-4" />
            {formatDate(lesson.startAt)} • {lesson.durationMinutes} мин
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/app/messages?thread=${lesson.chatThreadId}`}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground transition hover:border-primary"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Чат
          </Link>
          <Link
            href={`/app/lessons/${lesson.id}`}
            className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Video className="h-3.5 w-3.5" />
            Перейти в урок
          </Link>
        </div>
      </div>
    </article>
  );
}
