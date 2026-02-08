import Link from "next/link";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

export function EmptyState({ title, description, actionLabel, actionHref, className }: EmptyStateProps) {
  return (
    <section className={cn("rounded-3xl border border-border bg-white p-8 text-center shadow-card", className)}>
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          {actionLabel}
        </Link>
      ) : null}
    </section>
  );
}
