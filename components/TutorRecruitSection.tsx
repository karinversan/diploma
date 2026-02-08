import Link from "next/link";

import { Container } from "@/components/Container";

const benefits = [
  "Гибкий график и управление загрузкой",
  "Готовый онлайн-класс для уроков в браузере",
  "Поток учеников из каталога платформы",
  "ИИ-инструменты для проверки и конспектов",
  "Прозрачные выплаты и аналитика дохода"
];

const steps = ["Заявка и анкета", "Верификация и онбординг", "Первые ученики и рост рейтинга"];

export function TutorRecruitSection() {
  return (
    <section id="for-tutors" className="scroll-mt-28 py-16 sm:py-20">
      <Container>
        <div className="rounded-[2rem] border border-primary/20 bg-hero-gradient p-8 shadow-soft sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Для преподавателей</p>
              <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
                Развивайте частную практику в цифровом классе с предсказуемой воронкой учеников
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Платформа берет на себя инфраструктуру урока и дает инструменты, которые помогают масштабироваться без
                потери качества.
              </p>

              <ol className="mt-5 grid gap-2 sm:grid-cols-3">
                {steps.map((step, index) => (
                  <li key={step} className="rounded-2xl border border-white/70 bg-white/80 px-3 py-2 text-xs font-medium text-foreground">
                    <span className="mr-1.5 text-primary">{index + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/lead?role=tutor"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Оставить заявку
                </Link>
                <Link
                  href="/for-tutors"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-white px-7 py-3 text-base font-semibold text-foreground transition hover:border-primary"
                >
                  Узнать условия подробно
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/80 bg-white/90 p-6">
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-sm text-foreground">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-slate-900">
                      ✓
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
