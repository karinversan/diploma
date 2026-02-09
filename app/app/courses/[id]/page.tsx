import Link from "next/link";

import { CourseLearningExperience } from "@/components/courses/CourseLearningExperience";
import { getCourseById, getCourseSyllabus } from "@/data/courses";
import { homeworkItems } from "@/data/homework";
import { upcomingLessons } from "@/data/lessons";
import { getTeacherById } from "@/data/teachers";

type CourseDetailsPageProps = {
  params: {
    id: string;
  };
};

type CourseSlot = {
  id: string;
  date: string;
  time: string;
  durationMinutes: number;
};

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getCourseSlots(courseId: string, teacherId: string): CourseSlot[] {
  const teacher = getTeacherById(teacherId);

  if (!teacher) {
    return [];
  }

  return teacher.scheduleSlots
    .flatMap((slot) =>
      slot.times.map((time) => ({
        id: `${courseId}__${slot.date}__${time.replace(":", "-")}`,
        date: slot.date,
        time,
        durationMinutes: 60
      }))
    )
    .slice(0, 8);
}

export default function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const courseId = safeDecode(params.id);
  const course = getCourseById(courseId);

  if (!course) {
    return (
      <section className="rounded-3xl border border-border bg-white p-10 text-center shadow-card">
        <h1 className="text-3xl font-semibold text-foreground">Курс не найден</h1>
        <p className="mt-2 text-sm text-muted-foreground">Проверьте ссылку или вернитесь в каталог курсов.</p>
        <Link
          href="/app/courses"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Вернуться к курсам
        </Link>
      </section>
    );
  }

  const syllabus = getCourseSyllabus(course.id);

  if (!syllabus) {
    return (
      <section className="rounded-3xl border border-border bg-white p-10 text-center shadow-card">
        <h1 className="text-3xl font-semibold text-foreground">Не удалось загрузить программу курса</h1>
        <p className="mt-2 text-sm text-muted-foreground">Попробуйте обновить страницу или выберите другой курс.</p>
        <Link
          href="/app/courses"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Вернуться к курсам
        </Link>
      </section>
    );
  }

  const homeworkPlan = homeworkItems
    .filter((item) => item.courseId === course.id)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const nextLesson = upcomingLessons
    .filter((lesson) => lesson.courseId === course.id)
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())[0];

  const slots = getCourseSlots(course.id, course.teacherId);

  return (
    <CourseLearningExperience
      course={course}
      syllabus={syllabus}
      homeworkPlan={homeworkPlan}
      nextLesson={nextLesson}
      slots={slots}
    />
  );
}
