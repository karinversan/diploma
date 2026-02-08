import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { TeacherProfileLayout } from "@/components/teacher/TeacherProfileLayout";
import { getTeacherById } from "@/data/teachers";

type AppTeacherProfilePageProps = {
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

export function generateMetadata({ params }: AppTeacherProfilePageProps): Metadata {
  const teacherId = safeDecode(params.id);
  const teacher = getTeacherById(teacherId);

  if (!teacher) {
    return {
      title: "Преподаватель не найден | УмныйКласс"
    };
  }

  return {
    title: `${teacher.name} — профиль преподавателя | УмныйКласс`,
    description: teacher.intro
  };
}

export default function AppTeacherProfilePage({ params }: AppTeacherProfilePageProps) {
  const teacherId = safeDecode(params.id);
  const teacher = getTeacherById(teacherId);

  if (!teacher) {
    return (
      <section className="rounded-3xl border border-border bg-white p-10 text-center shadow-card">
        <h1 className="text-3xl font-semibold text-foreground">Профиль не найден</h1>
        <p className="mt-2 text-sm text-muted-foreground">Проверьте ссылку или вернитесь в каталог преподавателей.</p>
        <Link
          href="/app/teachers"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Вернуться к преподавателям
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border bg-white p-4 shadow-card sm:p-5">
        <nav aria-label="Хлебные крошки">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/app/teachers" className="font-medium hover:text-foreground">
                Преподаватели
              </Link>
            </li>
            <li>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </li>
            <li aria-current="page" className="font-semibold text-foreground">
              {teacher.name}
            </li>
          </ol>
        </nav>
      </section>

      <TeacherProfileLayout
        teacher={teacher}
        bookingHrefBase={`/app/lessons?teacher=${encodeURIComponent(teacher.id)}`}
        messageHref={`/app/messages?teacher=${encodeURIComponent(teacher.id)}`}
        bookingButtonLabel="Забронировать урок"
      />
    </div>
  );
}
