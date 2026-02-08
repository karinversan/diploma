import { CourseAccessType, CourseFormat, CourseLevel } from "@/data/courses";
import { CourseFilters } from "@/hooks/useCourseFilters";

import { ProgressBar } from "@/components/shared/ProgressBar";

type FiltersSidebarProps = {
  filters: CourseFilters;
  onToggleLevel: (level: CourseLevel) => void;
  onToggleFormat: (format: CourseFormat) => void;
  onToggleAccessType: (type: CourseAccessType) => void;
  onDurationChange: (value: number) => void;
  onCertificateOnlyChange: (value: boolean) => void;
  onApply: () => void;
  onReset: () => void;
};

const levels: CourseLevel[] = ["Начинающий", "Средний", "Продвинутый", "Эксперт"];
const formats: CourseFormat[] = ["Видеоуроки", "Вебинары/живые занятия", "Интерактивные занятия", "Практика"];
const accessTypes: CourseAccessType[] = ["По запросу", "По расписанию"];

export function FiltersSidebar({
  filters,
  onToggleLevel,
  onToggleFormat,
  onToggleAccessType,
  onDurationChange,
  onCertificateOnlyChange,
  onApply,
  onReset
}: FiltersSidebarProps) {
  return (
    <aside className="rounded-3xl border border-border bg-white p-5 shadow-card lg:sticky lg:top-28">
      <h2 className="text-lg font-semibold text-foreground">Фильтры</h2>
      <p className="mt-1 text-sm text-muted-foreground">Настройте подбор курсов под свои цели</p>

      <div className="mt-5 space-y-5">
        <section>
          <p className="text-sm font-semibold text-foreground">Уровень</p>
          <div className="mt-2 space-y-2">
            {levels.map((level) => (
              <label key={level} className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={filters.levels.includes(level)}
                  onChange={() => onToggleLevel(level)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                {level}
              </label>
            ))}
          </div>
        </section>

        <section>
          <p className="text-sm font-semibold text-foreground">Формат</p>
          <div className="mt-2 space-y-2">
            {formats.map((format) => (
              <label key={format} className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={filters.formats.includes(format)}
                  onChange={() => onToggleFormat(format)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                {format}
              </label>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Длительность</p>
            <span className="text-xs text-muted-foreground">до {filters.maxDuration} часов</span>
          </div>
          <input
            type="range"
            min={8}
            max={60}
            step={2}
            value={filters.maxDuration}
            onChange={(event) => onDurationChange(Number(event.target.value))}
            className="mt-3 w-full accent-primary"
            aria-label="Максимальная длительность курса"
          />
          <ProgressBar value={(filters.maxDuration / 60) * 100} className="mt-2" ariaLabel="Лимит длительности" />
        </section>

        <section>
          <p className="text-sm font-semibold text-foreground">Доступ</p>
          <div className="mt-2 space-y-2">
            {accessTypes.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={filters.accessTypes.includes(item)}
                  onChange={() => onToggleAccessType(item)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                {item}
              </label>
            ))}
          </div>
        </section>

        <section>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              checked={filters.certificateOnly}
              onChange={(event) => onCertificateOnlyChange(event.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            Только с сертификатом
          </label>
        </section>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        <button
          type="button"
          onClick={onApply}
          className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Применить
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground"
        >
          Сбросить
        </button>
      </div>
    </aside>
  );
}
