import Image from "next/image";
import Link from "next/link";
import { BookOpenText, Bookmark, Flame, GraduationCap, Star, UsersRound } from "lucide-react";

import { Teacher } from "@/data/teachers";
import { cn } from "@/lib/utils";

type TeacherMarketplaceCardProps = {
  teacher: Teacher;
  featured?: boolean;
};

export function TeacherMarketplaceCard({ teacher, featured = false }: TeacherMarketplaceCardProps) {
  return (
    <article
      className={cn(
        "rounded-[1.8rem] border p-4 shadow-card transition hover:-translate-y-0.5",
        featured ? "border-slate-900 bg-slate-950 text-white" : "border-border bg-white text-foreground"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <Image
            src={teacher.avatarUrl}
            alt={`Аватар преподавателя ${teacher.name}`}
            width={68}
            height={68}
            className="h-[68px] w-[68px] rounded-2xl object-cover"
          />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              {teacher.badges.slice(0, 2).map((badge) => (
                <span
                  key={badge}
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    badge.includes("ТОП")
                      ? "bg-accent text-slate-900"
                      : featured
                        ? "bg-primary/25 text-primary-foreground"
                        : "bg-primary/10 text-primary"
                  )}
                >
                  {badge}
                </span>
              ))}
              <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", featured ? "text-amber-300" : "text-amber-500")}> 
                <Star className="h-3.5 w-3.5 fill-current" />
                {teacher.rating.toFixed(1)}
              </span>
            </div>

            <h3 className="mt-1 truncate text-xl font-semibold">{teacher.name}</h3>
            <p className={cn("text-sm", featured ? "text-slate-300" : "text-muted-foreground")}>{teacher.title}</p>
          </div>
        </div>

        <button
          type="button"
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-full border",
            featured ? "border-slate-700 text-slate-300" : "border-border text-muted-foreground"
          )}
          aria-label="Добавить в избранное"
        >
          <Bookmark className="h-4 w-4" />
        </button>
      </div>

      <p className={cn("mt-4 text-sm leading-relaxed", featured ? "text-slate-300" : "text-muted-foreground")}>
        {teacher.intro}
      </p>

      <div className={cn("mt-4 grid gap-2 text-sm sm:grid-cols-2", featured ? "text-slate-300" : "text-muted-foreground")}>
        <p className="inline-flex items-center gap-1.5">
          <GraduationCap className="h-4 w-4" />
          {teacher.lessonsCount.toLocaleString("ru-RU")} занятий
        </p>
        <p className="inline-flex items-center gap-1.5">
          <BookOpenText className="h-4 w-4" />
          {teacher.coursesCount} курсов
        </p>
        <p className="inline-flex items-center gap-1.5 sm:col-span-2">
          <UsersRound className="h-4 w-4" />
          {teacher.studentsCount.toLocaleString("ru-RU")}+ учеников
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-2">
        <p className={cn("inline-flex items-center gap-1 text-3xl font-semibold", featured ? "text-white" : "text-foreground")}>
          <Flame className={cn("h-6 w-6", featured ? "text-rose-400" : "text-rose-500")} />
          {teacher.pricePerHour.toLocaleString("ru-RU")}₽
          <span className={cn("text-base font-medium", featured ? "text-slate-400" : "text-muted-foreground")}>/урок</span>
        </p>

        <Link
          href={`/app/teachers/${teacher.id}`}
          className={cn(
            "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold",
            featured ? "bg-white text-slate-900" : "border border-border text-foreground"
          )}
        >
          Подробнее
        </Link>
      </div>
    </article>
  );
}
