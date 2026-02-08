"use client";

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
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            type="text"
            placeholder="Например, Наталья"
            className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">Сортировка</span>
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
          >
            <option value="popular">Самые популярные</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
            <option value="rating">По рейтингу</option>
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">Предмет</span>
          <select
            value={subject}
            onChange={(event) => onSubjectChange(event.target.value)}
            className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
          >
            {subjects.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">Цена</span>
          <select
            value={priceRange}
            onChange={(event) => onPriceRangeChange(event.target.value)}
            className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
          >
            <option value="all">Любая</option>
            <option value="0-1500">До 1500 ₽</option>
            <option value="1500-2000">1500–2000 ₽</option>
            <option value="2000+">От 2000 ₽</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">Рейтинг</span>
          <select
            value={rating}
            onChange={(event) => onRatingChange(event.target.value)}
            className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
          >
            <option value="all">Любой</option>
            <option value="4.5">От 4.5</option>
            <option value="4.8">От 4.8</option>
            <option value="4.9">От 4.9</option>
          </select>
        </label>

        <div className="flex items-end gap-2">
          <label className="inline-flex w-full items-center gap-3 rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm font-medium text-foreground">
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
        className="mt-4 inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        Сбросить фильтры
      </button>
    </section>
  );
}
