"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { BookOpenText, Search, X } from "lucide-react";

import { CategoryChips } from "@/components/courses/CategoryChips";
import { CourseCard } from "@/components/courses/CourseCard";
import { FiltersSidebar } from "@/components/courses/FiltersSidebar";
import { EmptyState } from "@/components/shared/EmptyState";
import { courseCategories, courses } from "@/data/courses";
import { useCourseFilters } from "@/hooks/useCourseFilters";

export default function CoursesPage() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    draftFilters,
    setDraftFilters,
    filteredCourses,
    toggleLevel,
    toggleFormat,
    toggleAccessType,
    applyFilters,
    resetFilters
  } = useCourseFilters(courses);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <FiltersSidebar
        filters={draftFilters}
        onToggleLevel={toggleLevel}
        onToggleFormat={toggleFormat}
        onToggleAccessType={toggleAccessType}
        onDurationChange={(value) => setDraftFilters((prev) => ({ ...prev, maxDuration: value }))}
        onCertificateOnlyChange={(value) => setDraftFilters((prev) => ({ ...prev, certificateOnly: value }))}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      <section className="space-y-4">
        <div className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">Курсы</h1>
              <p className="mt-1 text-sm text-muted-foreground">Подберите программы по уровню, формату и расписанию</p>
              <p className="mt-2 rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
                Курсы «По расписанию» включают живые уроки и запись на слот. Курсы «По запросу» доступны сразу в
                самостоятельном темпе.
              </p>
            </div>

            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  <BookOpenText className="h-4 w-4" />
                  Как проходит обучение
                </button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[70] bg-slate-950/70" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-[71] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-white p-6 shadow-soft">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-lg font-semibold text-foreground">Как устроен процесс обучения</Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground"
                        aria-label="Закрыть"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li>1. Выбираете курс и цель обучения.</li>
                    <li>2. Открываете программу курса и изучаете модули.</li>
                    <li>3. Для живых курсов бронируете слот с преподавателем.</li>
                    <li>4. Выполняете домашние задания и получаете обратную связь.</li>
                    <li>5. Следите за прогрессом в аналитике и корректируете план.</li>
                  </ol>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="mt-5 inline-flex rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                    >
                      Понял, продолжить
                    </button>
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>

          <label className="relative mt-4 block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Поиск курса, темы или преподавателя"
              className="w-full rounded-2xl border border-border bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary"
            />
          </label>

          <div className="mt-4">
            <CategoryChips
              categories={courseCategories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <EmptyState
            title="Курсы не найдены"
            description="Измените параметры фильтрации или очистите ограничения, чтобы увидеть больше программ."
            actionLabel="Сбросить фильтры"
            actionHref="/app/courses"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
