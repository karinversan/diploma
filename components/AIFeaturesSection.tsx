import { Container } from "@/components/Container";

const aiFeatures = [
  {
    title: "Субтитры в реальном времени (распознавание речи)",
    description: "ИИ фиксирует ключевые фразы и превращает речь в структурированный текст прямо во время урока."
  },
  {
    title: "Перевод + словарь",
    description: "Подсказки перевода и контекста новых слов помогают быстрее закреплять материал."
  },
  {
    title: "Проверка и объяснение ответов",
    description: "Система указывает на ошибки и предлагает понятное объяснение шаг за шагом."
  },
  {
    title: "Автоконспект урока",
    description: "После урока ученик получает краткий конспект, выделенные темы и ключевые задания."
  },
  {
    title: "Рекомендации заданий (персонализация)",
    description: "ИИ предлагает упражнения, которые лучше всего подходят под текущий уровень и цели."
  }
];

export function AIFeaturesSection() {
  return (
    <section id="ai-features" className="scroll-mt-28 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">ИИ-ассистент в уроке</p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">Ускоряет прогресс и снимает рутину</h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {aiFeatures.map((feature) => (
            <article key={feature.title} className="rounded-3xl border border-border bg-white p-6 shadow-card">
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-3xl rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 text-sm text-muted-foreground">
          ИИ помогает преподавателю и ученику, но не заменяет преподавателя.
        </p>
      </Container>
    </section>
  );
}
