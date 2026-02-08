import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  className?: string;
  indicatorClassName?: string;
  ariaLabel?: string;
};

export function ProgressBar({ value, className, indicatorClassName, ariaLabel }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn("h-2.5 w-full overflow-hidden rounded-full bg-slate-100", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clampedValue)}
      aria-label={ariaLabel ?? "Прогресс"}
    >
      <div
        className={cn("h-full rounded-full bg-primary transition-[width] duration-300", indicatorClassName)}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
