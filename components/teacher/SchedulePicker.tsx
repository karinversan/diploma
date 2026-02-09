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
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-slate-50 p-4">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
          <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
          Выберите удобный слот
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

      <div className="space-y-3">
        {scheduleSlots.map((slot) => (
          <article key={slot.date} className="rounded-2xl border border-border bg-white p-4">
            <p className="text-sm font-semibold text-foreground">{formatDate(slot.date)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {slot.times.map((time) => {
                const isSelected = selectedSlot?.date === slot.date && selectedSlot?.time === time;

                return (
                  <button
                    key={`${slot.date}-${time}`}
                    type="button"
                    onClick={() =>
                      onSelectSlot(isSelected ? null : { date: slot.date, time })
                    }
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                      isSelected
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-slate-50 text-muted-foreground hover:border-primary/30"
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

      <p className="rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm text-muted-foreground">
        {selectedSlot
          ? `Выбран слот: ${formatDate(selectedSlot.date)} в ${selectedSlot.time}`
          : "Выберите время, чтобы ускорить подтверждение пробного урока."}
      </p>
    </div>
  );
}
