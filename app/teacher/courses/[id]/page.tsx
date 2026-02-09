import Link from "next/link";

import { TeacherCourseEditorClient } from "@/components/teacher-cabinet/TeacherCourseEditorClient";
import { getCourseBuilderTemplateByCourseId, getTeacherCourseById } from "@/data/teacher-cabinet";

type TeacherCourseEditorPageProps = {
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

export default function TeacherCourseEditorPage({ params }: TeacherCourseEditorPageProps) {
  const courseId = safeDecode(params.id);
  const course = getTeacherCourseById(courseId);
  const template = getCourseBuilderTemplateByCourseId(courseId);

  if (!course || !template) {
    return (
      <section className="rounded-3xl border border-border bg-white p-10 text-center shadow-card">
        <h1 className="text-3xl font-semibold text-foreground">Курс не найден</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Не удалось открыть редактор. Проверьте ссылку или вернитесь к списку курсов преподавателя.
        </p>
        <Link
          href="/teacher/courses"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Вернуться к курсам
        </Link>
      </section>
    );
  }

  return <TeacherCourseEditorClient course={course} template={template} />;
}
