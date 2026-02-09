"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  FolderKanban,
  Hammer,
  MessageSquare,
  PlayCircle,
  Sparkles,
  Video
} from "lucide-react";

import { CourseFlattenedUnit, StudentCourse } from "@/data/courses";
import {
  HomeworkItem,
  homeworkAssignmentTypeLabels,
  homeworkCheckModeLabels
} from "@/data/homework";
import { cn } from "@/lib/utils";

import { LiveLessonBookingDialog } from "@/components/courses/LiveLessonBookingDialog";
import { ProgressBar } from "@/components/shared/ProgressBar";

type CourseUnitContentProps = {
  course: StudentCourse;
  unit: CourseFlattenedUnit;
  moduleUnits: CourseFlattenedUnit[];
  previousUnit?: CourseFlattenedUnit;
  nextUnit?: CourseFlattenedUnit;
  relatedHomework: HomeworkItem[];
};

function getUnitHref(courseId: string, unitId: string) {
  return `/app/courses/${encodeURIComponent(courseId)}/units/${encodeURIComponent(unitId)}`;
}

function getKindMeta(kind: CourseFlattenedUnit["kind"]) {
  if (kind === "Видео") {
    return {
      icon: PlayCircle,
      short: "Видео-урок",
      subtitle: "Смотрите материал, фиксируйте ключевые тезисы и переходите к практике."
    };
  }
  if (kind === "Чтение") {
    return {
      icon: FileText,
      short: "Материал",
      subtitle: "Структурированный конспект с примерами и тезисами для повторения."
    };
  }
  if (kind === "Практика") {
    return {
      icon: Hammer,
      short: "Практика",
      subtitle: "Выполните задания с моментальной проверкой и подсказками."
    };
  }
  if (kind === "Тест") {
    return {
      icon: ClipboardCheck,
      short: "Квиз",
      subtitle: "Проверьте понимание темы перед следующим шагом."
    };
  }
  if (kind === "Созвон") {
    return {
      icon: Video,
      short: "Живой урок",
      subtitle: "Подготовьтесь к созвону: вопросы, цели и материалы перед встречей."
    };
  }

  return {
    icon: FolderKanban,
    short: "Проект",
    subtitle: "Соберите итоговый результат по модулю и отправьте на проверку."
  };
}

export function CourseUnitContent({
  course,
  unit,
  moduleUnits,
  previousUnit,
  nextUnit,
  relatedHomework
}: CourseUnitContentProps) {
  const [checkedPracticeSteps, setCheckedPracticeSteps] = useState<Record<string, boolean>>({});
  const [practiceDraft, setPracticeDraft] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [projectDraft, setProjectDraft] = useState("");

  const kindMeta = getKindMeta(unit.kind);
  const KindIcon = kindMeta.icon;

  const modulePosition = useMemo(() => {
    const currentIndex = moduleUnits.findIndex((item) => item.id === unit.id);
    if (currentIndex < 0) {
      return 0;
    }
    return currentIndex + 1;
  }, [moduleUnits, unit.id]);

  const moduleProgress = moduleUnits.length > 0 ? Math.round((modulePosition / moduleUnits.length) * 100) : 0;

  const practiceSteps = useMemo(
    () => [
      "Посмотрите пример решения в блоке материалов.",
      "Выполните мини-упражнение и сверьтесь с подсказкой ИИ.",
      "Запишите итоговый ответ и отправьте на проверку."
    ],
    []
  );

  const completedPracticeCount = practiceSteps.filter((_, index) => checkedPracticeSteps[String(index)]).length;

  const quiz = useMemo(
    () => ({
      question: `Какой следующий шаг после прохождения блока «${unit.title}»?`,
      options: [
        "Сразу переходить к следующему курсу",
        "Закрепить тему практикой и пройти проверочный квиз",
        "Пропустить домашнее задание"
      ],
      correctIndex: 1,
      explanation: "После материала важно закрепить тему на практике и пройти проверку, чтобы не терять прогресс."
    }),
    [unit.title]
  );

  const isQuizCorrect = quizChecked && selectedAnswer === quiz.correctIndex;

  const renderUnitWorkspace = () => {
    if (unit.kind === "Видео") {
      return (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-slate-950/95">
            <div className="aspect-video bg-[radial-gradient(circle_at_top,rgba(116,76,255,0.45),rgba(2,6,23,0.96))]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900">
                <PlayCircle className="h-4 w-4" />
                Видео-плеер (демо)
              </span>
            </div>
          </div>

          <section className="rounded-2xl border border-border bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-foreground">План видео</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>1. Введение в тему и цели урока</li>
              <li>2. Ключевая теория и разбор примеров</li>
              <li>3. Частые ошибки и как их избежать</li>
              <li>4. Подготовка к практике и квизу</li>
            </ul>
          </section>
        </div>
      );
    }

    if (unit.kind === "Чтение") {
      return (
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-foreground">Конспект урока</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Этот материал структурирует тему «{unit.title}». Сначала разберите определения, затем примеры и только после
              этого переходите к заданиям.
            </p>
            <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
              Совет: отметьте 2-3 тезиса, которые хотите применить в следующей практике.
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-foreground">Ключевые тезисы</h3>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li>• Теория раскрывается от базовых принципов к прикладным кейсам.</li>
              <li>• Каждая тема связана с заданиями и автоматической проверкой прогресса.</li>
              <li>• После чтения откройте практику, чтобы закрепить тему сразу.</li>
            </ul>
          </section>
        </div>
      );
    }

    if (unit.kind === "Практика") {
      return (
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-foreground">Тренажер по теме</h3>
            <p className="mt-1 text-sm text-muted-foreground">Отмечайте шаги по мере выполнения. Все ответы проверяются автоматически.</p>
            <div className="mt-3 space-y-2">
              {practiceSteps.map((step, index) => {
                const key = String(index);
                const done = Boolean(checkedPracticeSteps[key]);

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCheckedPracticeSteps((prev) => ({ ...prev, [key]: !prev[key] }))}
                    className={cn(
                      "flex w-full items-start gap-2 rounded-xl border px-3 py-2 text-left text-sm transition",
                      done ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-border bg-white text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border",
                        done ? "border-emerald-500 bg-emerald-500 text-white" : "border-border bg-white text-transparent"
                      )}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                    </span>
                    {step}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-foreground">Ответ по практике</h3>
            <textarea
              value={practiceDraft}
              onChange={(event) => setPracticeDraft(event.target.value)}
              placeholder="Опишите решение коротко: что получилось и где были сложности."
              className="mt-2 h-28 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                Выполнено шагов: {completedPracticeCount}/{practiceSteps.length}
              </p>
              <button
                type="button"
                className="inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
              >
                Отправить на автопроверку (демо)
              </button>
            </div>
          </section>
        </div>
      );
    }

    if (unit.kind === "Тест") {
      return (
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-foreground">Проверочный квиз</h3>
            <p className="mt-2 text-sm text-foreground">{quiz.question}</p>
            <div className="mt-3 space-y-2">
              {quiz.options.map((option, index) => (
                <label
                  key={option}
                  className={cn(
                    "flex cursor-pointer items-start gap-2 rounded-xl border px-3 py-2 text-sm transition",
                    selectedAnswer === index ? "border-primary bg-primary/5" : "border-border bg-white"
                  )}
                >
                  <input
                    type="radio"
                    name="quiz-answer"
                    checked={selectedAnswer === index}
                    onChange={() => setSelectedAnswer(index)}
                    className="mt-1 h-4 w-4 accent-primary"
                  />
                  {option}
                </label>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={selectedAnswer === null}
                onClick={() => setQuizChecked(true)}
                className="inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                Проверить ответ
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedAnswer(null);
                  setQuizChecked(false);
                }}
                className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground"
              >
                Сбросить
              </button>
            </div>
          </section>

          {quizChecked ? (
            <section
              className={cn(
                "rounded-2xl border p-4 text-sm",
                isQuizCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-amber-300 bg-amber-50 text-amber-800"
              )}
            >
              <p className="font-semibold">{isQuizCorrect ? "Верно! Отличный результат." : "Есть неточность. Попробуйте еще раз."}</p>
              <p className="mt-1">{quiz.explanation}</p>
            </section>
          ) : null}
        </div>
      );
    }

    if (unit.kind === "Созвон") {
      return (
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-foreground">Подготовка к живому занятию</h3>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li>1. Повторите конспект и отметьте вопросы для преподавателя.</li>
              <li>2. Откройте практику из этого модуля и выполните минимум 70% заданий.</li>
              <li>3. Подготовьте один пример из своей учебной ситуации для разбора на уроке.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-semibold text-foreground">Созвон проходит в учебной комнате платформы</p>
            <p className="mt-1 text-sm text-muted-foreground">
              В комнате доступны чат, доска, тесты в реальном времени и артефакты урока.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Выберите преподавателя и конкретное время прямо из этого модуля. После подтверждения слот появится в разделе
              расписания.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <LiveLessonBookingDialog course={course} />
              <Link
                href="/app/messages"
                className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground"
              >
                Уточнить детали у преподавателя
              </Link>
              <Link
                href={`/app/lessons?course=${encodeURIComponent(course.id)}`}
                className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground"
              >
                Открыть расписание
              </Link>
            </div>
          </section>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <section className="rounded-2xl border border-border bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-foreground">Проектный блок</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Соберите итоговый результат по теме модуля: структурируйте решение, приложите аргументацию и оформите выводы.
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Черновик решения</li>
            <li>• Финальная версия проекта</li>
            <li>• Короткая самооценка прогресса</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-foreground">Черновик проекта</h3>
          <textarea
            value={projectDraft}
            onChange={(event) => setProjectDraft(event.target.value)}
            placeholder="Опишите идею, этапы реализации и ожидаемый результат."
            className="mt-2 h-28 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
          />
          <button
            type="button"
            className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            Сохранить черновик (демо)
          </button>
        </section>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{unit.kind}</span>
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            Модуль {unit.moduleWeek}
          </span>
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            {unit.durationMinutes} минут
          </span>
        </div>

        <h1 className="mt-3 text-3xl font-semibold text-foreground">{unit.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{unit.description}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border border-border bg-slate-50 p-3">
            <p className="text-xs text-muted-foreground">Тип контента</p>
            <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-foreground">
              <KindIcon className="h-4 w-4 text-primary" />
              {kindMeta.short}
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-slate-50 p-3">
            <p className="text-xs text-muted-foreground">Позиция в модуле</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {modulePosition}/{moduleUnits.length}
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-slate-50 p-3">
            <p className="text-xs text-muted-foreground">Прогресс модуля</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{moduleProgress}%</p>
            <ProgressBar value={moduleProgress} className="mt-2" ariaLabel="Прогресс текущего модуля" />
          </article>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">{kindMeta.subtitle}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {previousUnit ? (
            <Link
              href={getUnitHref(course.id, previousUnit.id)}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Предыдущий шаг
            </Link>
          ) : null}
          {nextUnit ? (
            <Link
              href={getUnitHref(course.id, nextUnit.id)}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              Следующий шаг
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href={`/app/courses/${encodeURIComponent(course.id)}`}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              Вернуться к программе курса
            </Link>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <article className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">{renderUnitWorkspace()}</article>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-border bg-white p-4 shadow-card">
            <h2 className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
              <BookOpenText className="h-4 w-4 text-primary" />
              Уроки модуля
            </h2>
            <div className="mt-3 space-y-2">
              {moduleUnits.map((moduleUnit) => {
                const active = moduleUnit.id === unit.id;

                return (
                  <Link
                    key={moduleUnit.id}
                    href={getUnitHref(course.id, moduleUnit.id)}
                    className={cn(
                      "block rounded-xl border px-3 py-2 text-sm transition",
                      active
                        ? "border-primary/40 bg-primary/10 text-foreground"
                        : "border-border bg-slate-50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <p className="text-xs uppercase tracking-wide">{moduleUnit.kind}</p>
                    <p className="mt-1 font-medium">{moduleUnit.title}</p>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-white p-4 shadow-card">
            <h3 className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Связанные задания
            </h3>
            {relatedHomework.length > 0 ? (
              <div className="mt-3 space-y-2">
                {relatedHomework.slice(0, 3).map((homework) => (
                  <article key={homework.id} className="rounded-xl border border-border bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-foreground">{homework.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {homeworkAssignmentTypeLabels[homework.assignmentType]} • {homeworkCheckModeLabels[homework.checkMode]}
                    </p>
                    <Link
                      href={`/app/homework/${homework.id}`}
                      className="mt-2 inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                    >
                      Открыть задание
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">Задания появятся после активации следующих этапов курса.</p>
            )}
          </section>

          <section className="rounded-3xl border border-border bg-white p-4 shadow-card">
            <p className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              Нужна помощь?
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Можно написать преподавателю или перейти в блок расписания уроков.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/app/messages?teacher=${encodeURIComponent(course.teacherId)}`}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Написать
              </Link>
              <Link
                href={`/app/lessons?course=${encodeURIComponent(course.id)}`}
                className="inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                Расписание
              </Link>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
