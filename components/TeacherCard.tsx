import Image from "next/image";
import Link from "next/link";

import { Teacher } from "@/data/teachers";

type TeacherCardProps = {
  teacher: Teacher;
  variant?: "showcase" | "directory";
};

export function TeacherCard({ teacher, variant = "directory" }: TeacherCardProps) {
  const isDirectory = variant === "directory";

  return (
    <article id={teacher.id} className="rounded-3xl border border-border bg-white p-5 shadow-card">
      <div className="flex items-start gap-4">
        <Image
          src={teacher.avatarUrl}
          alt={`Аватар преподавателя ${teacher.name}`}
          width={72}
          height={72}
          className="h-[72px] w-[72px] rounded-2xl object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">{teacher.name}</h3>
            {teacher.badges.map((badge) => (
              <span
                key={badge}
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                  badge === "Топ" ? "bg-accent text-slate-900" : "bg-primary/10 text-primary"
                }`}
              >
                {badge}
              </span>
            ))}
          </div>

          <p className="mt-1 text-sm text-muted-foreground">{teacher.subjects.join(" • ")}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span aria-label="Рейтинг">⭐ {teacher.rating.toFixed(1)}</span>
            <span>{teacher.reviewsCount} отзывов</span>
            <span>{teacher.pricePerHour} ₽/час</span>
          </div>
        </div>
      </div>

      {isDirectory ? <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{teacher.bio}</p> : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {teacher.subjects.map((subject) => (
          <span key={subject} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            {subject}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={`/teachers#${teacher.id}`}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-primary"
        >
          Профиль
        </Link>
        <Link
          href={`/lead?role=student&teacher=${encodeURIComponent(teacher.id)}`}
          className="inline-flex flex-1 items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Оставить заявку
        </Link>
      </div>

      <p className="mt-3 text-xs font-medium text-muted-foreground">
        {teacher.availableToday ? "Свободно сегодня" : "Ближайшее окно: завтра"}
      </p>
    </article>
  );
}
