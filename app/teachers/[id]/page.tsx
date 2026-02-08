import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";

import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TeacherProfileLayout } from "@/components/teacher/TeacherProfileLayout";
import { getTeacherById } from "@/data/teachers";

type TeacherProfilePageProps = {
  params: {
    id: string;
  };
};

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

export function generateMetadata({ params }: TeacherProfilePageProps): Metadata {
  const teacherId = safeDecode(params.id);
  const teacher = getTeacherById(teacherId);

  if (!teacher) {
    return {
      title: "Профиль преподавателя не найден | SkillZone",
      description: "Запрошенный профиль преподавателя не найден."
    };
  }

  return {
    title: `${teacher.name} — профиль преподавателя | SkillZone`,
    description: truncate(teacher.intro, 150)
  };
}

export default function TeacherProfilePage({ params }: TeacherProfilePageProps) {
  const teacherId = safeDecode(params.id);
  const teacher = getTeacherById(teacherId);

  return (
    <>
      <Header showSectionLinks={false} />

      <main className="pb-16 pt-28 sm:pt-32">
        <Container>
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <nav aria-label="Хлебные крошки">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/teachers" className="font-medium hover:text-foreground">
                    Преподаватели
                  </Link>
                </li>
                <li>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </li>
                <li aria-current="page" className="font-semibold text-foreground">
                  {teacher?.name ?? "Профиль не найден"}
                </li>
              </ol>
            </nav>

            <label className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск преподавателя"
                className="w-full rounded-full border border-border bg-slate-50 py-2 pl-9 pr-4 text-sm text-foreground outline-none focus:border-primary"
                aria-label="Поиск преподавателя"
              />
            </label>
          </div>

          {teacher ? (
            <TeacherProfileLayout teacher={teacher} />
          ) : (
            <section className="rounded-3xl border border-border bg-white px-6 py-16 text-center shadow-soft sm:px-10">
              <h1 className="text-3xl font-semibold text-foreground">Профиль преподавателя не найден</h1>
              <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
                Возможно, ссылка устарела или преподаватель временно недоступен в каталоге. Выберите другого специалиста из
                списка.
              </p>
              <Link
                href="/teachers"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
              >
                Вернуться к списку преподавателей
              </Link>
            </section>
          )}
        </Container>
      </main>

      <Footer />
    </>
  );
}
