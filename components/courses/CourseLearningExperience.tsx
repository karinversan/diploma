"use client";

import Link from "next/link";
import {
  AlarmClockCheck,
  BadgeCheck,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  ClipboardCheck,
  Clock3,
  FileText,
  FolderKanban,
  Hammer,
  ListChecks,
  Lock,
  PlayCircle,
  Sparkles,
  Star,
  Target,
  Trophy,
  Video
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import {
  CourseLessonUnit,
  CourseSyllabus,
  StudentCourse,
  flattenCourseUnits,
  getInitialCompletedUnitIds
} from "@/data/courses";
import {
  HomeworkItem,
  homeworkAssignmentTypeLabels,
  homeworkCheckModeLabels
} from "@/data/homework";
import { StudentLesson } from "@/data/lessons";
import { cn } from "@/lib/utils";

import { ProgressBar } from "@/components/shared/ProgressBar";

type CourseLearningExperienceProps = {
  course: StudentCourse;
  syllabus: CourseSyllabus;
  homeworkPlan: HomeworkItem[];
  nextLesson?: StudentLesson;
};

type CourseTab = "program" | "plan" | "assignments" | "faq";

function formatLessonDate(value: string) {
  const label = new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));

  return label.replace(/^[A-Za-zА-Яа-яЁё]/, (first) => first.toLowerCase());
}

function getKindIcon(kind: CourseLessonUnit["kind"]) {
  if (kind === "Видео") {
    return PlayCircle;
  }
  if (kind === "Чтение") {
    return FileText;
  }
  if (kind === "Практика") {
    return Hammer;
  }
  if (kind === "Тест") {
    return ClipboardCheck;
  }
  if (kind === "Созвон") {
    return Video;
  }
  return FolderKanban;
}

function getHomeworkStatusLabel(item: HomeworkItem) {
  if (item.status === "graded") {
    return "Проверено";
  }
  if (item.status === "submitted") {
    return "На проверке";
  }
  if (item.status === "in_progress") {
    return "В работе";
  }
  return "Новое";
}

function getHomeworkStatusClass(item: HomeworkItem) {
  if (item.status === "graded") {
    return "border-emerald-300 bg-emerald-50 text-emerald-700";
  }
  if (item.status === "submitted") {
    return "border-amber-300 bg-amber-50 text-amber-700";
  }
  if (item.status === "in_progress") {
    return "border-blue-300 bg-blue-50 text-blue-700";
  }
  return "border-slate-300 bg-slate-50 text-slate-700";
}

function getCourseUnitHref(courseId: string, unitId: string) {
  return `/app/courses/${encodeURIComponent(courseId)}/units/${encodeURIComponent(unitId)}`;
}

function getUnitOpenLabel(kind: CourseLessonUnit["kind"]) {
  if (kind === "Видео") {
    return "Смотреть урок";
  }
  if (kind === "Чтение") {
    return "Открыть материал";
  }
  if (kind === "Практика") {
    return "Открыть практику";
  }
  if (kind === "Тест") {
    return "Открыть квиз";
  }
  if (kind === "Созвон") {
    return "Открыть модуль созвона";
  }

  return "Открыть модуль";
}

export function CourseLearningExperience({
  course,
  syllabus,
  homeworkPlan,
  nextLesson
}: CourseLearningExperienceProps) {
  const [activeTab, setActiveTab] = useState<CourseTab>("program");
  const [expandedModules, setExpandedModules] = useState<string[]>(() =>
    syllabus.modules.length > 0 ? [syllabus.modules[0].id] : []
  );
  const [completedUnitIds, setCompletedUnitIds] = useState<string[]>(() => getInitialCompletedUnitIds(course, syllabus));

  const flattenedUnits = useMemo(() => flattenCourseUnits(syllabus), [syllabus]);
  const completedSet = useMemo(() => new Set(completedUnitIds), [completedUnitIds]);

  const unitIndexMap = useMemo(() => {
    return new Map(flattenedUnits.map((unit, index) => [unit.id, index]));
  }, [flattenedUnits]);

  const completedCount = completedUnitIds.length;
  const totalCount = flattenedUnits.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const remainingUnits = Math.max(0, totalCount - completedCount);

  const nextUnit = useMemo(() => {
    return flattenedUnits.find((unit) => !completedSet.has(unit.id));
  }, [completedSet, flattenedUnits]);

  const gradedHomework = homeworkPlan.filter((item) => item.status === "graded");
  const autoCheckedHomework = homeworkPlan.filter((item) => item.checkMode === "auto").length;
  const teacherCheckedHomework = homeworkPlan.filter((item) => item.checkMode === "ai_teacher").length;

  const averageScore =
    gradedHomework.length > 0
      ? Math.round(
          gradedHomework.reduce((total, item) => total + (item.score ?? item.maxScore ?? 0), 0) / gradedHomework.length
        )
      : 0;

  const isCertificateReady = progressPercent >= 90 && gradedHomework.length >= Math.max(1, Math.round(homeworkPlan.length * 0.5));

  const firstUnit = flattenedUnits[0];
  const continueUnit = nextUnit ?? firstUnit;
  const continueHref = continueUnit
    ? getCourseUnitHref(course.id, continueUnit.id)
    : `/app/courses/${encodeURIComponent(course.id)}`;
  const continueLabel = continueUnit
    ? `${nextUnit ? "Продолжить:" : "Открыть:"} ${getUnitOpenLabel(continueUnit.kind)}`
    : "Вернуться к курсам";

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((item) => item !== moduleId) : [...prev, moduleId]
    );
  };

  const isUnitUnlocked = useCallback(
    (unitId: string) => {
      const index = unitIndexMap.get(unitId);
      if (index === undefined) {
        return false;
      }

      return completedSet.has(unitId) || index <= completedCount;
    },
    [completedCount, completedSet, unitIndexMap]
  );

  const markUnitCompleted = (unitId: string) => {
    if (completedSet.has(unitId) || !isUnitUnlocked(unitId)) {
      return;
    }

    setCompletedUnitIds((prev) => {
      const next = [...prev, unitId];
      return next.sort((a, b) => (unitIndexMap.get(a) ?? 0) - (unitIndexMap.get(b) ?? 0));
    });
  };

  const moduleMetrics = useMemo(() => {
    return syllabus.modules.map((module) => {
      const moduleUnitIds = module.lessons.map((lesson) => lesson.id);
      const doneCount = moduleUnitIds.filter((id) => completedSet.has(id)).length;
      const firstUnitId = moduleUnitIds[0];
      const unlocked = firstUnitId ? isUnitUnlocked(firstUnitId) : false;
      const progress = module.lessons.length > 0 ? Math.round((doneCount / module.lessons.length) * 100) : 0;

      return {
        moduleId: module.id,
        doneCount,
        progress,
        unlocked,
        isCompleted: doneCount === module.lessons.length
      };
    });
  }, [completedSet, isUnitUnlocked, syllabus.modules]);

  const moduleMetricById = useMemo(() => {
    return new Map(moduleMetrics.map((metric) => [metric.moduleId, metric]));
  }, [moduleMetrics]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-white p-4 shadow-card sm:p-5">
        <nav aria-label="Хлебные крошки" className="text-sm text-muted-foreground">
          <Link href="/app/courses" className="hover:text-foreground">
            Курсы
          </Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-foreground">{course.title}</span>
        </nav>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.14fr_0.86fr]">
        <article className="rounded-3xl border border-border bg-white p-6 shadow-card sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{course.category}</span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              {course.level}
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              {course.accessType}
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              {syllabus.modules.length} модулей
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold text-foreground">{course.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{course.description}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Прогресс</p>
              <p className="mt-1 text-xl font-semibold text-foreground">{progressPercent}%</p>
            </div>
            <div className="rounded-2xl border border-border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Уроков</p>
              <p className="mt-1 text-xl font-semibold text-foreground">
                {completedCount}/{totalCount}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Длительность</p>
              <p className="mt-1 text-xl font-semibold text-foreground">{course.durationHours} ч</p>
            </div>
            <div className="rounded-2xl border border-border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Срок</p>
              <p className="mt-1 text-xl font-semibold text-foreground">{syllabus.roadmap.totalWeeks} нед.</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <Target className="h-4 w-4 text-primary" />
              Цель программы
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{syllabus.roadmap.targetResult}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={continueHref}
              className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              {continueLabel}
            </Link>
            <Link
              href={`/app/messages?teacher=${encodeURIComponent(course.teacherId)}`}
              className="inline-flex items-center justify-center rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground"
            >
              Обсудить план с преподавателем
            </Link>
          </div>
        </article>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-border bg-white p-5 shadow-card">
            <h2 className="text-lg font-semibold text-foreground">Ваш учебный план</h2>
            <p className="mt-1 text-sm text-muted-foreground">Рекомендованный ритм: {syllabus.roadmap.hoursPerWeek} часов в неделю</p>
            <div className="mt-3 space-y-2">
              {syllabus.roadmap.weeklyPlan.map((item) => (
                <article key={item.id} className="rounded-2xl border border-border bg-slate-50 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.dayLabel}</p>
                  <p className="mt-1 text-sm text-foreground">{item.action}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-white p-5 shadow-card">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <Trophy className="h-4 w-4 text-primary" />
              Сертификат по курсу
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">Условия завершения программы:</p>
            <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
              {syllabus.roadmap.certificateConditions.map((condition) => {
                const isDone =
                  condition.includes("90%")
                    ? progressPercent >= 90
                    : condition.includes("контрольные")
                      ? moduleMetrics.every((metric) => metric.isCompleted)
                      : condition.includes("финальную")
                        ? gradedHomework.length > 0
                        : averageScore >= 70;

                return (
                  <li key={condition} className="inline-flex items-start gap-2">
                    <span
                      className={cn(
                        "mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border",
                        isDone ? "border-emerald-300 bg-emerald-100 text-emerald-700" : "border-border bg-white text-muted-foreground"
                      )}
                    >
                      {isDone ? <CheckCircle2 className="h-3 w-3" /> : <CircleDot className="h-3 w-3" />}
                    </span>
                    {condition}
                  </li>
                );
              })}
            </ul>
            <p
              className={cn(
                "mt-3 rounded-xl border px-3 py-2 text-xs font-semibold",
                isCertificateReady ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-amber-300 bg-amber-50 text-amber-700"
              )}
            >
              {isCertificateReady
                ? "Вы близки к выдаче сертификата. Осталось подтвердить итоговый этап."
                : `До сертификата осталось закрыть ${remainingUnits} урок(а/ов) и контрольные точки.`}
            </p>
          </section>

          <section className="rounded-3xl border border-border bg-white p-5 shadow-card">
            <h3 className="text-sm font-semibold text-foreground">Навыки, которые вы получите</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {syllabus.skills.map((skill) => (
                <span key={skill} className="rounded-full border border-border bg-slate-50 px-3 py-1 text-xs font-medium text-foreground">
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-slate-50 p-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
                <CalendarDays className="h-3.5 w-3.5 text-primary" />
                Ближайшая активность
              </p>
              {nextLesson ? (
                <>
                  <p className="mt-2 text-sm text-foreground">{formatLessonDate(nextLesson.startAt)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{nextLesson.teacherName}</p>
                  <Link
                    href={nextLesson.joinUrl}
                    className="mt-3 inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                  >
                    Перейти в урок
                  </Link>
                </>
              ) : nextUnit ? (
                <>
                  <p className="mt-2 text-sm text-foreground">{nextUnit.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Следующий шаг: {nextUnit.kind.toLowerCase()} • модуль {nextUnit.moduleWeek}
                  </p>
                  <Link
                    href={getCourseUnitHref(course.id, nextUnit.id)}
                    className="mt-3 inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                  >
                    {getUnitOpenLabel(nextUnit.kind)}
                  </Link>
                </>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">Вы завершили все модули. Можно повторить материалы и закрепить навыки.</p>
              )}
            </div>
          </section>
        </aside>
      </section>

      <section className="rounded-3xl border border-border bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-slate-50 p-2">
          {[
            { id: "program", label: "Программа курса", icon: BookOpenCheck },
            { id: "plan", label: "План обучения", icon: AlarmClockCheck },
            { id: "assignments", label: "Задания и оценки", icon: ListChecks },
            { id: "faq", label: "FAQ", icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as CourseTab)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition",
                  activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "program" ? (
          <div className="mt-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Структура программы</p>
                <p className="text-xs text-muted-foreground">Раскрывайте модули, проходите уроки по порядку и закрывайте чекпоинты</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setExpandedModules(syllabus.modules.map((module) => module.id))}
                  className="inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  Раскрыть все
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedModules([])}
                  className="inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  Свернуть все
                </button>
              </div>
            </div>

            {syllabus.modules.map((module) => {
              const metric = moduleMetricById.get(module.id);
              const isOpen = expandedModules.includes(module.id);
              const moduleStatusText = metric?.isCompleted
                ? "Модуль завершен"
                : metric?.unlocked
                  ? "Модуль доступен"
                  : "Откроется после предыдущего";

              return (
                <article key={module.id} className="rounded-2xl border border-border bg-slate-50 p-4">
                  <button
                    type="button"
                    onClick={() => toggleModule(module.id)}
                    className="flex w-full items-center justify-between gap-3"
                  >
                    <div className="text-left">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Неделя {module.week}</p>
                      <h3 className="mt-1 text-base font-semibold text-foreground">{module.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{moduleStatusText}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                          metric?.isCompleted
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : metric?.unlocked
                              ? "border-primary/25 bg-primary/10 text-primary"
                              : "border-border bg-white text-muted-foreground"
                        )}
                      >
                        {metric?.doneCount ?? 0}/{module.lessons.length}
                      </span>
                      <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition", isOpen ? "rotate-180" : "")} />
                    </div>
                  </button>

                  <div className="mt-3">
                    <ProgressBar value={metric?.progress ?? 0} ariaLabel={`Прогресс ${module.title}`} />
                  </div>

                  {isOpen ? (
                    <div className="mt-4 space-y-3">
                      <p className="text-sm text-muted-foreground">Цель модуля: {module.goal}</p>

                      {module.lessons.map((lesson) => {
                        const Icon = getKindIcon(lesson.kind);
                        const isCompleted = completedSet.has(lesson.id);
                        const unlocked = isUnitUnlocked(lesson.id);
                        const unitHref = getCourseUnitHref(course.id, lesson.id);
                        const lessonTextContent = (
                          <>
                            <p className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                              <Icon className="h-3.5 w-3.5 text-primary" />
                              {lesson.kind}
                              <span className="inline-flex items-center gap-1">
                                <Clock3 className="h-3.5 w-3.5" />
                                {lesson.durationMinutes} мин
                              </span>
                            </p>
                            <p className="mt-1 text-sm font-semibold text-foreground">{lesson.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{lesson.description}</p>
                            {lesson.hasAutoCheck ? (
                              <span className="mt-2 inline-flex rounded-full border border-border bg-slate-50 px-2 py-0.5 text-[11px] text-muted-foreground">
                                Автопроверка
                              </span>
                            ) : null}
                            {lesson.hasTeacherReview ? (
                              <span className="mt-2 ml-1 inline-flex rounded-full border border-border bg-slate-50 px-2 py-0.5 text-[11px] text-muted-foreground">
                                ИИ + преподаватель
                              </span>
                            ) : null}
                            {lesson.isPreview ? (
                              <span className="mt-2 ml-1 inline-flex rounded-full border border-accent/70 bg-accent/35 px-2 py-0.5 text-[11px] font-semibold text-slate-900">
                                Открытый доступ
                              </span>
                            ) : null}
                          </>
                        );

                        return (
                          <article
                            key={lesson.id}
                            className={cn(
                              "rounded-2xl border bg-white p-3 transition-transform duration-200",
                              isCompleted
                                ? "border-emerald-300"
                                : unlocked
                                  ? "border-border"
                                  : "border-dashed border-slate-300 opacity-75",
                              unlocked ? "hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lg" : ""
                            )}
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              {unlocked ? (
                                <Link
                                  href={unitHref}
                                  className="min-w-0 flex-1 rounded-xl p-1 -m-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                  aria-label={`${getUnitOpenLabel(lesson.kind)}: ${lesson.title}`}
                                >
                                  {lessonTextContent}
                                </Link>
                              ) : (
                                <div className="min-w-0 flex-1">{lessonTextContent}</div>
                              )}

                              <div className="flex flex-wrap items-center gap-2">
                                {isCompleted ? (
                                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Выполнено
                                  </span>
                                ) : !unlocked ? (
                                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-slate-100 px-3 py-1 text-xs font-semibold text-muted-foreground">
                                    <Lock className="h-3.5 w-3.5" />
                                    Заблокировано
                                  </span>
                                ) : null}

                                {unlocked ? (
                                  <Link
                                    href={unitHref}
                                    className="inline-flex items-center justify-center rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                                  >
                                    {getUnitOpenLabel(lesson.kind)}
                                  </Link>
                                ) : null}

                                {unlocked && !isCompleted ? (
                                  <button
                                    type="button"
                                    onClick={() => markUnitCompleted(lesson.id)}
                                    className="inline-flex items-center justify-center rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                                  >
                                    Отметить выполненным
                                  </button>
                                ) : null}
                              </div>
                            </div>
                          </article>
                        );
                      })}

                      <article className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-3">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Контрольная точка</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{module.checkpoint.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Формат: {module.checkpoint.mode} • Проходной балл: {module.checkpoint.passScore}%
                        </p>
                      </article>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : null}

        {activeTab === "plan" ? (
          <div className="mt-5 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <article className="rounded-2xl border border-border bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-foreground">План по неделям</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Программа рассчитана на {syllabus.roadmap.totalWeeks} недель при ритме {syllabus.roadmap.hoursPerWeek} часов в неделю.
                </p>
                <div className="mt-4 space-y-3">
                  {syllabus.roadmap.milestones.map((milestone) => (
                    <article key={milestone.id} className="rounded-xl border border-border bg-white p-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Неделя {milestone.week}</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{milestone.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{milestone.description}</p>
                    </article>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-border bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-foreground">Результаты после курса</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {syllabus.outcomes.map((outcome) => (
                    <li key={outcome} className="inline-flex items-start gap-2">
                      <Star className="mt-0.5 h-4 w-4 text-primary" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <div className="space-y-4">
              <article className="rounded-2xl border border-border bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-foreground">Требования перед стартом</h3>
                <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                  {syllabus.prerequisites.map((item) => (
                    <li key={item} className="inline-flex items-start gap-2">
                      <CircleDot className="mt-0.5 h-3.5 w-3.5 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl border border-border bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-foreground">Статус прогресса</h3>
                <p className="mt-1 text-xs text-muted-foreground">Осталось {remainingUnits} урок(а/ов) до полного завершения.</p>
                <ProgressBar value={progressPercent} className="mt-3" ariaLabel="Общий прогресс курса" />
                <p className="mt-2 text-xs font-semibold text-foreground">{progressPercent}% выполнено</p>
              </article>
            </div>
          </div>
        ) : null}

        {activeTab === "assignments" ? (
          <div className="mt-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <article className="rounded-2xl border border-border bg-slate-50 p-4">
                <p className="text-xs text-muted-foreground">Автопроверка</p>
                <p className="mt-1 text-xl font-semibold text-foreground">{autoCheckedHomework}</p>
              </article>
              <article className="rounded-2xl border border-border bg-slate-50 p-4">
                <p className="text-xs text-muted-foreground">ИИ + преподаватель</p>
                <p className="mt-1 text-xl font-semibold text-foreground">{teacherCheckedHomework}</p>
              </article>
              <article className="rounded-2xl border border-border bg-slate-50 p-4">
                <p className="text-xs text-muted-foreground">Средний балл</p>
                <p className="mt-1 text-xl font-semibold text-foreground">{averageScore}</p>
              </article>
            </div>

            {homeworkPlan.length > 0 ? (
              <div className="space-y-3">
                {homeworkPlan.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-border bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold", getHomeworkStatusClass(item))}>
                        {getHomeworkStatusLabel(item)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                      <span className="rounded-full border border-border bg-white px-2.5 py-1">
                        {homeworkAssignmentTypeLabels[item.assignmentType]}
                      </span>
                      <span className="rounded-full border border-border bg-white px-2.5 py-1">
                        {homeworkCheckModeLabels[item.checkMode]}
                      </span>
                      <span className="rounded-full border border-border bg-white px-2.5 py-1">До {item.dueDate}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href={`/app/homework/${item.id}`}
                        className="inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                      >
                        Открыть задание
                      </Link>
                      <Link
                        href={`/app/lessons/${item.lessonId}`}
                        className="inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                      >
                        Связанный урок
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <article className="rounded-2xl border border-border bg-slate-50 p-4 text-sm text-muted-foreground">
                Домашние задания появятся после активации первых модулей курса.
              </article>
            )}
          </div>
        ) : null}

        {activeTab === "faq" ? (
          <div className="mt-5 space-y-3">
            {syllabus.faq.map((faq) => (
              <details key={faq.id} className="group rounded-2xl border border-border bg-slate-50 p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-foreground">
                  {faq.question}
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
              </details>
            ))}

            <article className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm">
              <p className="inline-flex items-center gap-2 font-semibold text-foreground">
                <BadgeCheck className="h-4 w-4 text-primary" />
                Нужна помощь по курсу?
              </p>
              <p className="mt-1 text-muted-foreground">Напишите преподавателю или в поддержку — поможем подобрать темп и маршрут обучения.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/app/messages?teacher=${encodeURIComponent(course.teacherId)}`}
                  className="inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                >
                  Написать преподавателю
                </Link>
                <Link
                  href="/contacts"
                  className="inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  Поддержка
                </Link>
              </div>
            </article>
          </div>
        ) : null}
      </section>
    </div>
  );
}
