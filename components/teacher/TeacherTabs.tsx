"use client";

import { useMemo, useState } from "react";
import { BookOpenText, FileText, MessageCircleMore, UserRound } from "lucide-react";

import { Teacher } from "@/data/teachers";

import { ReviewCard } from "@/components/teacher/ReviewCard";
import { ReviewsSummary } from "@/components/teacher/ReviewsSummary";
import { SchedulePicker, SelectedScheduleSlot } from "@/components/teacher/SchedulePicker";

type TeacherTabsProps = {
  teacher: Teacher;
  selectedSlot: SelectedScheduleSlot | null;
  onSelectSlot: (slot: SelectedScheduleSlot | null) => void;
};

type TeacherTabKey = "about" | "schedule" | "courses" | "resume" | "reviews";

const tabStyles = "rounded-full px-4 py-2 text-sm font-semibold transition";

export function TeacherTabs({ teacher, selectedSlot, onSelectSlot }: TeacherTabsProps) {
  const [activeTab, setActiveTab] = useState<TeacherTabKey>("about");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const tabs: Array<{ key: TeacherTabKey; label: string }> = useMemo(
    () => [
      { key: "about", label: "Обо мне" },
      { key: "schedule", label: "Расписание" },
      { key: "courses", label: `Курсы (${teacher.coursesCount})` },
      { key: "resume", label: "Резюме" },
      { key: "reviews", label: `Отзывы (${teacher.reviewsCount})` }
    ],
    [teacher.coursesCount, teacher.reviewsCount]
  );

  const visibleReviews = showAllReviews ? teacher.reviews : teacher.reviews.slice(0, 3);

  return (
    <section className="rounded-[1.6rem] border border-border bg-white p-6 shadow-card sm:p-8" aria-label="Разделы профиля">
      <div role="tablist" aria-label="Вкладки профиля преподавателя" className="flex flex-wrap gap-2 rounded-2xl bg-slate-50 p-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`${tabStyles} ${
              activeTab === tab.key ? "bg-primary text-primary-foreground" : "bg-white text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "about" ? (
          <article className="rounded-2xl border border-border bg-slate-50 p-5">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <UserRound className="h-4 w-4 text-primary" aria-hidden="true" />
              О преподавателе
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{teacher.about}</p>
          </article>
        ) : null}

        {activeTab === "schedule" ? (
          <SchedulePicker scheduleSlots={teacher.scheduleSlots} selectedSlot={selectedSlot} onSelectSlot={onSelectSlot} />
        ) : null}

        {activeTab === "courses" ? (
          teacher.courses.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {teacher.courses.map((course) => (
                <article key={course.id} className="rounded-2xl border border-border bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-foreground">{course.title}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full border border-border bg-white px-2 py-1">{course.level}</span>
                    <span className="rounded-full border border-border bg-white px-2 py-1">{course.duration}</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{course.description}</p>
                  <button
                    type="button"
                    className="mt-4 inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                  >
                    Подробнее
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-slate-50 px-5 py-8 text-center">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <BookOpenText className="h-4 w-4 text-primary" aria-hidden="true" />
                Курсы скоро появятся
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Пока у преподавателя нет опубликованных курсов.</p>
            </div>
          )
        ) : null}

        {activeTab === "resume" ? (
          <div className="grid gap-3 md:grid-cols-2">
            <article className="rounded-2xl border border-border bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-foreground">Образование</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {teacher.resume.education.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-border bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-foreground">Сертификаты</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {teacher.resume.certificates.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-border bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-foreground">Языки</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {teacher.resume.languages.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-border bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-foreground">Стиль преподавания</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {teacher.resume.teachingStyle.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-border bg-slate-50 p-4 md:col-span-2">
              <h3 className="text-sm font-semibold text-foreground">Достижения</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {teacher.resume.achievements.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
          </div>
        ) : null}

        {activeTab === "reviews" ? (
          <div className="space-y-4">
            <ReviewsSummary
              rating={teacher.rating}
              reviewsCount={teacher.reviewsCount}
              ratingBreakdown={teacher.ratingBreakdown}
            />

            <div className="space-y-3">
              {visibleReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {teacher.reviews.length > 3 ? (
              <button
                type="button"
                onClick={() => setShowAllReviews((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground"
              >
                <MessageCircleMore className="h-4 w-4 text-primary" aria-hidden="true" />
                {showAllReviews ? "Скрыть" : "Показать все"}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
