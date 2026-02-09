import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";

import { getTeacherQuizById, teacherCabinetProfile } from "@/data/teacher-cabinet";
import { cn } from "@/lib/utils";

type TeacherQuizResultsPageProps = {
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

export default function TeacherQuizResultsPage({ params }: TeacherQuizResultsPageProps) {
  const quizId = safeDecode(params.id);
  const quiz = getTeacherQuizById(quizId);

  if (!quiz) {
    return (
      <section className="rounded-3xl border border-border bg-white p-10 text-center shadow-card">
        <h1 className="text-3xl font-semibold text-foreground">Результаты не найдены</h1>
        <p className="mt-2 text-sm text-muted-foreground">Откройте существующий квиз, чтобы посмотреть проверку.</p>
        <Link
          href="/teacher/courses"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          К курсам
        </Link>
      </section>
    );
  }

  const simulatedAnswers = quiz.questions.map((question, index) => {
    if (index === 0) {
      return question.correctOptionIndexes[0] ?? 0;
    }
    if (index === 1) {
      return (question.correctOptionIndexes[0] ?? 0) === 0 ? 1 : 0;
    }
    return question.correctOptionIndexes[0] ?? 0;
  });

  const correctCount = simulatedAnswers.filter((answer, index) => quiz.questions[index]?.correctOptionIndexes.includes(answer)).length;

  return (
    <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <section className="rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-card">
          <div className="border-b border-slate-800 px-4 py-4">
            <button type="button" className="text-sm text-slate-300">
              Скрыть
            </button>
            <p className="mt-3 text-lg font-semibold">{quiz.lessonTitle}</p>
            <div className="mt-3 inline-flex items-center gap-2">
              <Image src={teacherCabinetProfile.avatarUrl} alt={teacherCabinetProfile.name} width={34} height={34} className="h-[34px] w-[34px] rounded-xl" />
              <span className="text-sm text-slate-300">{teacherCabinetProfile.name}</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-700">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((correctCount / Math.max(quiz.questions.length, 1)) * 100)}%` }} />
            </div>
          </div>

          <div className="space-y-2 p-3">
            {quiz.questions.map((question, index) => {
              const isCorrect = question.correctOptionIndexes.includes(simulatedAnswers[index] ?? -1);
              return (
                <div key={question.id} className="rounded-2xl border border-slate-800 bg-slate-900 px-3 py-3">
                  <p className="text-sm font-semibold text-white">Вопрос {index + 1}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-300">{question.prompt}</p>
                  <p className={cn("mt-2 text-xs font-semibold", isCorrect ? "text-emerald-400" : "text-amber-400")}>
                    {isCorrect ? "Ответ верный" : "Нужна доработка"}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </aside>

      <section className="rounded-3xl border border-border bg-white p-4 shadow-card sm:p-6">
        <header className="border-b border-border pb-4">
          <p className="text-sm font-semibold text-primary">Результаты</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            Верно {correctCount} из {quiz.questions.length} вопросов
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Проверьте разбор и при необходимости перезапустите квиз.</p>
        </header>

        <div className="mt-4 space-y-4">
          {quiz.questions.map((question, questionIndex) => {
            const userAnswer = simulatedAnswers[questionIndex];
            const isCorrect = question.correctOptionIndexes.includes(userAnswer);

            return (
              <article key={question.id} className={cn("rounded-2xl border p-4", isCorrect ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/50")}>
                <p className="text-sm font-semibold text-foreground">Вопрос {questionIndex + 1}</p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">{question.prompt}</h2>

                <div className="mt-3 space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const optionIsCorrect = question.correctOptionIndexes.includes(optionIndex);
                    const optionIsChosen = optionIndex === userAnswer;

                    return (
                      <div
                        key={`${question.id}-${option}`}
                        className={cn(
                          "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm",
                          optionIsCorrect ? "border-emerald-300 bg-emerald-50" : "border-border bg-white"
                        )}
                      >
                        {optionIsChosen ? (
                          <CheckCircle2 className={cn("h-4 w-4", optionIsCorrect ? "text-emerald-600" : "text-amber-600")} />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>{option}</span>
                      </div>
                    );
                  })}
                </div>

                <p className="mt-3 text-sm font-semibold text-foreground">
                  Ваш ответ:{" "}
                  <span className={cn(isCorrect ? "text-emerald-700" : "text-amber-700")}>
                    {question.options[userAnswer] ?? "Не выбран"}
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Пояснение: {question.explanation}</p>
              </article>
            );
          })}
        </div>

        <footer className="mt-5 flex flex-wrap justify-between gap-2">
          <Link
            href={`/teacher/quizzes/${encodeURIComponent(quiz.id)}/pass`}
            className="inline-flex rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground"
          >
            Пройти заново
          </Link>
          <Link
            href={`/teacher/courses/teacher-course-1`}
            className="inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            К следующему уроку
          </Link>
        </footer>
      </section>
    </div>
  );
}
