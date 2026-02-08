"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PillBadge } from "@/components/shared/PillBadge";
import { homeworkItems, HomeworkItem } from "@/data/homework";

const statusOptions: Array<{ value: "all" | HomeworkItem["status"]; label: string }> = [
  { value: "all", label: "Все статусы" },
  { value: "new", label: "Новое" },
  { value: "in_progress", label: "В работе" },
  { value: "submitted", label: "На проверке" },
  { value: "graded", label: "Проверено" }
];

const statusLabelMap: Record<HomeworkItem["status"], { label: string; variant: "warning" | "primary" | "neutral" | "success" }> = {
  new: { label: "Новое", variant: "warning" },
  in_progress: { label: "В работе", variant: "primary" },
  submitted: { label: "На проверке", variant: "neutral" },
  graded: { label: "Проверено", variant: "success" }
};

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(dateValue));
}

export default function HomeworkPage() {
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]["value"]>("all");
  const [subjectFilter, setSubjectFilter] = useState("Все предметы");

  const subjects = useMemo(() => {
    const unique = Array.from(new Set(homeworkItems.map((item) => item.subject))).sort((a, b) => a.localeCompare(b, "ru"));
    return ["Все предметы", ...unique];
  }, []);

  const filteredHomework = useMemo(() => {
    return homeworkItems
      .filter((item) => (statusFilter === "all" ? true : item.status === statusFilter))
      .filter((item) => (subjectFilter === "Все предметы" ? true : item.subject === subjectFilter))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [statusFilter, subjectFilter]);

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <h1 className="text-3xl font-semibold text-foreground">Домашние задания</h1>
        <p className="mt-1 text-sm text-muted-foreground">Следите за сроками сдачи и статусом проверки</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-semibold text-foreground">Статус</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as (typeof statusOptions)[number]["value"])}
              className="w-full rounded-2xl border border-border bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              {statusOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            <span className="mb-1 block font-semibold text-foreground">Предмет</span>
            <select
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
              className="w-full rounded-2xl border border-border bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-border bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Задание</th>
                <th className="px-4 py-3">Предмет</th>
                <th className="px-4 py-3">Срок</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Урок</th>
                <th className="px-4 py-3">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filteredHomework.map((item) => {
                const status = statusLabelMap[item.status];

                return (
                  <tr key={item.id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="mt-1 max-w-xs text-xs text-muted-foreground">{item.description}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.subject}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(item.dueDate)}</td>
                    <td className="px-4 py-3">
                      <PillBadge variant={status.variant}>{status.label}</PillBadge>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/app/lessons/${item.lessonId}`} className="font-medium text-primary hover:underline">
                        Открыть урок
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <button type="button" className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground">
                        Открыть
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredHomework.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">По выбранным фильтрам задания не найдены.</p>
        ) : null}
      </section>
    </div>
  );
}
