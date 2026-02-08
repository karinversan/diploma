import { BookOpen, Clock3, GraduationCap, TrendingUp } from "lucide-react";

import { AnalyticsMetric } from "@/data/analytics";

import { StatCard } from "@/components/shared/StatCard";

const metricIcons = {
  courses: <BookOpen className="h-4 w-4" />,
  hours: <Clock3 className="h-4 w-4" />,
  lessons: <GraduationCap className="h-4 w-4" />,
  progress: <TrendingUp className="h-4 w-4" />
};

type KpiCardsProps = {
  metrics: AnalyticsMetric[];
};

export function KpiCards({ metrics }: KpiCardsProps) {
  return (
    <section aria-label="Ключевые показатели" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <StatCard
          key={metric.id}
          label={metric.label}
          value={metric.value}
          hint={metric.delta}
          icon={metricIcons[metric.id as keyof typeof metricIcons]}
        />
      ))}
    </section>
  );
}
