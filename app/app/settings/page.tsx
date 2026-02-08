"use client";

import { FormEvent, useMemo, useState } from "react";

import { studentProfile } from "@/data/student";

const levelOptions = ["Начинающий", "Средний", "Продвинутый"] as const;

export default function SettingsPage() {
  const [name, setName] = useState(studentProfile.name);
  const [email, setEmail] = useState(studentProfile.email);
  const [timezone, setTimezone] = useState(studentProfile.timezone);
  const [level, setLevel] = useState(studentProfile.level);
  const [goal, setGoal] = useState(studentProfile.goals[0]);
  const [notifications, setNotifications] = useState(studentProfile.notifications);
  const [isSaved, setIsSaved] = useState(false);

  const preferredFormatsLabel = useMemo(() => studentProfile.preferredFormats.join(", "), []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaved(true);
    window.setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <h1 className="text-3xl font-semibold text-foreground">Настройки</h1>
        <p className="mt-1 text-sm text-muted-foreground">Профиль, учебные цели и параметры уведомлений</p>
      </section>

      <form onSubmit={handleSubmit} className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">Профиль</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-foreground">Имя</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                className="w-full rounded-2xl border border-border bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-foreground">Электронная почта</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                className="w-full rounded-2xl border border-border bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-foreground">Часовой пояс</span>
              <input
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                type="text"
                className="w-full rounded-2xl border border-border bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-foreground">Уровень</span>
              <select
                value={level}
                onChange={(event) => setLevel(event.target.value as (typeof levelOptions)[number])}
                className="w-full rounded-2xl border border-border bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                {levelOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-foreground">Учебная цель</span>
              <input
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                type="text"
                className="w-full rounded-2xl border border-border bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
          </div>
        </section>

        <section className="space-y-5">
          <article className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Учебные предпочтения</h2>
            <p className="mt-2 text-sm text-muted-foreground">Предпочитаемые форматы: {preferredFormatsLabel}</p>
            <p className="mt-1 text-sm text-muted-foreground">Целевая нагрузка: {studentProfile.targetHoursPerWeek} часов в неделю</p>
          </article>

          <article className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Уведомления</h2>
            <div className="mt-3 space-y-3">
              <label className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-slate-50 px-3 py-2.5 text-sm">
                <span>Email-уведомления</span>
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(event) => setNotifications((prev) => ({ ...prev, email: event.target.checked }))}
                  className="h-4 w-4 rounded border-border text-primary"
                />
              </label>
              <label className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-slate-50 px-3 py-2.5 text-sm">
                <span>Мобильные уведомления</span>
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(event) => setNotifications((prev) => ({ ...prev, push: event.target.checked }))}
                  className="h-4 w-4 rounded border-border text-primary"
                />
              </label>
              <label className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-slate-50 px-3 py-2.5 text-sm">
                <span>Напоминания о занятиях</span>
                <input
                  type="checkbox"
                  checked={notifications.reminders}
                  onChange={(event) => setNotifications((prev) => ({ ...prev, reminders: event.target.checked }))}
                  className="h-4 w-4 rounded border-border text-primary"
                />
              </label>
            </div>
          </article>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Сохранить изменения
          </button>
          {isSaved ? <p className="text-center text-sm font-medium text-emerald-700">Изменения сохранены (демо).</p> : null}
        </section>
      </form>
    </div>
  );
}
