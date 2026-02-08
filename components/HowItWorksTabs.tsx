"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Container } from "@/components/Container";

type Step = {
  title: string;
  description: string;
  outcome: string;
};

const studentSteps: Step[] = [
  {
    title: "Выбор предмета и цели",
    description: "Определите задачу: школьная программа, экзамен, язык для работы или рост в профессии.",
    outcome: "Результат: четкий план обучения и критерии подбора преподавателя."
  },
  {
    title: "Подбор преподавателя и времени",
    description: "Сравните анкеты по опыту, цене, рейтингу и свободным слотам на ближайшие дни.",
    outcome: "Результат: 3–5 подходящих кандидатов под ваш бюджет и график."
  },
  {
    title: "Бронирование и оплата",
    description: "Забронируйте урок в пару кликов: безопасная оплата и напоминания перед занятием.",
    outcome: "Результат: подтвержденный слот без лишней переписки."
  },
  {
    title: "Урок в онлайн-классе + конспект/домашка",
    description: "Видео, доска и чат в одном окне. После урока сразу доступны конспект и задания.",
    outcome: "Результат: непрерывный прогресс и понятные следующие шаги."
  }
];

const tutorSteps: Step[] = [
  {
    title: "Заявка и профиль",
    description: "Расскажите о предметах, опыте, подходе к обучению и предпочтительном формате уроков.",
    outcome: "Результат: продающая анкета, понятная для учеников."
  },
  {
    title: "Верификация и онбординг",
    description: "Проверяем профиль, проводим вводный онбординг и показываем инструменты платформы.",
    outcome: "Результат: быстрый старт без технической рутины."
  },
  {
    title: "Расписание и цены",
    description: "Гибко настраивайте стоимость, окно записи и длительность индивидуальных/групповых уроков.",
    outcome: "Результат: прозрачная экономика и управляемая загрузка."
  },
  {
    title: "Проведение занятий + аналитика",
    description: "Ведите уроки в браузере и анализируйте динамику учеников по срезам и рекомендациям.",
    outcome: "Результат: выше качество уроков и лояльность учеников."
  }
];

const studentBenefits = [
  "Пробный урок и понятный старт без обязательств на длительный период",
  "Подбор преподавателя под вашу цель, а не по случайным совпадениям",
  "Автоконспект и домашка после каждого занятия"
];

const tutorBenefits = [
  "Готовый онлайн-класс без установки сторонних программ",
  "Поток учеников из каталога и рекомендаций платформы",
  "Аналитика, которая помогает удерживать учеников дольше"
];

export function HowItWorksTabs() {
  const [role, setRole] = useState<"student" | "tutor">("student");

  const content = useMemo(
    () =>
      role === "student"
        ? {
            steps: studentSteps,
            title: "Почему ученикам удобно начинать именно так",
            benefits: studentBenefits,
            primaryCta: { label: "Пройти быстрый тест", href: "/assessment" },
            secondaryCta: { label: "Оставить заявку на консультацию", href: "/lead?role=student" }
          }
        : {
            steps: tutorSteps,
            title: "Почему преподавателям выгодно подключаться",
            benefits: tutorBenefits,
            primaryCta: { label: "Стать преподавателем", href: "/for-tutors" },
            secondaryCta: { label: "Оставить заявку на созвон", href: "/lead?role=tutor" }
          },
    [role]
  );

  return (
    <section id="how-it-works" className="scroll-mt-28 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Как это работает</p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">Понятная воронка с измеримым результатом на каждом шаге</h2>
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
          {content.steps.map((step, index) => (
            <article key={step.title} className="rounded-3xl border border-border bg-white p-6 shadow-card">
              <p className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {index + 1}
              </p>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              <p className="mt-3 rounded-xl bg-muted px-3 py-2 text-xs font-medium text-foreground">{step.outcome}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-primary/20 bg-white p-6 shadow-card sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <div>
              <h3 className="text-2xl font-semibold text-foreground">{content.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {content.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-3">
              <Link
                href={content.primaryCta.href}
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                {content.primaryCta.label}
              </Link>
              <Link
                href={content.secondaryCta.href}
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary"
              >
                {content.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
