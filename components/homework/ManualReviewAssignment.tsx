"use client";

import Link from "next/link";
import { CheckCircle2, Clock3, Mic, Sparkles } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { HomeworkItem } from "@/data/homework";

type ManualReviewAssignmentProps = {
  homework: HomeworkItem;
};

function getEstimatedTurnaround(status: HomeworkItem["status"]) {
  if (status === "graded") {
    return "Проверка завершена";
  }

  if (status === "submitted") {
    return "Обычно до 12 часов";
  }

  return "Обычно до 24 часов";
}

export function ManualReviewAssignment({ homework }: ManualReviewAssignmentProps) {
  const [answerText, setAnswerText] = useState("");
  const [audioLink, setAudioLink] = useState("");
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(homework.status === "submitted" || homework.status === "graded");

  const minLengthHint = useMemo(() => {
    const minWords = homework.manualConfig?.minWords;
    const minAudioMinutes = homework.manualConfig?.minAudioMinutes;

    if (homework.assignmentType === "audio_response" && minAudioMinutes) {
      return `Минимальная длительность записи: ${minAudioMinutes} мин`;
    }

    if (minWords) {
      return `Минимальный объем: ${minWords} слов`;
    }

    return "Старайтесь дать полный и структурированный ответ.";
  }, [homework.assignmentType, homework.manualConfig?.minAudioMinutes, homework.manualConfig?.minWords]);

  const isEssayLike = homework.assignmentType === "essay" || homework.assignmentType === "project";
  const isAudio = homework.assignmentType === "audio_response";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  const canSubmit = isAudio ? audioLink.trim().length > 6 && answerText.trim().length > 20 : answerText.trim().length > 40;
  const isGraded = homework.status === "graded";

  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Сдача задания на экспертную проверку</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Сначала срабатывает ИИ-предпроверка, затем преподаватель выставляет итоговую оценку и комментарии.
          </p>
        </div>
        <p className="rounded-full border border-border bg-slate-50 px-3 py-1 text-xs font-semibold text-foreground">
          {getEstimatedTurnaround(homework.status)}
        </p>
      </div>

      {homework.aiPrecheckNote ? (
        <p className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">{homework.aiPrecheckNote}</p>
      ) : null}

      <div className="mt-4 rounded-2xl border border-border bg-slate-50 p-4">
        <p className="text-sm font-semibold text-foreground">Критерии оценивания</p>
        <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
          {homework.manualConfig?.rubric.map((rule) => (
            <li key={rule.id}>
              • {rule.title} ({rule.weight}%): {rule.description}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs font-medium text-foreground">{minLengthHint}</p>
      </div>

      {isSubmitted ? (
        <article className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">
            <CheckCircle2 className="h-4 w-4" />
            {isGraded ? "Проверка завершена" : "Материал успешно отправлен"}
          </p>
          <div className="mt-3 space-y-2 text-xs text-emerald-900">
            <p className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              ИИ-предпроверка: завершена
            </p>
            <p className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              Проверка преподавателя: {isGraded ? "завершена" : "в очереди"}
            </p>
            <p>{isGraded ? "Итоговый фидбек и баллы уже доступны в карточке задания." : "Итоговый фидбек появится в карточке задания и в разделе «Аналитика»."}</p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={`/app/lessons/${homework.lessonId}`}
              className="inline-flex rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white"
            >
              Открыть связанный урок
            </Link>
            <Link href="/app/homework" className="inline-flex rounded-full border border-emerald-300 px-4 py-2 text-xs font-semibold text-emerald-900">
              К списку домашних заданий
            </Link>
          </div>
        </article>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {isAudio ? (
            <label className="block">
              <span className="mb-1 inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                <Mic className="h-4 w-4 text-primary" />
                Ссылка на аудио
              </span>
              <input
                type="url"
                value={audioLink}
                onChange={(event) => setAudioLink(event.target.value)}
                placeholder="https://..."
                className="w-full rounded-2xl border border-border bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-primary"
              />
            </label>
          ) : null}

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-foreground">
              {homework.manualConfig?.deliverableLabel ?? "Ответ"}
            </span>
            <textarea
              value={answerText}
              onChange={(event) => setAnswerText(event.target.value)}
              rows={isEssayLike ? 10 : 7}
              placeholder={homework.manualConfig?.deliverableHint ?? "Введите ваш ответ"}
              className="w-full rounded-2xl border border-border bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-primary"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setIsDraftSaved(true);
                window.setTimeout(() => setIsDraftSaved(false), 1800);
              }}
              className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground"
            >
              Сохранить черновик
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              Отправить на проверку
            </button>
          </div>

          {isDraftSaved ? <p className="text-xs font-medium text-emerald-700">Черновик сохранен (демо).</p> : null}
        </form>
      )}
    </section>
  );
}
