"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Menu } from "lucide-react";

import { TeacherQuizTemplate, teacherCabinetProfile } from "@/data/teacher-cabinet";
import { cn } from "@/lib/utils";

type TeacherQuizPassClientProps = {
  quiz: TeacherQuizTemplate;
};

function formatTime(seconds: number) {
  const safe = Math.max(0, seconds);
  const min = String(Math.floor(safe / 60)).padStart(2, "0");
  const sec = String(safe % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

export function TeacherQuizPassClient({ quiz }: TeacherQuizPassClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>(() => quiz.questions.map(() => null));
  const [timeLeft, setTimeLeft] = useState(quiz.durationMinutes * 60);

  const currentQuestion = quiz.questions[currentIndex];

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  const progress = useMemo(() => Math.round(((currentIndex + 1) / Math.max(quiz.questions.length, 1)) * 100), [currentIndex, quiz.questions.length]);
  const isLast = currentIndex === quiz.questions.length - 1;

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <section className="rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-card">
          <div className="border-b border-slate-800 px-4 py-4">
            <button type="button" className="inline-flex items-center gap-2 text-sm text-slate-300">
              <Menu className="h-4 w-4" />
              Скрыть
            </button>
            <p className="mt-3 text-lg font-semibold">{quiz.lessonTitle}</p>
            <div className="mt-3 inline-flex items-center gap-2">
              <Image src={teacherCabinetProfile.avatarUrl} alt={teacherCabinetProfile.name} width={34} height={34} className="h-[34px] w-[34px] rounded-xl" />
              <span className="text-sm text-slate-300">{teacherCabinetProfile.name}</span>
            </div>
          </div>

          <div className="max-h-[520px] space-y-2 overflow-y-auto p-3">
            {quiz.questions.map((question, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-full rounded-2xl border px-3 py-3 text-left transition",
                    isActive ? "border-primary/60 bg-primary/20 text-white" : "border-slate-800 bg-slate-900 text-slate-200"
                  )}
                >
                  <p className="text-xs font-semibold text-slate-300">Вопрос {index + 1}</p>
                  <p className="mt-1 line-clamp-2 text-sm">{question.prompt}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-950 p-4 text-white shadow-card">
          <p className="text-sm text-slate-400">Таймер</p>
          <p className="mt-2 text-4xl font-semibold tracking-[0.18em]">{formatTime(timeLeft)}</p>
        </section>
      </aside>

      <section className="rounded-3xl border border-border bg-white p-4 shadow-card sm:p-6">
        <header className="border-b border-border pb-4">
          <p className="text-sm font-semibold text-primary">
            Урок {Math.min(currentIndex + 1, quiz.questions.length)} из {quiz.questions.length}
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">{quiz.lessonTitle}</p>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </header>

        <article className="mt-5 space-y-4">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              Вопрос {currentIndex + 1} из {quiz.questions.length}
            </p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight text-foreground">{currentQuestion.prompt}</h1>
          </div>

          {currentQuestion.mediaUrl ? (
            <Image
              src={currentQuestion.mediaUrl}
              alt="Иллюстрация вопроса"
              width={1080}
              height={540}
              className="h-[280px] w-full rounded-3xl border border-border object-cover"
            />
          ) : null}

          <div className="space-y-2">
            {currentQuestion.options.map((option, optionIndex) => {
              const isSelected = answers[currentIndex] === optionIndex;
              return (
                <button
                  key={`${currentQuestion.id}-${option}`}
                  type="button"
                  onClick={() =>
                    setAnswers((previous) => previous.map((value, index) => (index === currentIndex ? optionIndex : value)))
                  }
                  className={cn(
                    "w-full rounded-2xl border px-4 py-3 text-left text-lg font-medium transition",
                    isSelected ? "border-primary bg-primary/10 text-foreground" : "border-border bg-white text-foreground hover:bg-slate-50"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </article>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-2">
          <Link
            href={`/teacher/quizzes/${encodeURIComponent(quiz.id)}/results`}
            className="inline-flex rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground"
          >
            Завершить квиз
          </Link>

          {isLast ? (
            <Link
              href={`/teacher/quizzes/${encodeURIComponent(quiz.id)}/results`}
              className="inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Показать результаты
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentIndex((previous) => Math.min(previous + 1, quiz.questions.length - 1))}
              className="inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Следующий вопрос
            </button>
          )}
        </footer>
      </section>
    </div>
  );
}
