"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PillBadge } from "@/components/shared/PillBadge";
import {
  homeworkAssignmentTypeLabels,
  homeworkCheckModeLabels,
  homeworkItems,
  HomeworkItem
} from "@/data/homework";

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
  const [typeFilter, setTypeFilter] = useState("Все форматы");
  const [checkFilter, setCheckFilter] = useState("Все варианты");

  const subjects = useMemo(() => {
    const unique = Array.from(new Set(homeworkItems.map((item) => item.subject))).sort((a, b) => a.localeCompare(b, "ru"));
    return ["Все предметы", ...unique];
  }, []);

  const typeOptions = useMemo(() => {
    return ["Все форматы", ...Object.values(homeworkAssignmentTypeLabels)];
  }, []);

  const checkOptions = useMemo(() => {
    return ["Все варианты", ...Object.values(homeworkCheckModeLabels)];
  }, []);

  const filteredHomework = useMemo(() => {
    return homeworkItems
      .filter((item) => (statusFilter === "all" ? true : item.status === statusFilter))
      .filter((item) => (subjectFilter === "Все предметы" ? true : item.subject === subjectFilter))
      .filter((item) => (typeFilter === "Все форматы" ? true : homeworkAssignmentTypeLabels[item.assignmentType] === typeFilter))
      .filter((item) => (checkFilter === "Все варианты" ? true : homeworkCheckModeLabels[item.checkMode] === checkFilter))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [checkFilter, statusFilter, subjectFilter, typeFilter]);

  const autoCheckedCount = homeworkItems.filter((item) => item.checkMode === "auto").length;
  const expertCheckedCount = homeworkItems.filter((item) => item.checkMode === "ai_teacher").length;

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <h1 className="text-3xl font-semibold text-foreground">Домашние задания</h1>
        <p className="mt-1 text-sm text-muted-foreground">Тесты, тренажеры и задания с проверкой ИИ + преподавателя</p>
        <p className="mt-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
          Автопроверяемые задания дают мгновенный фидбек и можно перепройти. Эссе и аудио идут через ИИ-предпроверку и
          финальную оценку преподавателя.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

          <label className="text-sm">
            <span className="mb-1 block font-semibold text-foreground">Формат</span>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="w-full rounded-2xl border border-border bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            <span className="mb-1 block font-semibold text-foreground">Проверка</span>
            <select
              value={checkFilter}
              onChange={(event) => setCheckFilter(event.target.value)}
              className="w-full rounded-2xl border border-border bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              {checkOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-border bg-slate-50 p-3">
            <p className="text-xs text-muted-foreground">Автопроверка</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{autoCheckedCount} заданий</p>
          </article>
          <article className="rounded-2xl border border-border bg-slate-50 p-3">
            <p className="text-xs text-muted-foreground">ИИ + преподаватель</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{expertCheckedCount} заданий</p>
          </article>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-border bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Задание</th>
                <th className="px-4 py-3">Предмет</th>
                <th className="px-4 py-3">Формат</th>
                <th className="px-4 py-3">Проверка</th>
                <th className="px-4 py-3">Срок</th>
                <th className="px-4 py-3">Статус</th>
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
                    <td className="px-4 py-3 text-muted-foreground">{homeworkAssignmentTypeLabels[item.assignmentType]}</td>
                    <td className="px-4 py-3 text-muted-foreground">{homeworkCheckModeLabels[item.checkMode]}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(item.dueDate)}</td>
                    <td className="px-4 py-3">
                      <PillBadge variant={status.variant}>{status.label}</PillBadge>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/app/homework/${item.id}`}
                        className="inline-flex rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground"
                      >
                        {item.checkMode === "auto"
                          ? "Открыть тренажер"
                          : item.status === "submitted" || item.status === "graded"
                            ? "Посмотреть"
                            : "Выполнить"}
                      </Link>
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
