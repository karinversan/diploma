"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Container } from "@/components/Container";

const classroomFeatures = [
  {
    title: "Видеосвязь в браузере (WebRTC)",
    description: "Стабильный звук и видео без установки приложений.",
    icon: "В"
  },
  {
    title: "Чат + файлы",
    description: "Передавайте материалы прямо во время урока.",
    icon: "Ч"
  },
  {
    title: "Интерактивная доска",
    description: "Рисуйте схемы, решайте задачи и сохраняйте результат.",
    icon: "Д"
  },
  {
    title: "Демонстрация экрана",
    description: "Показывайте презентации, код и задания в один клик.",
    icon: "Э"
  },
  {
    title: "История уроков",
    description: "Все заметки и материалы доступны после занятия.",
    icon: "И"
  }
];

export function ClassroomSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isDialogOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDialogOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.removeProperty("overflow");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isDialogOpen]);

  return (
    <section id="online-class" className="scroll-mt-28 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Онлайн-класс</p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">Онлайн-класс — это больше чем созвон</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Урок проходит в едином пространстве: видео, доска, чат, материалы и история занятий.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {classroomFeatures.map((feature) => (
            <article key={feature.title} className="rounded-3xl border border-border bg-white p-5 shadow-card">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                {feature.icon}
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-base font-semibold text-primary-foreground shadow-soft transition hover:opacity-90"
          >
            Посмотреть демо 60 секунд
          </button>
        </div>
      </Container>

      {isDialogOpen ? (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/70 p-4" role="dialog" aria-modal="true" aria-label="Демо онлайн-класса">
          <div className="w-full max-w-4xl rounded-3xl bg-white p-4 shadow-soft sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Демо онлайн-класса (60 секунд)</h3>
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium"
              >
                Закрыть
              </button>
            </div>
            <div className="rounded-2xl border border-border bg-slate-50 p-3">
              <Image
                src="/classroom-preview.svg"
                alt="Демо интерфейса онлайн-класса"
                width={1200}
                height={760}
                className="h-auto w-full rounded-xl"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
