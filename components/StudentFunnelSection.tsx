import Link from "next/link";

import { Container } from "@/components/Container";

const funnelCards = [
  {
    title: "Диагностика цели",
    description: "Понимаем текущий уровень, дедлайны и результат, который вам нужен.",
    point: "1–2 минуты"
  },
  {
    title: "Подбор преподавателя",
    description: "Система показывает релевантных кандидатов по предмету, цене и графику.",
    point: "3–5 анкет"
  },
  {
    title: "Пробный урок и план",
    description: "После первого занятия вы получаете прозрачный план прогресса на 4 недели.",
    point: "уже в первый день"
  }
];

export function StudentFunnelSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-card sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Воронка для ученика</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">От цели до первого сильного урока за один вечер</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Мы сделали процесс предсказуемым: вы сразу понимаете, что получаете, сколько это стоит и какой результат можно
              ждать в ближайшие недели.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {funnelCards.map((card) => (
                <article key={card.title} className="rounded-2xl border border-border bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">{card.point}</p>
                  <h3 className="mt-2 text-base font-semibold text-foreground">{card.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{card.description}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-primary/20 bg-primary/5 p-6 shadow-card sm:p-8">
            <h3 className="text-2xl font-semibold text-foreground">Что вы получите до оплаты пакета</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                <span>Рекомендованный список преподавателей под ваш запрос.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                <span>Прозрачную вилку стоимости и доступных слотов на неделю.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                <span>Понимание формата урока и учебного плана на старте.</span>
              </li>
            </ul>

            <div className="mt-6 grid gap-3">
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
              >
                Пройти предварительное тестирование
              </Link>
              <Link
                href="/lead?role=student"
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground"
              >
                Оставить заявку на звонок
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
