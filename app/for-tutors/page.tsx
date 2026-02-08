import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const tutorBenefits = [
  {
    title: "Регулярный поток заявок",
    description: "Профиль попадает в каталог и рекомендации, а ученики находят вас по уровню, цене и отзывам."
  },
  {
    title: "Онлайн-класс без техподдержки с вашей стороны",
    description: "Видео, доска, файлы и чат уже встроены. Не нужно настраивать внешние сервисы для урока."
  },
  {
    title: "ИИ-инструменты после урока",
    description: "Конспект, подсветка ошибок и подсказки по домашним заданиям экономят время на рутине."
  },
  {
    title: "Управляемая загрузка",
    description: "Вы сами задаете расписание, длительность уроков и стоимость, чтобы держать комфортный темп."
  }
];

const requirements = [
  "Опыт преподавания от 1 года или профильное образование",
  "Понимание методики онлайн-урока и работа с обратной связью",
  "Готовность вести профиль и обновлять расписание",
  "Стабильный интернет и базовое оборудование для видеозанятий"
];

const onboardingSteps = [
  {
    title: "Заявка и первичная анкета",
    description: "Заполняете профиль: предметы, опыт, стоимость, формат занятий."
  },
  {
    title: "Верификация и вводный созвон",
    description: "Проверяем данные, знакомим с правилами качества и работой платформы."
  },
  {
    title: "Публикация профиля",
    description: "Помогаем упаковать оффер и запускаем вас в каталог с рекомендациями."
  },
  {
    title: "Первые ученики и аналитика",
    description: "Отслеживаете конверсии, удержание и качество уроков в личном кабинете."
  }
];

const tutorFaq = [
  {
    question: "Когда можно начать проводить уроки после заявки?",
    answer: "Обычно подключение занимает 2–5 рабочих дней в зависимости от полноты анкеты и верификации."
  },
  {
    question: "Кто устанавливает стоимость занятий?",
    answer: "Стоимость определяете вы. Платформа показывает рыночный диапазон, чтобы быстрее находить учеников."
  },
  {
    question: "Можно ли совмещать с основной работой?",
    answer: "Да, график полностью гибкий: вы открываете только те слоты, которые удобны именно вам."
  },
  {
    question: "Есть ли поддержка по методике и продукту?",
    answer: "Да, доступны материалы онбординга, база практик и поддержка команды по техническим вопросам."
  }
];

const tutorNav = [
  { href: "#offer", label: "Предложение" },
  { href: "#income", label: "Доход" },
  { href: "#requirements", label: "Требования" },
  { href: "#process", label: "Этапы" },
  { href: "#tutor-faq", label: "Вопросы" }
];

export default function ForTutorsPage() {
  return (
    <>
      <Header
        showSectionLinks={false}
        navItems={tutorNav}
        navLabel="Навигация для преподавателей"
        secondaryAction={{ label: "Войти", href: "/login" }}
        primaryAction={{ label: "Подать заявку", href: "/lead?role=tutor" }}
      />

      <main className="pb-16 pt-28 sm:pt-32">
        <section id="offer" className="mx-auto w-full max-w-7xl scroll-mt-28 px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-hero-gradient p-8 shadow-soft sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Для преподавателей</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              Подключайтесь к платформе, где уроки вести проще, а доход прогнозируемее
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Мы берем на себя технологическую часть и помогаем расти за счет качественного профиля, рекомендаций и аналитики.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <article className="rounded-2xl border border-white/70 bg-white/85 p-4">
                <p className="text-2xl font-semibold text-foreground">1200+</p>
                <p className="mt-1 text-xs text-muted-foreground">уроков проводится на платформе ежемесячно</p>
              </article>
              <article className="rounded-2xl border border-white/70 bg-white/85 p-4">
                <p className="text-2xl font-semibold text-foreground">4.8/5</p>
                <p className="mt-1 text-xs text-muted-foreground">средняя оценка преподавателей от учеников</p>
              </article>
              <article className="rounded-2xl border border-white/70 bg-white/85 p-4">
                <p className="text-2xl font-semibold text-foreground">2–5 дней</p>
                <p className="mt-1 text-xs text-muted-foreground">средний срок от заявки до первых уроков</p>
              </article>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/lead?role=tutor"
                className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Подать заявку
              </Link>
              <Link
                href="#requirements"
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-7 py-3 text-base font-semibold text-foreground transition hover:border-primary"
              >
                Посмотреть требования
              </Link>
            </div>
          </div>
        </section>

        <section id="income" className="mx-auto mt-10 w-full max-w-7xl scroll-mt-28 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
            <article className="rounded-3xl border border-border bg-white p-6 shadow-card sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Доход</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">Понятная экономика без скрытых условий</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Вы задаете свою стоимость и доступные часы. Платформа показывает аналитику по загрузке, конверсии профиля и
                удержанию учеников, чтобы вы могли увеличивать доход осознанно.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Сценарий 1</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">8 уроков/неделя</p>
                  <p className="mt-1 text-xs text-muted-foreground">для плавного старта</p>
                </div>
                <div className="rounded-2xl bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Сценарий 2</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">14 уроков/неделя</p>
                  <p className="mt-1 text-xs text-muted-foreground">стабильная частичная занятость</p>
                </div>
                <div className="rounded-2xl bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Сценарий 3</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">20+ уроков/неделя</p>
                  <p className="mt-1 text-xs text-muted-foreground">интенсивный график</p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-primary/20 bg-primary/5 p-6 shadow-card sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Что получаете сразу</p>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                  <span>Шаблон профиля с подсказками, чтобы быстрее пройти модерацию.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                  <span>Онлайн-класс для уроков без сторонних подписок и переключений.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                  <span>Поддержка по запуску: первые ученики, расписание, качество уроков.</span>
                </li>
              </ul>
              <Link
                href="/lead?role=tutor"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
              >
                Отправить заявку
              </Link>
            </article>
          </div>
        </section>

        <section className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Преимущества платформы">
          <div className="grid gap-4 md:grid-cols-2">
            {tutorBenefits.map((benefit) => (
              <article key={benefit.title} className="rounded-3xl border border-border bg-white p-6 shadow-card">
                <h2 className="text-xl font-semibold text-foreground">{benefit.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="requirements" className="mx-auto mt-10 w-full max-w-7xl scroll-mt-28 px-4 sm:px-6 lg:px-8">
          <article className="rounded-3xl border border-border bg-white p-6 shadow-card sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Требования</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">Кому подходит платформа</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {requirements.map((item) => (
                <li key={item} className="rounded-2xl border border-border bg-slate-50 p-4 text-sm text-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section id="process" className="mx-auto mt-10 w-full max-w-7xl scroll-mt-28 px-4 sm:px-6 lg:px-8">
          <article className="rounded-3xl border border-border bg-white p-6 shadow-card sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Этапы подключения</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">Как проходит путь до первых уроков</h2>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {onboardingSteps.map((step, index) => (
                <li key={step.title} className="rounded-2xl border border-border bg-slate-50 p-4 text-sm text-foreground">
                  <span className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <p className="font-semibold">{step.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                </li>
              ))}
            </ol>
          </article>
        </section>

        <section id="tutor-faq" className="mx-auto mt-10 w-full max-w-7xl scroll-mt-28 px-4 sm:px-6 lg:px-8">
          <article className="rounded-3xl border border-border bg-white p-6 shadow-card sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Вопросы для преподавателей</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">Частые вопросы по подключению и работе</h2>
            <div className="mt-5 space-y-3">
              {tutorFaq.map((item) => (
                <details key={item.question} className="group rounded-2xl border border-border bg-slate-50 p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-foreground">
                    <span>{item.question}</span>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-muted-foreground transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                </details>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/lead?role=tutor"
                className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground"
              >
                Подать заявку
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3 text-sm font-semibold text-foreground"
              >
                Войти в кабинет
              </Link>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </>
  );
}
