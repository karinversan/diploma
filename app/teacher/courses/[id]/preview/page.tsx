import Image from "next/image";
import Link from "next/link";
import { BookOpenCheck, Clock3, MessageSquareText, PlayCircle } from "lucide-react";

import { getCourseBuilderTemplateByCourseId, getTeacherCourseById, teacherCabinetProfile } from "@/data/teacher-cabinet";
import { cn } from "@/lib/utils";

type TeacherCoursePreviewPageProps = {
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

export default function TeacherCoursePreviewPage({ params }: TeacherCoursePreviewPageProps) {
  const courseId = safeDecode(params.id);
  const course = getTeacherCourseById(courseId);
  const template = getCourseBuilderTemplateByCourseId(courseId);

  if (!course || !template) {
    return (
      <section className="rounded-3xl border border-border bg-white p-10 text-center shadow-card">
        <h1 className="text-3xl font-semibold text-foreground">Курс не найден</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Невозможно открыть предпросмотр. Вернитесь к списку курсов и выберите существующий курс.
        </p>
        <Link
          href="/teacher/courses"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          К управлению курсами
        </Link>
      </section>
    );
  }

  const statusColorClass = course.status === "Опубликован" ? "success" : course.status === "На проверке" ? "accent" : "warning";

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border bg-white p-4 shadow-card sm:p-5">
        <nav aria-label="Хлебные крошки" className="text-sm text-muted-foreground">
          <Link href="/teacher/courses" className="hover:text-foreground">
            Курсы преподавателя
          </Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-foreground">Предпросмотр</span>
        </nav>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr),320px]">
        <div className="space-y-5">
          <article className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-amber-100 px-2.5 py-1 font-semibold text-amber-700">★ {course.rating || "Новый"}</span>
              <span className={cn("rounded-full px-2.5 py-1 font-semibold", statusColorClass === "success" ? "bg-emerald-100 text-emerald-700" : statusColorClass === "accent" ? "bg-accent/70 text-slate-900" : "bg-amber-100 text-amber-700")}>
                {course.status}
              </span>
            </div>

            <h1 className="mt-3 text-4xl font-semibold leading-tight text-foreground">{course.title}</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Это предпросмотр страницы курса для ученика. Проверьте позиционирование, оффер и структуру контента перед публикацией.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Image src={teacherCabinetProfile.avatarUrl} alt={teacherCabinetProfile.name} width={26} height={26} className="h-6 w-6 rounded-full" />
                {teacherCabinetProfile.name}
              </span>
              <span>· {course.studentsCount}+ учеников</span>
              <span>· {course.lessonsCount} урока</span>
            </div>
          </article>

          <article className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-foreground">Содержание курса</h2>
              <button type="button" className="text-sm font-semibold text-primary">
                Раскрыть все
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {template.subsections.map((subsection, index) => (
                <article key={subsection.id} className="rounded-2xl border border-border bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      Модуль {index + 1}. {subsection.title}
                    </p>
                    <span className="text-xs text-muted-foreground">{5 + index * 2} мин</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li className="inline-flex items-center gap-2">
                      <PlayCircle className="h-4 w-4 text-primary" />
                      Видео: {subsection.videoTitle}
                    </li>
                    <li className="inline-flex items-center gap-2">
                      <BookOpenCheck className="h-4 w-4 text-primary" />
                      Практика и мини-тест
                    </li>
                  </ul>
                </article>
              ))}
            </div>
          </article>
        </div>

        <aside className="space-y-4">
          <article className="rounded-3xl border border-border bg-white p-4 shadow-card">
            <Image src={course.imageUrl} alt={course.title} width={500} height={280} className="h-44 w-full rounded-2xl object-cover" />
            <p className="mt-3 text-4xl font-semibold text-foreground">
              {(course.price / 100).toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="ml-1 text-base font-medium text-muted-foreground">₽</span>
            </p>
            <div className="mt-3 grid gap-2">
              <button type="button" className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                Купить курс (как ученик)
              </button>
              <button type="button" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground">
                <MessageSquareText className="h-4 w-4" />
                Написать преподавателю
              </button>
            </div>
          </article>

          <article className="rounded-3xl border border-border bg-white p-4 shadow-card">
            <h3 className="text-lg font-semibold text-foreground">Что входит в курс</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-primary" />
                18 часов видео и практик
              </li>
              <li>Домашние задания с автопроверкой и ревью</li>
              <li>Живые сессии в онлайн-классе</li>
              <li>Финальный квиз и сертификат</li>
            </ul>
          </article>
        </aside>
      </section>
    </div>
  );
}
