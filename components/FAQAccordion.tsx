"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Container } from "@/components/Container";

type FaqCategory = "students" | "tutors" | "payments";

type FaqItem = {
  question: string;
  answer: string;
};

const faqByCategory: Record<FaqCategory, FaqItem[]> = {
  students: [
    {
      question: "Нужно ли устанавливать программу для уроков?",
      answer: "Нет, занятия проходят прямо в браузере: видеосвязь, чат, доска и файлы доступны в одном окне."
    },
    {
      question: "Можно ли сменить преподавателя, если формат не подошел?",
      answer: "Да, вы можете выбрать другого преподавателя в каталоге и продолжить обучение без потери материалов и истории уроков."
    },
    {
      question: "Что ученик получает после урока?",
      answer: "Автоконспект, домашнее задание, список типичных ошибок и рекомендации по следующей теме."
    }
  ],
  tutors: [
    {
      question: "Как преподавателю начать работу на платформе?",
      answer: "Заполните заявку, пройдите верификацию и короткий онбординг. После этого профиль публикуется в каталоге."
    },
    {
      question: "Какие инструменты доступны на уроке?",
      answer: "Онлайн-класс включает видеосвязь, интерактивную доску, чат, обмен файлами и автоматический конспект урока."
    },
    {
      question: "Можно ли гибко управлять расписанием и ценой?",
      answer: "Да, преподаватель самостоятельно задает доступные слоты, длительность уроков и стоимость в личном кабинете."
    }
  ],
  payments: [
    {
      question: "Как оплачиваются уроки?",
      answer: "Оплата проходит безопасно внутри платформы. Доступны разовые уроки, пакеты и ежемесячные планы."
    },
    {
      question: "Безопасно ли хранить личные данные?",
      answer: "Платформа использует защищенные каналы передачи и не передает персональные данные третьим лицам без оснований."
    },
    {
      question: "Можно ли записывать уроки?",
      answer: "Запись включается только при согласии обеих сторон и хранится по правилам приватности платформы."
    }
  ]
};

const categoryMeta: Record<FaqCategory, { title: string; description: string }> = {
  students: {
    title: "Для учеников",
    description: "О формате занятий, подборе преподавателя и учебных материалах"
  },
  tutors: {
    title: "Для преподавателей",
    description: "О подключении, инструментах урока и управлении нагрузкой"
  },
  payments: {
    title: "Платежи и безопасность",
    description: "О способах оплаты, приватности и правилах записи уроков"
  }
};

export function FAQAccordion() {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("students");
  const [openedQuestionIndex, setOpenedQuestionIndex] = useState(0);

  const activeItems = useMemo(() => faqByCategory[activeCategory], [activeCategory]);
  const helpCta =
    activeCategory === "tutors"
      ? { href: "/lead?role=tutor", label: "Оставить заявку преподавателя" }
      : { href: "/lead?role=student", label: "Оставить заявку ученика" };

  const handleCategoryChange = (category: FaqCategory) => {
    setActiveCategory(category);
    setOpenedQuestionIndex(0);
  };

  return (
    <section id="faq" className="scroll-mt-28 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Вопросы и ответы</p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">Ответы по сценариям: ученик, преподаватель, безопасность</h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[320px,1fr] lg:items-start">
          <aside className="rounded-3xl border border-border bg-white p-5 shadow-card lg:sticky lg:top-28">
            <p className="text-sm font-semibold text-foreground">Выберите тему</p>
            <p className="mt-2 text-sm text-muted-foreground">Так проще найти ответ без длинного скролла по всем вопросам сразу.</p>

            <div className="mt-4 grid gap-2">
              {(Object.keys(categoryMeta) as FaqCategory[]).map((category) => {
                const meta = categoryMeta[category];
                const isActive = activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      isActive ? "border-primary/40 bg-primary/5" : "border-border bg-slate-50 hover:border-primary/30"
                    }`}
                  >
                    <p className="text-sm font-semibold text-foreground">{meta.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{meta.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-2xl border border-accent/60 bg-accent/30 p-4">
              <p className="text-sm font-semibold text-slate-900">Не нашли ответ?</p>
              <p className="mt-1 text-xs text-slate-700">Оставьте заявку, и мы поможем подобрать формат в течение дня.</p>
              <Link
                href={helpCta.href}
                className="mt-3 inline-flex rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
              >
                {helpCta.label}
              </Link>
            </div>
          </aside>

          <div className="space-y-3">
            {activeItems.map((item, index) => {
              const isOpen = openedQuestionIndex === index;
              const contentId = `${activeCategory}-faq-${index}`;

              return (
                <article key={item.question} className="rounded-2xl border border-border bg-white shadow-card">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={contentId}
                      onClick={() => setOpenedQuestionIndex((prev) => (prev === index ? -1 : index))}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-base font-semibold text-foreground">{item.question}</span>
                      <span
                        className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      >
                        +
                      </span>
                    </button>
                  </h3>
                  <div id={contentId} className={`grid transition-all ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
