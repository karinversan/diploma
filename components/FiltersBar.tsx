"use client";

import { Search } from "lucide-react";

import { FilterSelect } from "@/components/ui/FilterSelect";

type SortOption = "popular" | "price-asc" | "price-desc" | "rating";

type FiltersBarProps = {
  search: string;
  subject: string;
  priceRange: string;
  rating: string;
  availableToday: boolean;
  sort: SortOption;
  subjects: string[];
  onSearchChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onPriceRangeChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  onAvailableTodayChange: (value: boolean) => void;
  onSortChange: (value: SortOption) => void;
  onReset: () => void;
};

const sortOptions = [
  { value: "popular", label: "Самые популярные" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
  { value: "rating", label: "По рейтингу" }
];

const priceOptions = [
  { value: "all", label: "Любая" },
  { value: "0-1500", label: "До 1500 ₽" },
  { value: "1500-2000", label: "1500–2000 ₽" },
  { value: "2000+", label: "От 2000 ₽" }
];

const ratingOptions = [
  { value: "all", label: "Любой" },
  { value: "4.5", label: "От 4.5" },
  { value: "4.8", label: "От 4.8" },
  { value: "4.9", label: "От 4.9" }
];

export function FiltersBar({
  search,
  subject,
  priceRange,
  rating,
  availableToday,
  sort,
  subjects,
  onSearchChange,
  onSubjectChange,
  onPriceRangeChange,
  onRatingChange,
  onAvailableTodayChange,
  onSortChange,
  onReset
}: FiltersBarProps) {
  return (
    <section aria-label="Фильтры преподавателей" className="rounded-3xl border border-border bg-white p-5 shadow-card">
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">Поиск по имени</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              type="text"
              placeholder="Например, Наталья"
              className="w-full rounded-2xl border border-border bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-primary focus:bg-white"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">Сортировка</span>
          <FilterSelect
            value={sort}
            onValueChange={(value) => onSortChange(value as SortOption)}
            options={sortOptions}
            ariaLabel="Сортировка преподавателей"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">Предмет</span>
          <FilterSelect
            value={subject}
            onValueChange={onSubjectChange}
            options={subjects.map((item) => ({ value: item, label: item }))}
            ariaLabel="Фильтр по предмету"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">Цена</span>
          <FilterSelect
            value={priceRange}
            onValueChange={onPriceRangeChange}
            options={priceOptions}
            ariaLabel="Фильтр по цене"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">Рейтинг</span>
          <FilterSelect value={rating} onValueChange={onRatingChange} options={ratingOptions} ariaLabel="Фильтр по рейтингу" />
        </label>

        <div className="flex items-end gap-2">
          <label className="inline-flex h-11 w-full items-center gap-3 rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/30">
            <input
              checked={availableToday}
              onChange={(event) => onAvailableTodayChange(event.target.checked)}
              type="checkbox"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            Свободно сегодня
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-4 inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
      >
        Сбросить фильтры
      </button>
    </section>
  );
}
