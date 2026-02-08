import Link from "next/link";

import { Container } from "@/components/Container";

export function FinalCTA() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,#6d43f6,#8f6cff_55%,#b9fa77)] p-8 text-white shadow-soft sm:p-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Готовы начать?</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Начать обучение с сильным преподавателем уже сегодня</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/teachers"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white/90"
              >
                Начать обучение
              </Link>
              <Link
                href="/signup?role=tutor"
                className="inline-flex items-center justify-center rounded-full border border-white/80 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Стать преподавателем
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
