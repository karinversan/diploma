import { Container } from "@/components/Container";

const afterLessonItems = [
  {
    title: "Запись урока (опционально)",
    description: "Повторяйте сложные моменты и возвращайтесь к материалу в удобное время."
  },
  {
    title: "Конспект",
    description: "Автоматический структурированный итог урока с ключевыми тезисами."
  },
  {
    title: "Список новых слов и ошибок",
    description: "Фиксация типичных ошибок и персональные подсказки по исправлению."
  },
  {
    title: "Домашнее задание",
    description: "Задачи по уровню ученика с рекомендациями по следующему уроку."
  }
];

export function AfterLessonSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">После урока</p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">Полезные материалы остаются с учеником</h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {afterLessonItems.map((item) => (
            <article key={item.title} className="rounded-3xl border border-border bg-white p-6 shadow-card">
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
