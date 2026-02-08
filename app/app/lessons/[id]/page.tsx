import Image from "next/image";
import Link from "next/link";
import { Clock3, MessageSquare, Video } from "lucide-react";

import { LessonTabs } from "@/components/lessons/LessonTabs";
import { getTeacherById } from "@/data/teachers";
import { homeworkItems } from "@/data/homework";
import { getLessonById } from "@/data/lessons";
import { vocabularyWords } from "@/data/vocabulary";

type LessonDetailsPageProps = {
  params: {
    id: string;
  };
};

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(dateValue));
}

export default function LessonDetailsPage({ params }: LessonDetailsPageProps) {
  const lessonId = safeDecode(params.id);
  const lesson = getLessonById(lessonId);

  if (!lesson) {
    return (
      <section className="rounded-3xl border border-border bg-white p-10 text-center shadow-card">
        <h1 className="text-2xl font-semibold text-foreground">Урок не найден</h1>
        <p className="mt-2 text-sm text-muted-foreground">Проверьте ссылку или вернитесь к общему расписанию.</p>
        <Link
          href="/app/lessons"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Вернуться к занятиям
        </Link>
      </section>
    );
  }

  const teacher = getTeacherById(lesson.teacherId);
  const lessonHomework = homeworkItems.filter((item) => item.lessonId === lesson.id);
  const lessonVocabulary = vocabularyWords.filter((word) => word.lessonId === lesson.id);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <nav aria-label="Хлебные крошки" className="text-sm text-muted-foreground">
          <Link href="/app/lessons" className="hover:text-foreground">
            Занятия
          </Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-foreground">{lesson.subject}</span>
        </nav>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{lesson.subject}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{formatDate(lesson.startAt)}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Преподаватель:{" "}
              {teacher ? (
                <Link href={`/app/teachers/${teacher.id}`} className="font-semibold text-primary hover:underline">
                  {teacher.name}
                </Link>
              ) : (
                lesson.teacherName
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/app/messages?thread=${lesson.chatThreadId}`}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground"
            >
              <MessageSquare className="h-4 w-4" />
              Чат с преподавателем
            </Link>
            <Link
              href={`/app/lessons/${lesson.id}`}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Video className="h-4 w-4" />
              Перейти в урок
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <LessonTabs lesson={lesson} homework={lessonHomework} vocabulary={lessonVocabulary} />

        <aside className="space-y-4">
          <section className="rounded-3xl border border-border bg-white p-4 shadow-card">
            <h2 className="text-lg font-semibold text-foreground">Запись урока</h2>
            <div className="relative mt-3 overflow-hidden rounded-2xl border border-border">
              <Image
                src="/classroom-preview.svg"
                alt="Превью записи урока"
                width={620}
                height={360}
                className="h-auto w-full"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-slate-900/25 text-sm font-semibold text-white">
                Видео-превью (демо)
              </span>
            </div>
            <button
              type="button"
              className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground"
            >
              Смотреть запись (заглушка)
            </button>
          </section>

          <section className="rounded-3xl border border-border bg-white p-4 shadow-card">
            <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <Clock3 className="h-4 w-4" />
              Длительность: {lesson.durationMinutes} мин
            </p>
            <p className="mt-3 text-sm text-muted-foreground">Файлов по уроку: {lesson.files.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">Домашних заданий: {lessonHomework.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">Слов в словаре: {lessonVocabulary.length}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
