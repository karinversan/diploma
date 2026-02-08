import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/Container";

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pb-20 pt-32 sm:pb-24 sm:pt-36">
      <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-16 top-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl" aria-hidden="true" />

      <Container className="relative grid items-center gap-12 lg:grid-cols-[1fr,1.05fr]">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            Образовательная платформа нового поколения
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Онлайн-занятия с репетитором + ИИ-помощник прямо в уроке
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Видеосвязь, совместная доска, тесты, автоматический конспект и рекомендации.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/teachers"
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-base font-semibold text-primary-foreground shadow-soft transition hover:opacity-90"
            >
              Найти репетитора
            </Link>
            <Link
              href="/for-tutors"
              className="inline-flex items-center justify-center rounded-full border border-border bg-white px-7 py-3 text-base font-semibold text-foreground transition hover:border-primary hover:text-primary"
            >
              Стать преподавателем
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm font-medium text-muted-foreground">
            <span className="rounded-full border border-border bg-white px-4 py-2">Без установки приложений</span>
            <span className="rounded-full border border-border bg-white px-4 py-2">Уроки в браузере</span>
            <span className="rounded-full border border-border bg-white px-4 py-2">ИИ-конспект за 1 минуту</span>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-white/70 bg-white p-3 shadow-soft sm:p-5">
            <Image
              src="/classroom-preview.svg"
              alt="Превью онлайн-класса"
              width={1200}
              height={760}
              priority
              className="h-auto w-full rounded-[1.4rem]"
            />
          </div>

          <div className="absolute -bottom-6 -left-4 rounded-2xl border border-primary/20 bg-white px-5 py-4 shadow-card sm:-left-8">
            <p className="text-3xl font-semibold text-foreground">489+</p>
            <p className="text-sm font-medium text-muted-foreground">учеников обучено</p>
          </div>

          <div className="absolute -right-3 -top-4 hidden rounded-2xl border border-accent/40 bg-accent px-4 py-2 text-sm font-semibold text-slate-900 shadow-card sm:block">
            ИИ-ассистент активен
          </div>
        </div>
      </Container>
    </section>
  );
}
