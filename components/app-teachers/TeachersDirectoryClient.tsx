"use client";

import Link from "next/link";
import { ChevronRight, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { TeacherMarketplaceCard } from "@/components/app-teachers/TeacherMarketplaceCard";
import { categories, teachers } from "@/data/teachers";

type SortOption = "popular" | "rating" | "price-asc" | "price-desc";

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "popular", label: "Самые популярные" },
  { value: "rating", label: "По рейтингу" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" }
];

const defaultSubject = "Все предметы";

const prioritizedSubjects = ["Английский", "Математика", "Программирование", "Русский язык", "Французский", "Физика"];

function sortTeachers(list: typeof teachers, sortBy: SortOption) {
  const sorted = [...list];

  if (sortBy === "rating") {
    sorted.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
  } else if (sortBy === "price-asc") {
    sorted.sort((a, b) => a.pricePerHour - b.pricePerHour);
  } else if (sortBy === "price-desc") {
    sorted.sort((a, b) => b.pricePerHour - a.pricePerHour);
  } else {
    sorted.sort((a, b) => b.reviewsCount - a.reviewsCount || b.studentsCount - a.studentsCount);
  }

  return sorted;
}

function encodeParams(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      query.set(key, value);
    }
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

type TeachersDirectoryClientProps = {
  initialQuery?: string;
  initialSort?: SortOption;
  initialSubject?: string;
  initialCategory?: string;
  initialAvailableOnly?: boolean;
};

export function TeachersDirectoryClient({
  initialQuery,
  initialSort = "popular",
  initialSubject,
  initialCategory,
  initialAvailableOnly = false
}: TeachersDirectoryClientProps) {
  const allSubjects = useMemo(
    () => [defaultSubject, ...Array.from(new Set(teachers.flatMap((teacher) => teacher.subjects))).sort((a, b) => a.localeCompare(b, "ru"))],
    []
  );

  const [searchQuery, setSearchQuery] = useState(initialQuery ?? "");
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [selectedSubject, setSelectedSubject] = useState(
    initialSubject && allSubjects.includes(initialSubject) ? initialSubject : defaultSubject
  );
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory && categories.includes(initialCategory as (typeof categories)[number]) ? initialCategory : "Все"
  );
  const [onlyAvailable, setOnlyAvailable] = useState(initialAvailableOnly);

  const filteredTeachers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = teachers.filter((teacher) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        teacher.name.toLowerCase().includes(normalizedQuery) ||
        teacher.title.toLowerCase().includes(normalizedQuery) ||
        teacher.subjects.some((subject) => subject.toLowerCase().includes(normalizedQuery)) ||
        teacher.intro.toLowerCase().includes(normalizedQuery);

      const matchesSubject = selectedSubject === defaultSubject || teacher.subjects.includes(selectedSubject);
      const matchesCategory = selectedCategory === "Все" || teacher.category === selectedCategory;
      const matchesAvailability = !onlyAvailable || teacher.availableToday;

      return matchesQuery && matchesSubject && matchesCategory && matchesAvailability;
    });

    return sortTeachers(filtered, sortBy);
  }, [onlyAvailable, searchQuery, selectedCategory, selectedSubject, sortBy]);

  const sections = useMemo(() => {
    const hasScopedFilters = searchQuery.trim().length > 0 || selectedSubject !== defaultSubject || selectedCategory !== "Все" || onlyAvailable;

    if (hasScopedFilters) {
      return [
        {
          key: "filtered",
          title: "Результаты подбора",
          teachers: filteredTeachers,
          showAll: true,
          fullListQuery: encodeParams({
            q: searchQuery.trim() || undefined,
            subject: selectedSubject !== defaultSubject ? selectedSubject : undefined,
            category: selectedCategory !== "Все" ? selectedCategory : undefined,
            sort: sortBy,
            available: onlyAvailable ? "1" : undefined
          })
        }
      ];
    }

    const grouped = new Map<string, typeof teachers>();

    for (const teacher of filteredTeachers) {
      const primarySubject = teacher.subjects[0];
      const existing = grouped.get(primarySubject);

      if (existing) {
        existing.push(teacher);
      } else {
        grouped.set(primarySubject, [teacher]);
      }
    }

    const allPrimarySubjects = Array.from(grouped.keys());
    const orderedSubjects = [
      ...prioritizedSubjects.filter((subject) => allPrimarySubjects.includes(subject)),
      ...allPrimarySubjects.filter((subject) => !prioritizedSubjects.includes(subject))
    ];

    return orderedSubjects.slice(0, 3).map((subject) => ({
      key: subject,
      title: `Преподаватели: ${subject}`,
      teachers: grouped.get(subject) ?? [],
      showAll: false,
      fullListQuery: encodeParams({ subject, sort: sortBy })
    }));
  }, [filteredTeachers, onlyAvailable, searchQuery, selectedCategory, selectedSubject, sortBy]);

  const foundCount = filteredTeachers.length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <h1 className="text-4xl font-semibold text-foreground">Преподаватели</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Подберите наставника под цель: экзамен, разговорная практика, программирование или повышение успеваемости.
          </p>

          <label className="relative mt-5 block">
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              type="search"
              placeholder="Поиск преподавателя"
              className="w-full rounded-2xl border border-border bg-slate-50 py-2.5 pl-4 pr-3 text-sm outline-none transition focus:border-primary"
              aria-label="Поиск преподавателя"
            />
          </label>
        </div>

        <div className="rounded-3xl border border-primary/20 bg-[linear-gradient(125deg,rgba(116,76,255,0.2),rgba(185,250,119,0.2))] p-5 shadow-card sm:p-6">
          <p className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-foreground">
            Хотите преподавать на платформе? Подайте заявку и пройдите верификацию профиля.
          </p>

          <p className="mt-3 text-sm text-muted-foreground">
            После одобрения вы получите доступ к расписанию, заявкам учеников и аналитике по своим занятиям.
          </p>

          <Link
            href="/signup?role=tutor"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Подать заявку преподавателя
          </Link>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-border bg-white p-4 shadow-card sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Подходящих преподавателей: {foundCount}</p>

          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Сортировка
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="ml-2 rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium text-foreground"
                aria-label="Сортировка преподавателей"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => setOnlyAvailable((prev) => !prev)}
              className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition ${
                onlyAvailable
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
              aria-pressed={onlyAvailable}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Свободно сегодня
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedSubject(defaultSubject);
                setSelectedCategory("Все");
                setOnlyAvailable(false);
                setSortBy("popular");
              }}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-xs font-semibold text-muted-foreground transition hover:border-primary/40"
            >
              <RotateCcw className="h-4 w-4" />
              Сбросить
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {allSubjects.map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => setSelectedSubject(subject)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                selectedSubject === subject
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-white text-muted-foreground hover:border-primary/40"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {["Все", ...categories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                selectedCategory === category
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-white text-muted-foreground hover:border-primary/40"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {sections.map((section, sectionIndex) => (
        <section key={section.key} className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-3xl font-semibold text-foreground">{section.title}</h2>
            <Link
              href={`/app/teachers${section.fullListQuery}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Смотреть все
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {section.teachers.length === 0 ? (
            <article className="rounded-3xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted-foreground">
              По этому запросу преподаватели не найдены. Попробуйте изменить фильтры или убрать часть ограничений.
            </article>
          ) : (
            <div className="grid gap-4 xl:grid-cols-3">
              {(section.showAll ? section.teachers : section.teachers.slice(0, 3)).map((teacher, index) => (
                <TeacherMarketplaceCard key={teacher.id} teacher={teacher} featured={sectionIndex === 0 ? index < 2 : index === 2} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
