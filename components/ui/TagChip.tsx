import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type TagChipProps = {
  children: ReactNode;
  variant?: "neutral" | "primary" | "accent";
  className?: string;
};

export function TagChip({ children, variant = "neutral", className }: TagChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variant === "neutral" && "border border-border bg-slate-50 text-muted-foreground",
        variant === "primary" && "border border-primary/25 bg-primary/10 text-primary",
        variant === "accent" && "border border-accent/60 bg-accent/40 text-slate-900",
        className
      )}
    >
      {children}
    </span>
  );
}
