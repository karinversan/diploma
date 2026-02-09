"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { paymentSettingsTabs, type PaymentSettingsTabId } from "@/data/payments";
import { studentProfile } from "@/data/student";
import { cn } from "@/lib/utils";

const levelOptions = ["Начинающий", "Средний", "Продвинутый"] as const;

const settingsTabDescription: Record<Exclude<PaymentSettingsTabId, "payment" | "details">, string> = {
  profile: "Раздел профиля объединен с личными данными в демо-версии. Здесь можно редактировать учебные цели и контакты.",
  password: "Смена пароля подключается после серверной авторизации и реального входа.",
  notifications: "Параметры уведомлений настраиваются в демо в блоке ниже."
};

function getSettingsTab(value: string | null): Exclude<PaymentSettingsTabId, "payment"> {
  if (value === "profile" || value === "password" || value === "notifications") {
    return value;
  }

  return "details";
}

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const activeTab = getSettingsTab(searchParams.get("tab"));

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

        <nav className="mt-5 flex gap-1 overflow-x-auto border-b border-border pb-0.5" aria-label="Разделы настроек">
          {paymentSettingsTabs.map((tab) => {
            const isActive = tab.id === activeTab;
            const href = tab.id === "payment" ? "/app/payments" : `/app/settings?tab=${tab.id}`;
            return (
              <Link
                key={tab.id}
                href={href}
                className={cn(
                  "whitespace-nowrap rounded-t-2xl px-4 py-3 text-sm font-semibold transition",
                  isActive ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </section>

      {activeTab !== "details" ? (
        <section className="rounded-3xl border border-dashed border-border bg-slate-50 p-6">
          <h2 className="text-lg font-semibold text-foreground">Раздел в демо-версии</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{settingsTabDescription[activeTab]}</p>
          <Link
            href="/app/settings?tab=details"
            className="mt-4 inline-flex rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground"
          >
            Вернуться к личным данным
          </Link>
        </section>
      ) : (
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
      )}
    </div>
  );
}
