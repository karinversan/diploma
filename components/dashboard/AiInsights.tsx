import Link from "next/link";
import { Sparkles } from "lucide-react";

type AiInsightsProps = {
  summary: string;
  frequentMistakes: string[];
  recommendedTasks: string[];
  lessonId: string;
};

export function AiInsights({ summary, frequentMistakes, recommendedTasks, lessonId }: AiInsightsProps) {
  return (
    <section className="rounded-3xl border border-primary/20 bg-[linear-gradient(135deg,rgba(116,76,255,0.08),rgba(185,250,119,0.18))] p-5 shadow-card sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            ИИ-помощник
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Конспект последнего урока и персональные рекомендации</p>
        </div>
      </div>

      <p className="mt-4 rounded-2xl border border-white/70 bg-white/80 p-3 text-sm text-foreground">{summary}</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/70 bg-white/80 p-3">
          <p className="text-sm font-semibold text-foreground">Частые ошибки</p>
          <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
            {frequentMistakes.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/70 bg-white/80 p-3">
          <p className="text-sm font-semibold text-foreground">Рекомендуем дальше</p>
          <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
            {recommendedTasks.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <Link
        href={`/app/lessons/${lessonId}`}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Открыть конспект
      </Link>
    </section>
  );
}
