import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type LessonCalendarProps = {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  selectedDay: string | null;
  onSelectDay: (day: string | null) => void;
  lessonDays: Set<string>;
  daysInMonth: Array<{ key: string; date: Date | null }>;
};

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(date);
}

function toDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export function LessonCalendar({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  selectedDay,
  onSelectDay,
  lessonDays,
  daysInMonth
}: LessonCalendarProps) {
  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">Календарь</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrevMonth}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border text-muted-foreground"
            aria-label="Предыдущий месяц"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border text-muted-foreground"
            aria-label="Следующий месяц"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm font-semibold capitalize text-foreground">{formatMonth(currentMonth)}</p>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
        {weekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {daysInMonth.map((cell) => {
          if (!cell.date) {
            return <span key={cell.key} className="h-9" aria-hidden="true" />;
          }

          const dayKey = toDayKey(cell.date);
          const hasLesson = lessonDays.has(dayKey);
          const isActive = selectedDay === dayKey;

          return (
            <button
              key={cell.key}
              type="button"
              onClick={() => onSelectDay(isActive ? null : dayKey)}
              className={cn(
                "relative h-9 rounded-xl border text-sm font-semibold transition",
                isActive ? "border-primary bg-primary text-primary-foreground" : "border-border bg-slate-50 text-foreground",
                hasLesson && !isActive ? "border-primary/50" : ""
              )}
              aria-pressed={isActive}
            >
              {cell.date.getDate()}
              {hasLesson && !isActive ? (
                <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary" aria-hidden="true" />
              ) : null}
            </button>
          );
        })}
      </div>

      <button type="button" onClick={() => onSelectDay(null)} className="mt-4 text-xs font-semibold text-primary hover:underline">
        Сбросить дату
      </button>
    </section>
  );
}
