"use client";

import { CalendarDays, Clock3 } from "lucide-react";

import { TeacherScheduleSlot } from "@/data/teachers";

export type SelectedScheduleSlot = {
  date: string;
  time: string;
};

type SchedulePickerProps = {
  scheduleSlots: TeacherScheduleSlot[];
  selectedSlot: SelectedScheduleSlot | null;
  onSelectSlot: (slot: SelectedScheduleSlot | null) => void;
};

const timezoneOptions = ["МСК UTC+03:00", "UTC+00:00", "UTC+05:00"];

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  const label = new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short"
  }).format(date);

  return label.replace(/^[A-Za-zА-Яа-яЁё]/, (first) => first.toLowerCase());
}

export function SchedulePicker({ scheduleSlots, selectedSlot, onSelectSlot }: SchedulePickerProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-slate-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
            Выберите удобное время для первого занятия
          </p>
          <label className="text-sm">
            <span className="sr-only">Часовой пояс</span>
            <select className="rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground">
              {timezoneOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Слоты обновляются автоматически. После выбора времени нажмите «Забронировать урок» в правом блоке.
        </p>
      </div>

      <div className="space-y-4">
        {scheduleSlots.map((slot) => (
          <article key={slot.date} className="rounded-2xl border border-border bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-900 px-3 py-2 text-white">
              <p className="text-sm font-semibold">{formatDate(slot.date)}</p>
              <span className="text-xs text-slate-300">Доступные слоты</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {slot.times.map((time) => {
                const isSelected = selectedSlot?.date === slot.date && selectedSlot?.time === time;

                return (
                  <button
                    key={`${slot.date}-${time}`}
                    type="button"
                    onClick={() =>
                      onSelectSlot(isSelected ? null : { date: slot.date, time })
                    }
                    className={`inline-flex min-h-12 items-center justify-center gap-1.5 rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-soft"
                        : "border-border bg-slate-50 text-foreground hover:border-primary/40 hover:bg-white"
                    }`}
                  >
                    <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                    {time}
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      <p className="rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm font-medium text-muted-foreground">
        {selectedSlot
          ? `Выбран слот: ${formatDate(selectedSlot.date)} в ${selectedSlot.time}`
          : "Выберите время, чтобы открыть подтверждение записи."}
      </p>
    </div>
  );
}
