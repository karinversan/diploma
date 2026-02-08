"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export type FilterOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: FilterOption[];
  ariaLabel: string;
  placeholder?: string;
  className?: string;
};

export function FilterSelect({
  value,
  onValueChange,
  options,
  ariaLabel,
  placeholder,
  className
}: FilterSelectProps) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        aria-label={ariaLabel}
        className={cn(
          "inline-flex h-11 w-full items-center justify-between rounded-2xl border border-border bg-slate-50 px-4 text-sm text-foreground outline-none transition data-[placeholder]:text-muted-foreground hover:border-primary/35 focus:border-primary focus:bg-white",
          className
        )}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="text-muted-foreground">
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={8}
          className="z-[80] max-h-80 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-border bg-white shadow-soft"
        >
          <Select.Viewport className="p-1.5">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="relative flex cursor-pointer select-none items-center rounded-xl py-2.5 pl-8 pr-8 text-sm text-foreground outline-none transition data-[highlighted]:bg-primary/10"
              >
                <Select.ItemIndicator className="absolute left-2.5 inline-flex items-center text-primary">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </Select.ItemIndicator>
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
