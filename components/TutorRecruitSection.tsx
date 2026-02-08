import Link from "next/link";

import { Container } from "@/components/Container";

const benefits = [
  "Гибкий график и управление загрузкой",
  "Готовый онлайн-класс для уроков в браузере",
  "Поток учеников из каталога платформы",
  "ИИ-инструменты для проверки и конспектов",
  "Прозрачные выплаты и аналитика дохода"
];

export function TutorRecruitSection() {
  return (
    <section id="for-tutors" className="scroll-mt-28 py-16 sm:py-20">
      <Container>
        <div className="rounded-[2rem] border border-primary/20 bg-hero-gradient p-8 shadow-soft sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Для преподавателей</p>
              <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
                Развивайте частную практику в удобном цифровом классе
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Платформа берет на себя инфраструктуру и помогает фокусироваться на качестве уроков.
              </p>
              <Link
                href="/signup?role=tutor"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Подать заявку
              </Link>
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
