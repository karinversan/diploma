"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AssessmentSubject, assessmentQuestions, assessmentSubjects } from "@/data/assessment";

import { Container } from "@/components/Container";

type AssessmentQuizProps = {
  initialSubject?: string;
};

type LevelResult = {
  title: string;
  description: string;
  badge: string;
};

function safeDecode(value?: string) {
  if (!value) {
    return undefined;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getLevel(score: number, total: number): LevelResult {
  const ratio = score / total;

  if (ratio <= 0.4) {
    return {
      title: "Начальный",
      description: "Нужно укрепить базу и шаг за шагом выстроить фундамент по ключевым темам.",
      badge: "Начальный"
    };
  }

  if (ratio <= 0.8) {
    return {
      title: "Средний",
      description: "База есть, лучше сфокусироваться на систематизации знаний и закрытии точечных пробелов.",
      badge: "Средний"
    };
  }

  return {
    title: "Продвинутый",
    description: "Уровень уверенный, стоит двигаться через усложненные задачи и прикладные сценарии.",
    badge: "Продвинутый"
  };
}

export function AssessmentQuiz({ initialSubject }: AssessmentQuizProps) {
  const decodedInitialSubject = safeDecode(initialSubject);

  const normalizedInitialSubject = assessmentSubjects.includes(decodedInitialSubject as AssessmentSubject)
    ? (decodedInitialSubject as AssessmentSubject)
    : assessmentSubjects[0];

  const [subject, setSubject] = useState<AssessmentSubject>(normalizedInitialSubject);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = assessmentQuestions[subject];
  const totalQuestions = questions.length;

  const answeredCount = useMemo(
    () => questions.filter((question) => answers[question.id] !== undefined).length,
    [answers, questions]
  );

  const score = useMemo(
    () => questions.filter((question) => answers[question.id] === question.correctOptionIndex).length,
    [answers, questions]
  );

  const level = useMemo(() => getLevel(score, totalQuestions), [score, totalQuestions]);

  const handleSubjectChange = (nextSubject: AssessmentSubject) => {
    setSubject(nextSubject);
    setAnswers({});
    setIsSubmitted(false);
  };

  const handleAnswerChange = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    if (answeredCount < totalQuestions) {
      return;
    }

    setIsSubmitted(true);
  };

  const teachersLink = `/teachers?subject=${encodeURIComponent(subject)}&level=${encodeURIComponent(level.badge)}`;
  const leadLink = `/lead?role=student&subject=${encodeURIComponent(subject)}&level=${encodeURIComponent(level.badge)}`;

  return (
    <main className="pb-16 pt-28 sm:pt-32">
      <Container>
        <section className="rounded-3xl border border-border bg-white p-6 shadow-soft sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Предварительное тестирование</p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">Определите текущий уровень за 5 вопросов</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Результат поможет точнее подобрать преподавателя и темп первых уроков.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {assessmentSubjects.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSubjectChange(item)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  subject === item ? "bg-primary text-primary-foreground" : "border border-border bg-slate-50 text-muted-foreground"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {questions.map((question, questionIndex) => {
              const selected = answers[question.id];

              return (
                <article key={question.id} className="rounded-2xl border border-border bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-foreground">
                    {questionIndex + 1}. {question.text}
                  </p>
                  <div className="mt-3 grid gap-2">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selected === optionIndex;
                      const isCorrect = question.correctOptionIndex === optionIndex;
                      const showCorrect = isSubmitted && isCorrect;
                      const showWrong = isSubmitted && isSelected && !isCorrect;

                      return (
                        <label
                          key={option}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2 text-sm transition ${
                            showCorrect
                              ? "border-emerald-300 bg-emerald-50"
                              : showWrong
                                ? "border-rose-300 bg-rose-50"
                                : isSelected
                                  ? "border-primary/40 bg-primary/5"
                                  : "border-border bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            checked={isSelected}
                            onChange={() => handleAnswerChange(question.id, optionIndex)}
                            className="mt-1 h-4 w-4 border-border text-primary focus:ring-primary"
                            disabled={isSubmitted}
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>

                  {isSubmitted ? <p className="mt-3 text-xs text-muted-foreground">{question.explanation}</p> : null}
                </article>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-muted-foreground">
              Отвечено: {answeredCount} из {totalQuestions}
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={answeredCount < totalQuestions || isSubmitted}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Показать результат
            </button>
          </div>

          {isSubmitted ? (
            <section className="mt-6 rounded-2xl border border-accent/70 bg-accent/25 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-900">Результат диагностики</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {score}/{totalQuestions} правильных — {level.title} уровень
              </p>
              <p className="mt-2 text-sm text-slate-800">{level.description}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  href={teachersLink}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Подобрать преподавателя
                </Link>
                <Link
                  href={leadLink}
                  className="inline-flex items-center justify-center rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground"
                >
                  Оставить заявку на звонок
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setAnswers({});
                    setIsSubmitted(false);
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground"
                >
                  Пройти тест заново
                </button>
              </div>
            </section>
          ) : null}
        </section>
      </Container>
    </main>
  );
}
