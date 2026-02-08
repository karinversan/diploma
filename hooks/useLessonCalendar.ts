"use client";

import { useMemo, useState } from "react";

import { StudentLesson } from "@/data/lessons";

function formatDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function useLessonCalendar(lessons: StudentLesson[]) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const lessonDays = useMemo(() => {
    return new Set(lessons.map((lesson) => formatDayKey(new Date(lesson.startAt))));
  }, [lessons]);

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startWeekday = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
    const totalDays = lastDay.getDate();

    const cells: Array<{ key: string; date: Date | null }> = [];

    for (let i = 1; i < startWeekday; i += 1) {
      cells.push({ key: `empty-start-${i}`, date: null });
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const date = new Date(year, month, day);
      cells.push({ key: `day-${day}`, date });
    }

    while (cells.length % 7 !== 0) {
      cells.push({ key: `empty-end-${cells.length}`, date: null });
    }

    return cells;
  }, [currentMonth]);

  const filteredByDay = useMemo(() => {
    if (!selectedDay) {
      return lessons;
    }

    return lessons.filter((lesson) => formatDayKey(new Date(lesson.startAt)) === selectedDay);
  }, [lessons, selectedDay]);

  return {
    currentMonth,
    setCurrentMonth,
    selectedDay,
    setSelectedDay,
    lessonDays,
    daysInMonth,
    filteredByDay
  };
}
