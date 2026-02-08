"use client";

import { CheckCircle2, RefreshCcw, Sparkles, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { HomeworkAutoExercise } from "@/data/homework";

type AutoCheckAssignmentProps = {
  exercises: HomeworkAutoExercise[];
  maxScore?: number;
  xpReward: number;
};

type AnswerMap = Record<string, number | string | string[]>;

function normalizeValue(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function isAnswered(exercise: HomeworkAutoExercise, answer: AnswerMap[string]) {
  if (answer === undefined) {
    return false;
  }

  if (exercise.kind === "single_choice") {
    return typeof answer === "number";
  }

  if (exercise.kind === "fill_blank") {
    return typeof answer === "string" && answer.trim().length > 0;
  }

  return Array.isArray(answer) && answer.length > 0;
}

function isCorrect(exercise: HomeworkAutoExercise, answer: AnswerMap[string]) {
  if (!isAnswered(exercise, answer)) {
    return false;
  }

  if (exercise.kind === "single_choice") {
    return answer === exercise.correctOptionIndex;
  }

  if (exercise.kind === "fill_blank") {
    if (typeof answer !== "string") {
      return false;
    }

    const normalizedAnswer = normalizeValue(answer);
    return exercise.correctAnswers.some((item) => normalizeValue(item) === normalizedAnswer);
  }

  if (!Array.isArray(answer)) {
    return false;
  }

  const normalizedAnswer = answer.map((item) => normalizeValue(item));
  const normalizedCorrect = exercise.correctOrder.map((item) => normalizeValue(item));

  if (normalizedAnswer.length !== normalizedCorrect.length) {
    return false;
  }

  return normalizedAnswer.every((item, index) => item === normalizedCorrect[index]);
}

function getMaxScore(exercises: HomeworkAutoExercise[], fallback?: number) {
  const byExercises = exercises.reduce((acc, item) => acc + item.points, 0);

  if (byExercises > 0) {
    return byExercises;
  }

  return fallback ?? 0;
}

function buildAvailableTokens(exercise: Extract<HomeworkAutoExercise, { kind: "reorder" }>, selectedTokens: string[]) {
  const selectedCountMap = new Map<string, number>();
  selectedTokens.forEach((token) => {
    selectedCountMap.set(token, (selectedCountMap.get(token) ?? 0) + 1);
  });

  return exercise.tokens.filter((token) => {
    const used = selectedCountMap.get(token) ?? 0;

    if (used <= 0) {
      return true;
    }

    selectedCountMap.set(token, used - 1);
    return false;
  });
}

export function AutoCheckAssignment({ exercises, maxScore, xpReward }: AutoCheckAssignmentProps) {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [isChecked, setIsChecked] = useState(false);
  const [attempt, setAttempt] = useState(1);

  const answeredCount = useMemo(() => exercises.filter((item) => isAnswered(item, answers[item.id])).length, [answers, exercises]);
  const totalScore = useMemo(() => getMaxScore(exercises, maxScore), [exercises, maxScore]);

  const earnedScore = useMemo(() => {
    if (!isChecked) {
      return 0;
    }

    return exercises.reduce((acc, item) => (isCorrect(item, answers[item.id]) ? acc + item.points : acc), 0);
  }, [answers, exercises, isChecked]);

  const earnedPercent = totalScore > 0 ? Math.round((earnedScore / totalScore) * 100) : 0;

  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Тренажер с автопроверкой</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Формат как в языковых приложениях: короткие шаги, мгновенный фидбек, повтор до результата.
          </p>
        </div>
        <p className="rounded-full border border-border bg-slate-50 px-3 py-1 text-xs font-semibold text-foreground">Попытка #{attempt}</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-border bg-slate-50 p-3">
          <p className="text-xs text-muted-foreground">Выполнено</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {answeredCount}/{exercises.length}
          </p>
        </article>
        <article className="rounded-2xl border border-border bg-slate-50 p-3">
          <p className="text-xs text-muted-foreground">Баллы</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {isChecked ? earnedScore : "—"}/{totalScore}
          </p>
        </article>
        <article className="rounded-2xl border border-border bg-slate-50 p-3">
          <p className="text-xs text-muted-foreground">Награда</p>
          <p className="mt-1 inline-flex items-center gap-1 text-lg font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            +{xpReward} XP
          </p>
        </article>
      </div>

      <div className="mt-5 space-y-4">
        {exercises.map((exercise, index) => {
          const answer = answers[exercise.id];
          const answered = isAnswered(exercise, answer);
          const correct = isCorrect(exercise, answer);

          return (
            <article key={exercise.id} className="rounded-2xl border border-border bg-slate-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  {index + 1}. {exercise.prompt}
                </h3>
                <span className="rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  {exercise.points} баллов
                </span>
              </div>

              {exercise.kind === "single_choice" ? (
                <div className="mt-3 grid gap-2">
                  {exercise.options.map((option, optionIndex) => {
                    const isSelected = answer === optionIndex;

                    return (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition ${
                          isSelected ? "border-primary/40 bg-primary/5 text-foreground" : "border-border bg-white text-muted-foreground"
                        }`}
                      >
                        <input
                          type="radio"
                          name={exercise.id}
                          checked={isSelected}
                          onChange={() => {
                            setAnswers((prev) => ({ ...prev, [exercise.id]: optionIndex }));
                            setIsChecked(false);
                          }}
                          className="h-4 w-4 border-border text-primary focus:ring-primary"
                        />
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>
              ) : null}

              {exercise.kind === "fill_blank" ? (
                <div className="mt-3 space-y-2">
                  <input
                    type="text"
                    value={typeof answer === "string" ? answer : ""}
                    onChange={(event) => {
                      setAnswers((prev) => ({ ...prev, [exercise.id]: event.target.value }));
                      setIsChecked(false);
                    }}
                    placeholder={exercise.placeholder}
                    className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
                  />
                  {exercise.hint ? <p className="text-xs text-muted-foreground">Подсказка: {exercise.hint}</p> : null}
                </div>
              ) : null}

              {exercise.kind === "reorder" ? (
                <div className="mt-3 space-y-3">
                  <div className="rounded-xl border border-border bg-white p-3">
                    <p className="text-xs font-semibold text-foreground">Ваш порядок</p>
                    {Array.isArray(answer) && answer.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {answer.map((token, tokenIndex) => (
                          <button
                            key={`${exercise.id}-selected-${token}-${tokenIndex}`}
                            type="button"
                            onClick={() => {
                              setAnswers((prev) => {
                                const current = Array.isArray(prev[exercise.id]) ? [...(prev[exercise.id] as string[])] : [];
                                current.splice(tokenIndex, 1);
                                return { ...prev, [exercise.id]: current };
                              });
                              setIsChecked(false);
                            }}
                            className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                          >
                            {token}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-xs text-muted-foreground">Нажмите на слова снизу, чтобы собрать ответ.</p>
                    )}
                  </div>

                  <div className="rounded-xl border border-border bg-white p-3">
                    <p className="text-xs font-semibold text-foreground">Доступные элементы</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {buildAvailableTokens(exercise, Array.isArray(answer) ? answer : []).map((token, tokenIndex) => (
                        <button
                          key={`${exercise.id}-available-${token}-${tokenIndex}`}
                          type="button"
                          onClick={() => {
                            setAnswers((prev) => {
                              const current = Array.isArray(prev[exercise.id]) ? [...(prev[exercise.id] as string[])] : [];
                              return { ...prev, [exercise.id]: [...current, token] };
                            });
                            setIsChecked(false);
                          }}
                          className="rounded-full border border-border bg-slate-50 px-3 py-1 text-xs font-semibold text-foreground"
                        >
                          {token}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, [exercise.id]: [] }));
                      setIsChecked(false);
                    }}
                    className="inline-flex rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground"
                  >
                    Очистить порядок
                  </button>
                  {exercise.hint ? <p className="text-xs text-muted-foreground">Подсказка: {exercise.hint}</p> : null}
                </div>
              ) : null}

              {isChecked ? (
                <div
                  className={`mt-3 rounded-xl border px-3 py-2 text-xs ${
                    correct ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-rose-300 bg-rose-50 text-rose-800"
                  }`}
                >
                  <p className="inline-flex items-center gap-1 font-semibold">
                    {correct ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                    {correct ? "Верно" : "Есть ошибка"}
                  </p>
                  <p className="mt-1">{exercise.explanation}</p>
                </div>
              ) : answered ? (
                <p className="mt-3 text-xs text-muted-foreground">Ответ сохранен. Нажмите «Проверить автоматически».</p>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={answeredCount < exercises.length}
          onClick={() => setIsChecked(true)}
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          Проверить автоматически
        </button>
        <button
          type="button"
          onClick={() => {
            setAnswers({});
            setIsChecked(false);
            setAttempt((prev) => prev + 1);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground"
        >
          <RefreshCcw className="h-4 w-4" />
          Начать заново
        </button>
      </div>

      {isChecked ? (
        <article className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm">
          <p className="font-semibold text-foreground">Результат попытки: {earnedPercent}%</p>
          <p className="mt-1 text-muted-foreground">
            {earnedPercent >= 80
              ? "Отличный результат. Можно переходить к следующей теме."
              : "Рекомендуем повторить задания с ошибками и запустить новую попытку."}
          </p>
        </article>
      ) : null}
    </section>
  );
}
