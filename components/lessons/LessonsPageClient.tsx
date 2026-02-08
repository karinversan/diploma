"use client";

import { useMemo, useState } from "react";

import { LessonCalendar } from "@/components/lessons/LessonCalendar";
import { LessonCard } from "@/components/lessons/LessonCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { lessons } from "@/data/lessons";
import { useLessonCalendar } from "@/hooks/useLessonCalendar";

type LessonTab = "upcoming" | "completed";

type LessonsPageClientProps = {
  selectedCourse?: string;
  selectedTeacher?: string;
  selectedSlot?: string;
};

export function LessonsPageClient({ selectedCourse, selectedTeacher, selectedSlot }: LessonsPageClientProps) {
  const [activeTab, setActiveTab] = useState<LessonTab>("upcoming");

  const baseLessons = useMemo(() => {
    const targetStatus = activeTab === "upcoming" ? "upcoming" : "completed";

    return lessons
      .filter((lesson) => lesson.status === targetStatus)
      .filter((lesson) => (selectedCourse ? lesson.courseId === selectedCourse : true))
      .filter((lesson) => (selectedTeacher ? lesson.teacherId === selectedTeacher : true))
      .sort((a, b) => {
        const diff = new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
        return activeTab === "upcoming" ? diff : -diff;
      });
  }, [activeTab, selectedCourse, selectedTeacher]);

  const { currentMonth, setCurrentMonth, selectedDay, setSelectedDay, lessonDays, daysInMonth, filteredByDay } =
    useLessonCalendar(baseLessons);

  const lessonsList = useMemo(() => {
    return [...filteredByDay].sort((a, b) => {
      const diff = new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
      return activeTab === "upcoming" ? diff : -diff;
    });
  }, [activeTab, filteredByDay]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4">
        <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <h1 className="text-3xl font-semibold text-foreground">Занятия</h1>
          <p className="mt-1 text-sm text-muted-foreground">Планируйте расписание и быстро переходите в урок</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === "upcoming" ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
              }`}
            >
              Предстоящие
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === "completed" ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
              }`}
            >
              Прошедшие
            </button>
          </div>

          {selectedCourse ? (
            <p className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-medium text-primary">
              Показаны занятия по выбранному курсу. Чтобы увидеть все, откройте раздел без параметров фильтра.
            </p>
          ) : null}
          {selectedTeacher ? (
            <p className="mt-3 rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-medium text-primary">
              Показаны занятия выбранного преподавателя.
            </p>
          ) : null}
          {selectedSlot ? (
            <p className="mt-3 rounded-2xl border border-accent/60 bg-accent/30 px-3 py-2 text-xs font-medium text-slate-900">
              Вы выбрали время: {selectedSlot}. Отправьте сообщение преподавателю для подтверждения.
            </p>
          ) : null}
        </section>

        <LessonCalendar
          currentMonth={currentMonth}
          onPrevMonth={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
          onNextMonth={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          lessonDays={lessonDays}
          daysInMonth={daysInMonth}
        />
      </div>

      <section className="space-y-3">
        <div className="rounded-3xl border border-border bg-white p-4 shadow-card">
          <p className="text-sm text-muted-foreground">
            {selectedDay ? "Фильтр по дате включен" : "Показаны все занятия"}. Найдено уроков: {lessonsList.length}
          </p>
        </div>

        {lessonsList.length === 0 ? (
          <EmptyState
            title="Занятий не найдено"
            description="Попробуйте переключить вкладку или сбросить фильтр по дате."
            actionLabel="Сбросить фильтр"
            actionHref="/app/lessons"
          />
        ) : (
          lessonsList.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)
        )}
      </section>
    </div>
  );
}
