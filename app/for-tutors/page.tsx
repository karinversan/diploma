import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const reasons = [
  {
    title: "Стабильный поток учеников",
    description: "Профиль преподавателя доступен в каталоге, где ученики находят вас по предмету и рейтингу."
  },
  {
    title: "Удобный онлайн-класс",
    description: "Проводите уроки в браузере: видео, доска, чат, материалы и задания в одном интерфейсе."
  },
  {
    title: "ИИ для рутины",
    description: "Конспект урока, анализ типичных ошибок и подсказки по следующим заданиям."
  },
  {
    title: "Прозрачные условия",
    description: "Контроль расписания, понятные выплаты и аналитика загрузки в личном кабинете."
  }
];

const steps = ["Заполните заявку", "Пройдите верификацию", "Настройте профиль и цены", "Начните проводить уроки"];

export default function ForTutorsPage() {
  return (
    <>
      <Header showSectionLinks={false} />
      <main className="pb-16 pt-28 sm:pt-32">
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-hero-gradient p-8 shadow-soft sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Для преподавателей</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              Преподавайте онлайн в современном AI-классе и масштабируйте частную практику
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Все инструменты для качественных уроков и роста дохода в одном интерфейсе.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup?role=tutor"
                className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Подать заявку
              </Link>
              <Link
                href="/teachers"
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-7 py-3 text-base font-semibold text-foreground transition hover:border-primary"
              >
                Посмотреть каталог учеников и спрос
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {reasons.map((reason) => (
              <article key={reason.title} className="rounded-3xl border border-border bg-white p-6 shadow-card">
                <h2 className="text-xl font-semibold text-foreground">{reason.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{reason.description}</p>
              </article>
            ))}
          </div>

          <section className="mt-10 rounded-3xl border border-border bg-white p-6 shadow-card sm:p-8" aria-label="Шаги подключения">
            <h2 className="text-2xl font-semibold text-foreground">Как начать преподавать</h2>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <li key={step} className="rounded-2xl border border-border bg-slate-50 p-4 text-sm text-foreground">
                  <span className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
