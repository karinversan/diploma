import { metrics } from "@/data/metrics";

import { Container } from "@/components/Container";

export function MetricsRow() {
  return (
    <section aria-label="Ключевые показатели" className="pb-16">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <article key={metric.id} className="rounded-3xl border border-border bg-white p-6 shadow-card">
              <p className="text-3xl font-semibold text-foreground">{metric.value}</p>
              <p className="mt-1 text-lg font-medium text-foreground">{metric.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{metric.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
