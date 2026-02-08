import Link from "next/link";

import { teachers } from "@/data/teachers";

import { Container } from "@/components/Container";
import { TeacherCard } from "@/components/TeacherCard";

export function TeachersShowcase() {
  const featuredTeachers = teachers.slice(0, 6);

  return (
    <section id="teachers" className="scroll-mt-28 py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Преподаватели</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">Проверенные специалисты под любую цель</h2>
          </div>
          <Link
            href="/teachers"
            className="inline-flex items-center justify-center rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary"
          >
            Смотреть всех преподавателей
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {featuredTeachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} variant="showcase" />
          ))}
        </div>
      </Container>
    </section>
  );
}
