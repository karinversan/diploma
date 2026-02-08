import Image from "next/image";
import { Award, BookOpenCheck, BriefcaseBusiness, GraduationCap, Star, UsersRound } from "lucide-react";

import { TagChip } from "@/components/ui/TagChip";
import { Teacher } from "@/data/teachers";

type TeacherHeaderCardProps = {
  teacher: Teacher;
};

export function TeacherHeaderCard({ teacher }: TeacherHeaderCardProps) {
  const stats = [
    {
      icon: BriefcaseBusiness,
      label: `${teacher.experienceYears}+ лет опыта`
    },
    {
      icon: BookOpenCheck,
      label: `${teacher.coursesCount}+ курсов`
    },
    {
      icon: UsersRound,
      label: `${teacher.studentsCount}+ учеников`
    },
    {
      icon: GraduationCap,
      label: `${teacher.lessonsCount.toLocaleString("ru-RU")}+ занятий проведено`
    }
  ];

  return (
    <section className="rounded-[1.6rem] border border-border bg-white p-6 shadow-card sm:p-8" aria-label="Профиль преподавателя">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Image
          src={teacher.avatarUrl}
          alt={`Аватар преподавателя ${teacher.name}`}
          width={112}
          height={112}
          className="h-24 w-24 rounded-3xl object-cover sm:h-28 sm:w-28"
        />

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold text-foreground">{teacher.name}</h1>
            {teacher.badges.map((badge) => (
              <TagChip key={badge} variant={badge.includes("ТОП") ? "accent" : "primary"}>
                {badge}
              </TagChip>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <p className="text-base font-medium text-foreground">{teacher.title}</p>
            <p className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-500" aria-hidden="true" />
              <span className="font-semibold text-foreground">{teacher.rating.toFixed(1)}</span>
              <span>на основе {teacher.reviewsCount} отзывов</span>
            </p>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{teacher.intro}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {teacher.subjects.map((subject) => (
              <TagChip key={subject}>{subject}</TagChip>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article key={stat.label} className="rounded-2xl border border-border bg-slate-50 px-4 py-3">
              <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>{stat.label}</span>
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-accent/60 bg-accent/25 p-4 text-sm text-slate-900">
        <p className="inline-flex items-center gap-2 font-medium">
          <Award className="h-4 w-4" aria-hidden="true" />
          Активность за 48 часов: {teacher.bookedLast48h} бронирований
        </p>
      </div>
    </section>
  );
}
