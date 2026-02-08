import Link from "next/link";

import { homeworkAssignmentTypeLabels, homeworkCheckModeLabels, HomeworkItem } from "@/data/homework";

import { PillBadge } from "@/components/shared/PillBadge";

const statusLabelMap: Record<HomeworkItem["status"], { label: string; variant: "warning" | "primary" | "neutral" | "success" }> = {
  new: { label: "Новое", variant: "warning" },
  in_progress: { label: "В работе", variant: "primary" },
  submitted: { label: "На проверке", variant: "neutral" },
  graded: { label: "Проверено", variant: "success" }
};

function formatDateLabel(dateValue: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short" }).format(new Date(dateValue));
}

type HomeworkPreviewProps = {
  items: HomeworkItem[];
};

export function HomeworkPreview({ items }: HomeworkPreviewProps) {
  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Домашние задания</h2>
          <p className="text-sm text-muted-foreground">Ближайшие дедлайны и статус выполнения</p>
        </div>
        <Link href="/app/homework" className="text-sm font-semibold text-primary hover:underline">
          Смотреть все
        </Link>
      </div>

      <ul className="mt-4 space-y-3">
        {items.map((item) => {
          const status = statusLabelMap[item.status];

          return (
            <li key={item.id} className="rounded-2xl border border-border bg-slate-50 p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.subject}</p>
                </div>
                <PillBadge variant={status.variant}>{status.label}</PillBadge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {homeworkAssignmentTypeLabels[item.assignmentType]} • {homeworkCheckModeLabels[item.checkMode]}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Сдать до: {formatDateLabel(item.dueDate)}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
