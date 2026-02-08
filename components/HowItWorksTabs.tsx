"use client";

import { useState } from "react";

import { Container } from "@/components/Container";

const studentSteps = [
  {
    title: "Выбор предмета и цели",
    description: "Определите задачу: школьная программа, экзамен, разговорный язык или профессиональный рост."
  },
  {
    title: "Подбор преподавателя и времени",
    description: "Система подскажет подходящих специалистов по цене, рейтингу и доступности."
  },
  {
    title: "Бронирование и оплата",
    description: "Забронируйте урок в пару кликов и оплатите безопасно внутри платформы."
  },
  {
    title: "Урок в онлайн-классе + конспект/домашка",
    description: "Занимайтесь в браузере: доска, чат, задания и автоконспект после каждого занятия."
  }
];

const tutorSteps = [
  {
    title: "Заявка и профиль",
    description: "Заполните анкету, добавьте предметы, опыт и формат уроков."
  },
  {
    title: "Верификация и онбординг",
    description: "Проходите проверку, знакомитесь с инструментами платформы и стандартами качества."
  },
  {
    title: "Расписание и цены",
    description: "Гибко настраивайте график, стоимость и условия индивидуальных или групповых уроков."
  },
  {
    title: "Проведение занятий + аналитика",
    description: "Ведите уроки в онлайн-классе и отслеживайте прогресс учеников в аналитике кабинета."
  }
];

export function HowItWorksTabs() {
  const [role, setRole] = useState<"student" | "tutor">("student");
  const steps = role === "student" ? studentSteps : tutorSteps;

  return (
    <section id="how-it-works" className="scroll-mt-28 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Как это работает</p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">Простой процесс для ученика и преподавателя</h2>
        </div>

        <div className="mx-auto mt-8 grid w-full max-w-md grid-cols-2 rounded-full border border-border bg-white p-1.5 shadow-card">
          <button
            type="button"
            role="tab"
            aria-selected={role === "student"}
            onClick={() => setRole("student")}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              role === "student" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Ученик
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === "tutor"}
            onClick={() => setRole("tutor")}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              role === "tutor" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Преподаватель
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-3xl border border-border bg-white p-6 shadow-card">
              <p className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {index + 1}
              </p>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
