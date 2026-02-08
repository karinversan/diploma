"use client";

import { useMemo, useState } from "react";

import { categories, subjects, teachers } from "@/data/teachers";

import { Container } from "@/components/Container";
import { FiltersBar } from "@/components/FiltersBar";
import { TeacherCard } from "@/components/TeacherCard";

type SortOption = "popular" | "price-asc" | "price-desc" | "rating";

type TeachersDirectoryProps = {
  initialCategory?: string;
};

export function TeachersDirectory({ initialCategory }: TeachersDirectoryProps) {
  const decodedInitialCategory = initialCategory ? decodeURIComponent(initialCategory) : undefined;

  const normalizedInitialCategory = categories.includes(decodedInitialCategory as (typeof categories)[number])
    ? (decodedInitialCategory as (typeof categories)[number])
    : "Все категории";

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("Все предметы");
  const [priceRange, setPriceRange] = useState("all");
  const [rating, setRating] = useState("all");
  const [availableToday, setAvailableToday] = useState(false);
  const [sort, setSort] = useState<SortOption>("popular");
  const [category, setCategory] = useState<string>(normalizedInitialCategory);

  const filteredTeachers = useMemo(() => {
    const result = teachers
      .filter((teacher) => {
        if (search && !teacher.name.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }

        if (subject !== "Все предметы" && !teacher.subjects.includes(subject)) {
          return false;
        }

        if (category !== "Все категории" && teacher.category !== category) {
          return false;
        }

        if (priceRange === "0-1500" && teacher.pricePerHour > 1500) {
          return false;
        }

        if (priceRange === "1500-2000" && (teacher.pricePerHour < 1500 || teacher.pricePerHour > 2000)) {
          return false;
        }

        if (priceRange === "2000+" && teacher.pricePerHour < 2000) {
          return false;
        }

        if (rating !== "all" && teacher.rating < Number(rating)) {
          return false;
        }

        if (availableToday && !teacher.availableToday) {
          return false;
        }

        return true;
      })
      .slice();

    if (sort === "popular") {
      return result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    if (sort === "price-asc") {
      return result.sort((a, b) => a.pricePerHour - b.pricePerHour);
    }

    if (sort === "price-desc") {
      return result.sort((a, b) => b.pricePerHour - a.pricePerHour);
    }

    return result.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
  }, [availableToday, category, priceRange, rating, search, sort, subject]);

  const resetFilters = () => {
    setSearch("");
    setSubject("Все предметы");
    setPriceRange("all");
    setRating("all");
    setAvailableToday(false);
    setSort("popular");
    setCategory("Все категории");
  };

  return (
    <main className="pb-16 pt-28 sm:pb-20 sm:pt-32">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Каталог преподавателей</p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">Найдите репетитора под вашу цель</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Поиск, фильтры и сортировка работают в реальном времени без перезагрузки страницы.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("Все категории")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              category === "Все категории"
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-white text-muted-foreground"
            }`}
          >
            Все категории
          </button>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                category === item ? "bg-primary text-primary-foreground" : "border border-border bg-white text-muted-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <FiltersBar
            search={search}
            subject={subject}
            priceRange={priceRange}
            rating={rating}
            availableToday={availableToday}
            sort={sort}
            subjects={subjects}
            onSearchChange={setSearch}
            onSubjectChange={setSubject}
            onPriceRangeChange={setPriceRange}
            onRatingChange={setRating}
            onAvailableTodayChange={setAvailableToday}
            onSortChange={setSort}
            onReset={resetFilters}
          />
        </div>

        <p className="mt-5 text-sm font-medium text-muted-foreground">Найдено преподавателей: {filteredTeachers.length}</p>

        {filteredTeachers.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-border bg-white p-8 text-center shadow-card">
            <p className="text-lg font-semibold text-foreground">Ничего не найдено</p>
            <p className="mt-2 text-sm text-muted-foreground">Попробуйте изменить фильтры или убрать ограничения.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {filteredTeachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} variant="directory" />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
