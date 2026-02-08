"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { homeworkAssignmentTypeLabels, homeworkCheckModeLabels, HomeworkItem } from "@/data/homework";
import { StudentLesson } from "@/data/lessons";
import { VocabularyWord } from "@/data/vocabulary";

import { PillBadge } from "@/components/shared/PillBadge";

type LessonTabsProps = {
  lesson: StudentLesson;
  homework: HomeworkItem[];
  vocabulary: VocabularyWord[];
};

type TabId = "summary" | "homework" | "vocabulary" | "files";

const tabOptions: Array<{ id: TabId; label: string }> = [
  { id: "summary", label: "Конспект" },
  { id: "homework", label: "Домашка" },
  { id: "vocabulary", label: "Словарь" },
  { id: "files", label: "Файлы" }
];

const homeworkStatusLabel: Record<HomeworkItem["status"], string> = {
  new: "Новое",
  in_progress: "В работе",
  submitted: "На проверке",
  graded: "Проверено"
};

const homeworkStatusVariant: Record<HomeworkItem["status"], "warning" | "primary" | "neutral" | "success"> = {
  new: "warning",
  in_progress: "primary",
  submitted: "neutral",
  graded: "success"
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long" }).format(new Date(value));
}

export function LessonTabs({ lesson, homework, vocabulary }: LessonTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("summary");

  const tabTitle = useMemo(() => {
    if (activeTab === "summary") {
      return "ИИ-конспект урока";
    }

    if (activeTab === "homework") {
      return "Домашние задания";
    }

    if (activeTab === "vocabulary") {
      return "Словарь урока";
    }

    return "Файлы занятия";
  }, [activeTab]);

  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        {tabOptions.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.id ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
            }`}
            aria-pressed={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <h2 className="mt-5 text-lg font-semibold text-foreground">{tabTitle}</h2>

      {activeTab === "summary" ? (
        <div className="mt-4 space-y-4">
          <article className="rounded-2xl border border-border bg-slate-50 p-4">
            <p className="text-sm text-foreground">{lesson.summarySnippet}</p>
          </article>

          <article className="rounded-2xl border border-border bg-slate-50 p-4">
            <p className="text-sm font-semibold text-foreground">Фрагмент расшифровки</p>
            <p className="mt-2 text-sm text-muted-foreground">{lesson.transcriptSnippet}</p>
          </article>

          <article className="rounded-2xl border border-border bg-slate-50 p-4">
            <p className="text-sm font-semibold text-foreground">Рекомендации после урока</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {lesson.recommendations.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
        </div>
      ) : null}

      {activeTab === "homework" ? (
        homework.length > 0 ? (
          <div className="mt-4 space-y-3">
            {homework.map((item) => (
              <article key={item.id} className="rounded-2xl border border-border bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                  <PillBadge variant={homeworkStatusVariant[item.status]}>{homeworkStatusLabel[item.status]}</PillBadge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Сдать до: {formatDate(item.dueDate)}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full border border-border bg-white px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                    {homeworkAssignmentTypeLabels[item.assignmentType]}
                  </span>
                  <span className="rounded-full border border-border bg-white px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                    {homeworkCheckModeLabels[item.checkMode]}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                <Link
                  href={`/app/homework/${item.id}`}
                  className="mt-3 inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  {item.checkMode === "auto" ? "Открыть тренажер" : "Открыть задание"}
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">По этому занятию пока нет домашних заданий.</p>
        )
      ) : null}

      {activeTab === "vocabulary" ? (
        vocabulary.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {vocabulary.map((word) => (
              <article key={word.id} className="rounded-2xl border border-border bg-slate-50 p-4">
                <p className="text-sm font-semibold text-foreground">{word.word}</p>
                <p className="mt-1 text-sm text-muted-foreground">{word.translation}</p>
                <p className="mt-2 text-xs text-muted-foreground">{word.context}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">Словарь для этого занятия пока не сформирован.</p>
        )
      ) : null}

      {activeTab === "files" ? (
        lesson.files.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {lesson.files.map((file) => (
              <li key={file.id} className="flex items-center justify-between rounded-2xl border border-border bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-foreground">{file.name}</span>
                <span className="text-xs text-muted-foreground">{file.size}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">Файлы пока не добавлены.</p>
        )
      ) : null}
    </section>
  );
}
