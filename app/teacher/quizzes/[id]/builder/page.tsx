import Link from "next/link";

import { TeacherQuizBuilderClient } from "@/components/teacher-cabinet/TeacherQuizBuilderClient";
import { getTeacherQuizById } from "@/data/teacher-cabinet";

type TeacherQuizBuilderPageProps = {
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

export default function TeacherQuizBuilderPage({ params }: TeacherQuizBuilderPageProps) {
  const quizId = safeDecode(params.id);
  const quiz = getTeacherQuizById(quizId);

  if (!quiz) {
    return (
      <section className="rounded-3xl border border-border bg-white p-10 text-center shadow-card">
        <h1 className="text-3xl font-semibold text-foreground">Квиз не найден</h1>
        <p className="mt-2 text-sm text-muted-foreground">Проверьте ссылку или откройте доступный квиз из раздела курсов.</p>
        <Link
          href="/teacher/courses"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Вернуться к курсам
        </Link>
      </section>
    );
  }

  return <TeacherQuizBuilderClient quiz={quiz} />;
}
