import { Star } from "lucide-react";

import { Teacher } from "@/data/teachers";

type ReviewsSummaryProps = {
  rating: number;
  reviewsCount: number;
  ratingBreakdown: Teacher["ratingBreakdown"];
};

const labels: Array<{ key: keyof Teacher["ratingBreakdown"]; label: string }> = [
  { key: "qualification", label: "Квалификация" },
  { key: "expertise", label: "Экспертность" },
  { key: "communication", label: "Коммуникация" },
  { key: "value", label: "Соотношение цена/результат" }
];

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => {
    const filled = index < Math.round(rating);

    return (
      <Star
        key={`star-${index}`}
        className={`h-4 w-4 ${filled ? "fill-amber-400 text-amber-500" : "text-slate-300"}`}
        aria-hidden="true"
      />
    );
  });
}

export function ReviewsSummary({ rating, reviewsCount, ratingBreakdown }: ReviewsSummaryProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-5 shadow-card" aria-label="Сводка отзывов">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-3xl font-semibold text-foreground">{rating.toFixed(1)}</p>
          <p className="mt-1 inline-flex items-center gap-1">{renderStars(rating)}</p>
          <p className="mt-1 text-sm text-muted-foreground">на основе {reviewsCount} отзывов</p>
        </div>

        <div className="min-w-[220px] flex-1 space-y-2">
          {labels.map(({ key, label }) => {
            const value = ratingBreakdown[key];
            const width = `${(value / 5) * 100}%`;

            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{label}</span>
                  <span>{value.toFixed(1)}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-primary" style={{ width }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
