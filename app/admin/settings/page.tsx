"use client";

import { FormEvent, useState } from "react";

export default function AdminSettingsPage() {
  const [flags, setFlags] = useState({
    aiTranscripts: true,
    aiRecommendations: true,
    autoCheckTests: true,
    lessonRecording: false,
    strictModeration: true
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaved(true);
    window.setTimeout(() => setIsSaved(false), 1800);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <h1 className="text-3xl font-semibold text-foreground">Настройки платформы</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Глобальные фичи и режимы контроля качества. Изменения применяются в демо-режиме локально.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <div className="space-y-3">
          <label className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm">
            <span>Авто-транскрипт занятий (ASR)</span>
            <input
              type="checkbox"
              checked={flags.aiTranscripts}
              onChange={(event) => setFlags((prev) => ({ ...prev, aiTranscripts: event.target.checked }))}
              className="h-4 w-4 rounded border-border text-primary"
            />
          </label>

          <label className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm">
            <span>ИИ-рекомендации по заданиям</span>
            <input
              type="checkbox"
              checked={flags.aiRecommendations}
              onChange={(event) => setFlags((prev) => ({ ...prev, aiRecommendations: event.target.checked }))}
              className="h-4 w-4 rounded border-border text-primary"
            />
          </label>

          <label className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm">
            <span>Автопроверка тестов и квизов</span>
            <input
              type="checkbox"
              checked={flags.autoCheckTests}
              onChange={(event) => setFlags((prev) => ({ ...prev, autoCheckTests: event.target.checked }))}
              className="h-4 w-4 rounded border-border text-primary"
            />
          </label>

          <label className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm">
            <span>Запись уроков по умолчанию</span>
            <input
              type="checkbox"
              checked={flags.lessonRecording}
              onChange={(event) => setFlags((prev) => ({ ...prev, lessonRecording: event.target.checked }))}
              className="h-4 w-4 rounded border-border text-primary"
            />
          </label>

          <label className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm">
            <span>Строгая модерация чатов и материалов</span>
            <input
              type="checkbox"
              checked={flags.strictModeration}
              onChange={(event) => setFlags((prev) => ({ ...prev, strictModeration: event.target.checked }))}
              className="h-4 w-4 rounded border-border text-primary"
            />
          </label>
        </div>

        <button type="submit" className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          Сохранить параметры
        </button>
        {isSaved ? <p className="mt-2 text-sm font-medium text-emerald-700">Настройки обновлены.</p> : null}
      </form>
    </div>
  );
}
