"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, GripVertical, Menu, Plus, Sparkles } from "lucide-react";

import { CourseBuilderTemplate, TeacherCourse, courseEditorComponentBlocks } from "@/data/teacher-cabinet";
import { cn } from "@/lib/utils";

type TeacherCourseEditorClientProps = {
  course: TeacherCourse;
  template: CourseBuilderTemplate;
};

export function TeacherCourseEditorClient({ course, template }: TeacherCourseEditorClientProps) {
  const [activeSubsectionId, setActiveSubsectionId] = useState(template.subsections[0]?.id ?? "");
  const [description, setDescription] = useState(
    "Добро пожаловать в курс! Здесь можно редактировать структуру урока, вставлять видео, материалы, таблицы и интерактивные задания."
  );

  const activeSubsection = useMemo(() => {
    return template.subsections.find((item) => item.id === activeSubsectionId) ?? template.subsections[0];
  }, [activeSubsectionId, template.subsections]);

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-800 bg-slate-950 p-4 text-white shadow-card sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 text-slate-200"
              aria-label="Открыть меню раздела"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">{template.weekTitle}</p>
              <p className="truncate text-sm text-slate-400">{template.subtitle}</p>
            </div>
            <span className="hidden items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300 sm:inline-flex">
              <Check className="h-3 w-3 text-emerald-400" />
              {template.lastSavedLabel}
            </span>
          </div>

          <Link
            href={`/teacher/courses/${encodeURIComponent(course.id)}/preview`}
            className="inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Предпросмотр раздела
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-white p-4 shadow-card">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary"
          >
            <Plus className="h-4 w-4" />
            Добавить подраздел
          </button>
          {template.subsections.map((subsection) => (
            <button
              key={subsection.id}
              type="button"
              onClick={() => setActiveSubsectionId(subsection.id)}
              className={cn(
                "rounded-2xl border px-3 py-2 text-sm font-medium transition",
                activeSubsection?.id === subsection.id
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-border bg-white text-muted-foreground hover:bg-slate-50"
              )}
            >
              {subsection.title}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[200px_minmax(0,1fr)_280px]">
        <aside className="rounded-3xl border border-border bg-white p-3 shadow-card">
          <h2 className="px-2 text-sm font-semibold text-foreground">Компоненты</h2>
          <div className="mt-3 grid gap-2">
            {courseEditorComponentBlocks.map((block) => (
              <button
                key={block}
                type="button"
                className={cn(
                  "rounded-2xl border px-3 py-3 text-left text-sm font-medium transition",
                  block === "Видео"
                    ? "border-slate-900 bg-slate-950 text-white"
                    : "border-border bg-white text-foreground hover:bg-slate-50"
                )}
              >
                {block}
              </button>
            ))}
          </div>
        </aside>

        <article className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-3xl font-semibold text-foreground">{activeSubsection?.title}</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{activeSubsection?.intro}</p>

          <div className="mt-4 rounded-2xl border border-border">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/classroom-preview.svg"
                alt={activeSubsection?.videoTitle ?? "Видео урока"}
                width={960}
                height={540}
                className="h-[320px] w-full object-cover"
              />
              <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground">
                Видео-урок
              </div>
              <button
                type="button"
                className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/95 px-5 py-2 text-sm font-semibold text-foreground"
              >
                {activeSubsection?.videoTitle}
              </button>
            </div>
          </div>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="mt-4 h-24 w-full rounded-2xl border border-border bg-slate-50 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
          />

          <ul className="mt-4 space-y-2 rounded-2xl border border-border bg-slate-50 p-4 text-sm text-muted-foreground">
            {activeSubsection?.bulletItems.map((item) => (
              <li key={item} className="flex gap-2">
                <span>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {activeSubsection?.mediaGallery.map((media, index) => (
              <Image key={`${media}-${index}`} src={media} alt={`Иллюстрация ${index + 1}`} width={480} height={280} className="h-36 w-full rounded-2xl border border-border object-cover" />
            ))}
          </div>
        </article>

        <aside className="space-y-4">
          <article className="rounded-3xl border border-border bg-white p-4 shadow-card">
            <h3 className="text-lg font-semibold text-foreground">Типографика</h3>
            <div className="mt-3 grid gap-2 text-sm">
              <label className="grid gap-1">
                <span className="text-xs text-muted-foreground">Шрифт</span>
                <select className="rounded-xl border border-border bg-white px-3 py-2 outline-none">
                  <option>Manrope</option>
                  <option>Inter</option>
                  <option>Montserrat</option>
                </select>
              </label>
              <label className="grid gap-1">
                <span className="text-xs text-muted-foreground">Размер</span>
                <select className="rounded-xl border border-border bg-white px-3 py-2 outline-none">
                  <option>16</option>
                  <option>18</option>
                  <option>20</option>
                </select>
              </label>
            </div>
          </article>

          <article className="rounded-3xl border border-border bg-white p-4 shadow-card">
            <h3 className="text-lg font-semibold text-foreground">Гайд по курсу</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Добавляйте вводные материалы, практики и квизы внутри каждого модуля.
            </p>
            <button type="button" className="mt-3 inline-flex w-full justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Открыть чек-лист
            </button>
          </article>

          <article className="rounded-3xl border border-slate-800 bg-slate-950 p-4 text-white shadow-card">
            <h3 className="text-lg font-semibold">Центр управления</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm">
                Отменить
              </button>
              <button type="button" className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm">
                Повторить
              </button>
            </div>
            <button type="button" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              <Sparkles className="h-4 w-4" />
              Улучшить текст ИИ
            </button>
          </article>
        </aside>
      </section>
    </div>
  );
}
