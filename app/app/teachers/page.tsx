"use client";

import Link from "next/link";
import { Bookmark, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { TeacherMarketplaceCard } from "@/components/app-teachers/TeacherMarketplaceCard";
import { teachers } from "@/data/teachers";

type SortOption = "popular" | "rating" | "price-asc" | "price-desc";

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "popular", label: "Самые популярные" },
  { value: "rating", label: "По рейтингу" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" }
];

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

export default function AppTeachersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [teacherModeEnabled, setTeacherModeEnabled] = useState(false);

  const sections = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = teachers.filter((teacher) => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        teacher.name.toLowerCase().includes(normalizedQuery) ||
        teacher.title.toLowerCase().includes(normalizedQuery) ||
        teacher.subjects.some((subject) => subject.toLowerCase().includes(normalizedQuery)) ||
        teacher.intro.toLowerCase().includes(normalizedQuery)
      );
    });

    const sorted = sortTeachers(filtered, sortBy);

    if (normalizedQuery) {
      return [
        {
          key: "search",
          title: "Результаты поиска",
          teachers: sorted
        }
      ];
    }

    const grouped = new Map<string, typeof teachers>();

    for (const teacher of sorted) {
      const primarySubject = teacher.subjects[0];
      const existing = grouped.get(primarySubject);

      if (existing) {
        existing.push(teacher);
      } else {
        grouped.set(primarySubject, [teacher]);
      }
    }

    const allSubjects = Array.from(grouped.keys());
    const orderedSubjects = [
      ...prioritizedSubjects.filter((subject) => allSubjects.includes(subject)),
      ...allSubjects.filter((subject) => !prioritizedSubjects.includes(subject))
    ];

    return orderedSubjects.slice(0, 3).map((subject) => ({
      key: subject,
      title: `Преподаватели: ${subject}`,
      teachers: grouped.get(subject) ?? []
    }));
  }, [searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <h1 className="text-4xl font-semibold text-foreground">Преподаватели</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Подберите наставника по предмету, формату и стоимости. Просмотр профилей доступен прямо в кабинете ученика.
          </p>

          <label className="relative mt-5 block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              type="search"
              placeholder="Поиск преподавателя"
              className="w-full rounded-2xl border border-border bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary"
              aria-label="Поиск преподавателя"
            />
          </label>
        </div>

        <div className="rounded-3xl border border-primary/20 bg-[linear-gradient(125deg,rgba(116,76,255,0.2),rgba(185,250,119,0.2))] p-5 shadow-card sm:p-6">
          <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-foreground">
            <span>Активировать аккаунт преподавателя</span>
            <button
              type="button"
              role="switch"
              aria-checked={teacherModeEnabled}
              onClick={() => setTeacherModeEnabled((prev) => !prev)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                teacherModeEnabled ? "bg-primary" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                  teacherModeEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </label>

          <p className="mt-3 text-sm text-muted-foreground">
            Если хотите преподавать на платформе, заполните анкету, пройдите проверку и получите доступ к заявкам учеников.
          </p>

          <Link
            href="/signup?role=tutor"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Стать преподавателем
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-white p-4 shadow-card sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Найдено преподавателей: {sections.reduce((acc, section) => acc + section.teachers.length, 0)}</p>

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
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground"
              aria-label="Дополнительные фильтры"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground"
              aria-label="Сохраненные преподаватели"
            >
              <Bookmark className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {sections.map((section, sectionIndex) => (
        <section key={section.key} className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-3xl font-semibold text-foreground">{section.title}</h2>
            <Link href="/app/teachers" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Смотреть все
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {section.teachers.length === 0 ? (
            <article className="rounded-3xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted-foreground">
              По этому запросу преподаватели не найдены. Попробуйте изменить фильтр или поисковый запрос.
            </article>
          ) : (
            <div className="grid gap-4 xl:grid-cols-3">
              {section.teachers.slice(0, 3).map((teacher, index) => (
                <TeacherMarketplaceCard key={teacher.id} teacher={teacher} featured={sectionIndex === 0 ? index < 2 : index === 2} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
