import { cn } from "@/lib/utils";

type PillBadgeVariant = "primary" | "accent" | "success" | "warning" | "neutral";

type PillBadgeProps = {
  children: React.ReactNode;
  variant?: PillBadgeVariant;
  className?: string;
};

const variantClasses: Record<PillBadgeVariant, string> = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/60 text-slate-900",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  neutral: "bg-slate-100 text-slate-700"
};

export function PillBadge({ children, variant = "neutral", className }: PillBadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", variantClasses[variant], className)}>
      {children}
    </span>
  );
}
