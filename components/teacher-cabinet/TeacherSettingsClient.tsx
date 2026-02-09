"use client";

import { useState } from "react";

import { teacherCabinetProfile } from "@/data/teacher-cabinet";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "details", label: "Мои данные" },
  { id: "profile", label: "Профиль" },
  { id: "password", label: "Пароль" },
  { id: "payments", label: "Платежные данные" },
  { id: "notifications", label: "Уведомления" }
] as const;

type TabId = (typeof tabs)[number]["id"];

export function TeacherSettingsClient() {
  const [activeTab, setActiveTab] = useState<TabId>("details");

  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
      <h1 className="text-5xl font-semibold leading-none text-foreground">Настройки</h1>
      <p className="mt-2 text-sm text-muted-foreground">Управляйте профилем преподавателя, безопасностью и уведомлениями.</p>

      <div className="mt-5 flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-slate-100"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {activeTab === "details" ? (
          <article className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs text-muted-foreground">ФИО</span>
              <input defaultValue={teacherCabinetProfile.name} className="rounded-2xl border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-muted-foreground">Email</span>
              <input defaultValue={teacherCabinetProfile.email} className="rounded-2xl border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
            </label>
            <label className="grid gap-1 sm:col-span-2">
              <span className="text-xs text-muted-foreground">Специализация</span>
              <input
                defaultValue={teacherCabinetProfile.subjects.join(", ")}
                className="rounded-2xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-muted-foreground">Часовой пояс</span>
              <select defaultValue={teacherCabinetProfile.timezone} className="rounded-2xl border border-border px-3 py-2 text-sm outline-none focus:border-primary">
                <option>МСК UTC+03:00</option>
                <option>UTC+02:00</option>
                <option>UTC+04:00</option>
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-muted-foreground">Формат занятий</span>
              <select className="rounded-2xl border border-border px-3 py-2 text-sm outline-none focus:border-primary">
                <option>Индивидуально + мини-группы</option>
                <option>Только индивидуально</option>
                <option>Только мини-группы</option>
              </select>
            </label>
          </article>
        ) : null}

        {activeTab === "profile" ? (
          <article className="space-y-3">
            <label className="grid gap-1">
              <span className="text-xs text-muted-foreground">О преподавателе</span>
              <textarea
                defaultValue="Помогаю ученикам разбираться в экономике через практические кейсы и структурный подход."
                className="h-28 rounded-2xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-muted-foreground">Теги профиля</span>
              <input defaultValue="Экономика, Бизнес, Аналитика, Подготовка к экзаменам" className="rounded-2xl border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
            </label>
          </article>
        ) : null}

        {activeTab === "password" ? (
          <article className="rounded-2xl border border-dashed border-border bg-slate-50 p-5 text-sm text-muted-foreground">
            Раздел доступен в демо-режиме. Смена пароля подключается при серверной авторизации.
          </article>
        ) : null}

        {activeTab === "payments" ? (
          <article className="rounded-2xl border border-dashed border-border bg-slate-50 p-5 text-sm text-muted-foreground">
            Управление платежными данными доступно в разделе «Выплаты». Здесь появятся реквизиты и налоговые настройки.
          </article>
        ) : null}

        {activeTab === "notifications" ? (
          <article className="space-y-2">
            {[
              "Напоминания о занятиях",
              "Новые бронирования",
              "Сообщения от учеников",
              "Отчеты по прогрессу групп",
              "Финансовые уведомления"
            ].map((item, index) => (
              <label key={item} className="flex items-center justify-between rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm">
                <span>{item}</span>
                <input type="checkbox" defaultChecked={index !== 3} className="h-4 w-4 accent-primary" />
              </label>
            ))}
          </article>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <button type="button" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground">
          Отменить
        </button>
        <button type="button" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Сохранить
        </button>
      </div>
    </section>
  );
}
