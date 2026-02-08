"use client";

import Link from "next/link";
import { Bolt, CheckCircle2, FileText, Sparkles, Target } from "lucide-react";

import { AutoCheckAssignment } from "@/components/homework/AutoCheckAssignment";
import { ManualReviewAssignment } from "@/components/homework/ManualReviewAssignment";
import {
  getHomeworkById,
  homeworkAssignmentTypeLabels,
  homeworkCheckModeLabels,
  HomeworkItem,
  isHomeworkAutoChecked
} from "@/data/homework";

type HomeworkDetailsPageProps = {
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
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(dateValue));
}

function statusLabel(status: HomeworkItem["status"]) {
  if (status === "new") {
    return "Новое";
  }
  if (status === "in_progress") {
    return "В работе";
  }
  if (status === "submitted") {
    return "На проверке";
  }
  return "Проверено";
}

export default function HomeworkDetailsPage({ params }: HomeworkDetailsPageProps) {
  const homeworkId = safeDecode(params.id);
  const homework = getHomeworkById(homeworkId);

  if (!homework) {
    return (
      <section className="rounded-3xl border border-border bg-white p-10 text-center shadow-card">
        <h1 className="text-3xl font-semibold text-foreground">Задание не найдено</h1>
        <p className="mt-2 text-sm text-muted-foreground">Проверьте ссылку или вернитесь к списку домашних заданий.</p>
        <Link
          href="/app/homework"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          К списку заданий
        </Link>
      </section>
    );
  }

  const autoMode = isHomeworkAutoChecked(homework);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-white p-4 shadow-card sm:p-5">
        <nav aria-label="Хлебные крошки" className="text-sm text-muted-foreground">
          <Link href="/app/homework" className="hover:text-foreground">
            Домашние задания
          </Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-foreground">{homework.title}</span>
        </nav>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-border bg-white p-6 shadow-card sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{homework.subject}</span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              {homeworkAssignmentTypeLabels[homework.assignmentType]}
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              {homeworkCheckModeLabels[homework.checkMode]}
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              Статус: {statusLabel(homework.status)}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold text-foreground">{homework.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{homework.description}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Срок сдачи</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{formatDate(homework.dueDate)}</p>
            </div>
            <div className="rounded-2xl border border-border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Оценка</p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {homework.score !== undefined && homework.maxScore ? `${homework.score}/${homework.maxScore}` : "Пока не выставлена"}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Награда</p>
              <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                +{homework.xpReward} XP
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-semibold text-foreground">Как выполнять</p>
            <ol className="mt-2 space-y-1 text-sm text-muted-foreground">
              {homework.instructions.map((instruction, index) => (
                <li key={instruction}>
                  {index + 1}. {instruction}
                </li>
              ))}
            </ol>
          </div>
        </article>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-border bg-white p-5 shadow-card">
            <h2 className="text-lg font-semibold text-foreground">Что это дает</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="inline-flex items-start gap-2">
                <Target className="mt-0.5 h-4 w-4 text-primary" />
                Закрепление материала сразу после урока
              </li>
              <li className="inline-flex items-start gap-2">
                {autoMode ? <Bolt className="mt-0.5 h-4 w-4 text-primary" /> : <Sparkles className="mt-0.5 h-4 w-4 text-primary" />}
                {autoMode ? "Мгновенная обратная связь и повтор попытки" : "Двойная проверка: ИИ-предпроверка и оценка преподавателя"}
              </li>
              <li className="inline-flex items-start gap-2">
                <FileText className="mt-0.5 h-4 w-4 text-primary" />
                История прогресса в аналитике и рекомендациях
              </li>
            </ul>
          </section>

          <section className="rounded-3xl border border-border bg-white p-5 shadow-card">
            <h3 className="text-sm font-semibold text-foreground">Параметры задания</h3>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>• Тип: {homeworkAssignmentTypeLabels[homework.assignmentType]}</li>
              <li>• Проверка: {homeworkCheckModeLabels[homework.checkMode]}</li>
              <li>• Ожидаемое время: {homework.estimatedMinutes} минут</li>
              <li>• Максимум: {homework.maxScore ?? 0} баллов</li>
            </ul>

            <Link
              href={`/app/lessons/${homework.lessonId}`}
              className="mt-3 inline-flex rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground"
            >
              Открыть связанный урок
            </Link>

            {homework.status === "graded" ? (
              <p className="mt-3 inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Результат уже учтен в аналитике
              </p>
            ) : null}
          </section>
        </aside>
      </section>

      {autoMode ? (
        <AutoCheckAssignment
          exercises={homework.autoExercises ?? []}
          maxScore={homework.maxScore}
          xpReward={homework.xpReward}
        />
      ) : (
        <ManualReviewAssignment homework={homework} />
      )}
    </div>
  );
}
