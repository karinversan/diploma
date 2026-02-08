import { Container } from "@/components/Container";

const faqItems = [
  {
    question: "Нужно ли устанавливать программу для уроков?",
    answer: "Нет, занятия проходят прямо в браузере: видеосвязь, чат, доска и файлы доступны в одном окне."
  },
  {
    question: "Как работает ИИ во время урока?",
    answer: "ИИ помогает с конспектом, подсказками и проверкой заданий. Финальные решения и объяснения остаются за преподавателем."
  },
  {
    question: "Можно ли сменить преподавателя, если не подошел формат?",
    answer: "Да, вы можете выбрать другого преподавателя в каталоге в любой момент и продолжить обучение без потери прогресса."
  },
  {
    question: "Как оплачиваются уроки?",
    answer: "Оплата проходит безопасно внутри платформы. Доступны разовые уроки и пакетные тарифы."
  },
  {
    question: "Есть ли пробный урок?",
    answer: "Да, для большинства направлений доступен ознакомительный урок со сниженной стоимостью."
  },
  {
    question: "Как преподавателю начать работу на платформе?",
    answer: "Заполните заявку, пройдите верификацию и онбординг. После этого можно принимать учеников и проводить уроки."
  },
  {
    question: "Можно ли записывать уроки?",
    answer: "Запись доступна опционально и включается только с согласия обеих сторон."
  },
  {
    question: "Что получает ученик после урока?",
    answer: "Конспект, список новых слов/ошибок, домашнее задание и рекомендации по следующим шагам."
  }
];

export function FAQAccordion() {
  return (
    <section id="faq" className="scroll-mt-28 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">Частые вопросы</h2>
        </div>

        <div className="mx-auto mt-8 max-w-4xl space-y-3">
          {faqItems.map((item) => (
            <details key={item.question} className="group rounded-2xl border border-border bg-white p-5 shadow-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-foreground">
                <span>{item.question}</span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
