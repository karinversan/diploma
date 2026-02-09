"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, Plus, Save, Trash2 } from "lucide-react";

import { TeacherQuizTemplate, quizQuestionTypeOptions } from "@/data/teacher-cabinet";
import { cn } from "@/lib/utils";

type TeacherQuizBuilderClientProps = {
  quiz: TeacherQuizTemplate;
};

type EditableQuestion = TeacherQuizTemplate["questions"][number];

const typeLabels: Record<string, string> = {
  "Multiple Choice": "Один вариант",
  "True/False": "Верно / Неверно",
  "Open Ended": "Открытый вопрос",
  Poll: "Опрос",
  Reorder: "Порядок",
  Match: "Сопоставление",
  "Drag and Drop": "Перетаскивание",
  Sequencing: "Последовательность"
};

function getQuestionTypeLabel(type: string) {
  return typeLabels[type] ?? type;
}

export function TeacherQuizBuilderClient({ quiz }: TeacherQuizBuilderClientProps) {
  const [questions, setQuestions] = useState<EditableQuestion[]>(quiz.questions);
  const [activeIndex, setActiveIndex] = useState(0);
  const [description, setDescription] = useState("Проверочный квиз по итогам первого блока. Дает базовую диагностику понимания темы.");

  const activeQuestion = questions[activeIndex];
  const completion = useMemo(() => Math.round(((activeIndex + 1) / Math.max(questions.length, 1)) * 100), [activeIndex, questions.length]);

  const updateQuestion = (updater: (question: EditableQuestion) => EditableQuestion) => {
    setQuestions((prev) => prev.map((question, index) => (index === activeIndex ? updater(question) : question)));
  };

  const addOption = () => {
    updateQuestion((question) => ({
      ...question,
      options: [...question.options, `Новый вариант ${question.options.length + 1}`]
    }));
  };

  const removeOption = (optionIndex: number) => {
    updateQuestion((question) => {
      const nextOptions = question.options.filter((_, index) => index !== optionIndex);
      const nextCorrect = question.correctOptionIndexes.filter((index) => index !== optionIndex).map((index) => (index > optionIndex ? index - 1 : index));
      return { ...question, options: nextOptions, correctOptionIndexes: nextCorrect };
    });
  };

  const addQuestion = (type: EditableQuestion["type"]) => {
    const newQuestion: EditableQuestion = {
      id: `q-${Date.now()}`,
      type,
      prompt: "Новый вопрос",
      options: type === "Open Ended" ? [] : ["Вариант 1", "Вариант 2"],
      correctOptionIndexes: type === "Open Ended" || type === "Poll" ? [] : [0],
      explanation: "Пояснение преподавателя",
      points: 5
    };

    setQuestions((prev) => [...prev, newQuestion]);
    setActiveIndex(questions.length);
  };

  if (!activeQuestion) {
    return (
      <section className="rounded-3xl border border-border bg-white p-10 text-center shadow-card">
        <h1 className="text-2xl font-semibold text-foreground">Квиз пуст</h1>
        <p className="mt-2 text-sm text-muted-foreground">Добавьте первый вопрос, чтобы начать настройку.</p>
        <button
          type="button"
          onClick={() => addQuestion("Multiple Choice")}
          className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Добавить вопрос
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-800 bg-slate-950 p-4 text-white shadow-card sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">{quiz.lessonTitle}</h1>
            <p className="text-sm text-slate-400">Добавляйте вопросы и настраивайте сценарий проверки знаний.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300">
              <Check className="h-3 w-3 text-emerald-400" />
              Изменения сохранены 2 мин назад
            </span>
            <Link
              href={`/teacher/quizzes/${encodeURIComponent(quiz.id)}/pass`}
              className="inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Предпросмотр секции
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-white p-4 shadow-card">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-2xl border border-primary/30 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary">
            + Добавить подраздел
          </button>
          <button type="button" className="rounded-2xl border border-border bg-white px-3 py-2 text-sm font-medium text-muted-foreground">
            Прочитайте перед стартом
          </button>
          <button type="button" className="rounded-2xl border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-semibold text-foreground">
            {quiz.title}
          </button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)_300px]">
        <aside className="rounded-3xl border border-border bg-white p-4 shadow-card">
          <h2 className="text-xl font-semibold text-foreground">Добавить вопрос</h2>
          <div className="mt-3 grid gap-2">
            {quizQuestionTypeOptions.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => addQuestion(type)}
                className="rounded-2xl border border-border bg-slate-50 px-3 py-2 text-left text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-primary/5"
              >
                {getQuestionTypeLabel(type)}
              </button>
            ))}
          </div>
        </aside>

        <article className="rounded-3xl border border-border bg-white p-4 shadow-card sm:p-5">
          <div className="rounded-2xl border border-border bg-slate-50 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                Вопрос {activeIndex + 1}
              </span>
              <select
                value={activeQuestion.type}
                onChange={(event) =>
                  updateQuestion((question) => ({
                    ...question,
                    type: event.target.value as EditableQuestion["type"]
                  }))
                }
                className="rounded-xl border border-border bg-white px-2.5 py-1.5 text-sm outline-none"
              >
                {quizQuestionTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {getQuestionTypeLabel(type)}
                  </option>
                ))}
              </select>
              <select
                value={activeQuestion.points}
                onChange={(event) => updateQuestion((question) => ({ ...question, points: Number(event.target.value) }))}
                className="rounded-xl border border-border bg-white px-2.5 py-1.5 text-sm outline-none"
              >
                {[0, 5, 8, 10, 15].map((points) => (
                  <option key={points} value={points}>
                    {points} баллов
                  </option>
                ))}
              </select>
            </div>

            <label className="mt-3 block">
              <span className="text-xs text-muted-foreground">Текст вопроса</span>
              <input
                value={activeQuestion.prompt}
                onChange={(event) => updateQuestion((question) => ({ ...question, prompt: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
          </div>

          {activeQuestion.type !== "Open Ended" ? (
            <div className="mt-4 space-y-2">
              {activeQuestion.options.map((option, optionIndex) => {
                const isCorrect = activeQuestion.correctOptionIndexes.includes(optionIndex);
                return (
                  <div key={`${activeQuestion.id}-${optionIndex}`} className="flex items-center gap-2 rounded-2xl border border-border bg-slate-50 p-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuestion((question) => ({
                          ...question,
                          correctOptionIndexes: question.type === "Poll" ? [] : [optionIndex]
                        }))
                      }
                      className={cn(
                        "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[11px]",
                        isCorrect ? "border-emerald-500 bg-emerald-500 text-white" : "border-border text-transparent"
                      )}
                      aria-label={`Сделать вариант ${optionIndex + 1} правильным`}
                    >
                      ✓
                    </button>

                    <input
                      value={option}
                      onChange={(event) =>
                        updateQuestion((question) => ({
                          ...question,
                          options: question.options.map((item, index) => (index === optionIndex ? event.target.value : item))
                        }))
                      }
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(optionIndex)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600"
                      aria-label="Удалить вариант"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}

              <button type="button" onClick={addOption} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-foreground">
                <Plus className="h-4 w-4" />
                Добавить вариант
              </button>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-border bg-slate-50 p-4 text-sm text-muted-foreground">
              Для открытого вопроса ученик вводит ответ текстом. Проверка выполняется вручную или с помощью ИИ.
            </div>
          )}

          <label className="mt-4 block">
            <span className="text-xs text-muted-foreground">Пояснение преподавателя</span>
            <textarea
              value={activeQuestion.explanation}
              onChange={(event) => updateQuestion((question) => ({ ...question, explanation: event.target.value }))}
              className="mt-1 h-24 w-full rounded-2xl border border-border bg-slate-50 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {questions.map((question, index) => (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                    index === activeIndex ? "bg-primary text-primary-foreground" : "bg-slate-100 text-muted-foreground"
                  )}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button type="button" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              <Save className="h-4 w-4" />
              Сохранить квиз
            </button>
          </div>
        </article>

        <aside className="space-y-4">
          <article className="rounded-3xl border border-border bg-white p-4 shadow-card">
            <h2 className="text-lg font-semibold text-foreground">Пакетные настройки</h2>
            <div className="mt-3 grid gap-2 text-sm">
              <label className="grid gap-1">
                <span className="text-xs text-muted-foreground">Ограничение времени</span>
                <select className="rounded-xl border border-border bg-white px-3 py-2 outline-none">
                  <option>Без лимита</option>
                  <option>5 минут</option>
                  <option>10 минут</option>
                  <option>15 минут</option>
                </select>
              </label>
              <label className="grid gap-1">
                <span className="text-xs text-muted-foreground">Баллы по умолчанию</span>
                <select className="rounded-xl border border-border bg-white px-3 py-2 outline-none">
                  <option>5 баллов</option>
                  <option>10 баллов</option>
                  <option>15 баллов</option>
                </select>
              </label>
            </div>
          </article>

          <article className="rounded-3xl border border-border bg-white p-4 shadow-card">
            <h2 className="text-lg font-semibold text-foreground">Обзор квиза</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Вопросов: {questions.length} · Длительность: {quiz.durationMinutes} мин
            </p>
            <label className="mt-3 block">
              <span className="text-xs text-muted-foreground">Описание</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-1 h-24 w-full rounded-xl border border-border bg-slate-50 px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <div className="mt-3 rounded-2xl border border-dashed border-border bg-slate-50 p-4 text-center text-sm text-muted-foreground">
              Загрузить дополнительное изображение (демо)
            </div>
            <div className="mt-3 rounded-2xl border border-border bg-slate-50 p-3">
              <p className="text-sm font-semibold text-foreground">{quiz.lessonTitle}</p>
              <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-primary" style={{ width: `${completion}%` }} />
              </div>
              <p className="mt-1 text-right text-xs text-muted-foreground">{completion}% готовности</p>
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
