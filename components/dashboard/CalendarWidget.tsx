import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type CalendarWidgetProps = {
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

const weekLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export function CalendarWidget({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  selectedDay,
  onSelectDay,
  lessonDays,
  daysInMonth
}: CalendarWidgetProps) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Календарь занятий</h2>
          <p className="text-sm text-muted-foreground">Выберите дату, чтобы отфильтровать уроки</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrevMonth}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border text-muted-foreground hover:border-primary hover:text-foreground"
            aria-label="Предыдущий месяц"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border text-muted-foreground hover:border-primary hover:text-foreground"
            aria-label="Следующий месяц"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold capitalize text-foreground">{formatMonth(currentMonth)}</p>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
        {weekLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {daysInMonth.map((item) => {
          if (!item.date) {
            return <span key={item.key} className="h-10 rounded-xl bg-transparent" aria-hidden="true" />;
          }

          const dayKey = toDayKey(item.date);
          const hasLesson = lessonDays.has(dayKey);
          const isSelected = selectedDay === dayKey;
          const isPast = item.date < now;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectDay(isSelected ? null : dayKey)}
              className={cn(
                "relative h-10 rounded-xl border text-sm font-semibold transition",
                hasLesson ? "border-primary/30" : "border-transparent",
                isSelected ? "bg-primary text-primary-foreground" : "bg-slate-50 text-foreground hover:border-primary/40",
                isPast && !isSelected ? "text-muted-foreground" : ""
              )}
              aria-pressed={isSelected}
            >
              {item.date.getDate()}
              {hasLesson && !isSelected ? (
                <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary" aria-hidden="true" />
              ) : null}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onSelectDay(null)}
        className="mt-4 text-xs font-semibold text-primary hover:underline"
      >
        Сбросить фильтр по дате
      </button>
    </section>
  );
}
