import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
  className?: string;
};

export function StatCard({ label, value, hint, icon, className }: StatCardProps) {
  return (
    <article className={cn("rounded-3xl border border-border bg-white p-5 shadow-card", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
          {hint ? <p className="mt-1 text-xs font-medium text-muted-foreground">{hint}</p> : null}
        </div>
        {icon ? <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">{icon}</div> : null}
      </div>
    </article>
  );
}
