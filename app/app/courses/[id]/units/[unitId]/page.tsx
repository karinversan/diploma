import Link from "next/link";

import { CourseUnitContent } from "@/components/courses/CourseUnitContent";
import {
  flattenCourseUnits,
  getCourseById,
  getCourseSyllabus
} from "@/data/courses";
import { homeworkItems } from "@/data/homework";

type CourseUnitPageProps = {
  params: {
    id: string;
    unitId: string;
  };
};

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default function CourseUnitPage({ params }: CourseUnitPageProps) {
  const courseId = safeDecode(params.id);
  const unitId = safeDecode(params.unitId);
  const course = getCourseById(courseId);

  if (!course) {
    return (
      <section className="rounded-3xl border border-border bg-white p-10 text-center shadow-card">
        <h1 className="text-3xl font-semibold text-foreground">Курс не найден</h1>
        <p className="mt-2 text-sm text-muted-foreground">Проверьте ссылку или вернитесь к каталогу курсов.</p>
        <Link
          href="/app/courses"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          К курсам
        </Link>
      </section>
    );
  }

  const syllabus = getCourseSyllabus(course.id);

  if (!syllabus) {
    return (
      <section className="rounded-3xl border border-border bg-white p-10 text-center shadow-card">
        <h1 className="text-3xl font-semibold text-foreground">Программа курса недоступна</h1>
        <p className="mt-2 text-sm text-muted-foreground">Попробуйте обновить страницу или выбрать другой курс.</p>
        <Link
          href={`/app/courses/${encodeURIComponent(course.id)}`}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Вернуться к программе
        </Link>
      </section>
    );
  }

  const allUnits = flattenCourseUnits(syllabus);
  const currentIndex = allUnits.findIndex((item) => item.id === unitId);

  if (currentIndex < 0) {
    return (
      <section className="rounded-3xl border border-border bg-white p-10 text-center shadow-card">
        <h1 className="text-3xl font-semibold text-foreground">Материал не найден</h1>
        <p className="mt-2 text-sm text-muted-foreground">В этом курсе нет запрошенного блока. Откройте программу курса и выберите урок.</p>
        <Link
          href={`/app/courses/${encodeURIComponent(course.id)}`}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          К программе курса
        </Link>
      </section>
    );
  }

  const unit = allUnits[currentIndex];
  const moduleUnits = allUnits.filter((item) => item.moduleId === unit.moduleId);
  const previousUnit = currentIndex > 0 ? allUnits[currentIndex - 1] : undefined;
  const nextUnit = currentIndex < allUnits.length - 1 ? allUnits[currentIndex + 1] : undefined;
  const relatedHomework = homeworkItems
    .filter((item) => item.courseId === course.id)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-white p-4 shadow-card sm:p-5">
        <nav aria-label="Хлебные крошки" className="text-sm text-muted-foreground">
          <Link href="/app/courses" className="hover:text-foreground">
            Курсы
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/app/courses/${encodeURIComponent(course.id)}`} className="hover:text-foreground">
            {course.title}
          </Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-foreground">{unit.title}</span>
        </nav>
      </section>

      <CourseUnitContent
        course={course}
        unit={unit}
        moduleUnits={moduleUnits}
        previousUnit={previousUnit}
        nextUnit={nextUnit}
        relatedHomework={relatedHomework}
      />
    </div>
  );
}
