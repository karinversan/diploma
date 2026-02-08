import { Container } from "@/components/Container";

const trustItems = [
  {
    title: "Верификация преподавателей",
    description: "Проверяем профиль, опыт и документы перед публикацией в каталоге."
  },
  {
    title: "Безопасность платежей",
    description: "Платежная инфраструктура с защитой транзакций и прозрачной историей."
  },
  {
    title: "Приватность данных",
    description: "Личные данные и учебные материалы защищены и не передаются третьим лицам."
  },
  {
    title: "Правила записи уроков",
    description: "Запись уроков только с согласия сторон и с понятными правилами хранения."
  }
];

export function TrustSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Безопасность и доверие</p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">Безопасность и доверие на каждом уроке</h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {trustItems.map((item) => (
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
