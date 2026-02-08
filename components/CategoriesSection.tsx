import Link from "next/link";

import { categories } from "@/data/teachers";

import { Container } from "@/components/Container";

const categoryDescriptions: Record<(typeof categories)[number], string> = {
  Дети: "Игровой формат, мягкая адаптация и развитие базовых навыков.",
  Подростки: "Подготовка к ОГЭ/ЕГЭ, экзаменам и олимпиадам.",
  Студенты: "Сложные дисциплины, язык для учебы и профессии.",
  Взрослые: "Навыки для работы, карьеры, путешествий и жизни."
};

export function CategoriesSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Форматы обучения</p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">Подберем преподавателя под ваш возраст и цель</h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/teachers?category=${encodeURIComponent(category)}`}
              className="group rounded-3xl border border-border bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-primary/40"
            >
              <p className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-900">
                {category}
              </p>
              <h3 className="mt-4 text-xl font-semibold text-foreground">{category}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{categoryDescriptions[category]}</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">Смотреть преподавателей</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
