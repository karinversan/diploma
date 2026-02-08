import Link from "next/link";
import {
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Sparkles,
  UsersRound,
  Video
} from "lucide-react";

import { getCourseById, getCourseProgressPercent, StudentCourse } from "@/data/courses";
import { getTeacherById } from "@/data/teachers";
import { upcomingLessons } from "@/data/lessons";
import {
  homeworkAssignmentTypeLabels,
  homeworkCheckModeLabels,
  homeworkItems,
  HomeworkItem
} from "@/data/homework";

type CourseDetailsPageProps = {
  params: {
    id: string;
  };
};

type CourseMaterial = {
  id: string;
  title: string;
  type: string;
  description: string;
  duration: string;
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

function buildProgramBlocks(title: string, lessonsTotal: number) {
  const blocksCount = Math.min(6, Math.max(3, Math.ceil(lessonsTotal / 3)));

  return Array.from({ length: blocksCount }, (_, index) => {
    const blockNumber = index + 1;
    const lessonsInBlock = Math.max(2, Math.round(lessonsTotal / blocksCount));

    return {
      id: `${blockNumber}`,
      title: `${title}: модуль ${blockNumber}`,
      lessonsInBlock,
      result:
        blockNumber <= 2
          ? "Фундамент темы и ключевые термины"
          : blockNumber <= 4
            ? "Практика, разбор ошибок и закрепление"
            : "Финальные задачи и подготовка к итоговой проверке"
    };
  });
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short"
  }).format(new Date(value));
}

function formatSlotDate(value: string) {
  const date = new Date(`${value}T12:00:00`);

  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "2-digit",
    month: "short"
  }).format(date);
}

function getCourseMaterials(course: StudentCourse): CourseMaterial[] {
  const generic: CourseMaterial[] = [
    {
      id: `${course.id}-m1`,
      title: "Видео-разбор темы",
      type: "Видео",
      description: "Короткий урок с объяснением ключевых понятий и примеров.",
      duration: "12–18 мин"
    },
    {
      id: `${course.id}-m2`,
      title: "Конспект и опорная схема",
      type: "PDF",
      description: "Структурированный конспект с формулами, правилами и чек-листом.",
      duration: "5–7 стр."
    },
    {
      id: `${course.id}-m3`,
      title: "Практический тренажер",
      type: "Интерактив",
      description: "Серия быстрых упражнений с автопроверкой и объяснениями.",
      duration: "10–20 мин"
    },
    {
      id: `${course.id}-m4`,
      title: "Итоговый мини-тест",
      type: "Тест",
      description: "Проверка понимания темы перед переходом к следующему модулю.",
      duration: "8–12 мин"
    }
  ];

  if (course.category === "Языки") {
    generic[0] = {
      id: `${course.id}-m1`,
      title: "Диалоговый видео-урок",
      type: "Видео",
      description: "Разбор разговорных шаблонов и полезных выражений.",
      duration: "14–20 мин"
    };
    generic[3] = {
      id: `${course.id}-m4`,
      title: "Аудирование + тест",
      type: "Аудио",
      description: "Прослушивание фрагмента и тестовые вопросы с автопроверкой.",
      duration: "10–15 мин"
    };
  }

  if (course.category === "Программирование") {
    generic[2] = {
      id: `${course.id}-m3`,
      title: "Кодинг-спринт",
      type: "Практика",
      description: "Мини-задачи в стиле тренажера: быстрое решение и подсказки.",
      duration: "15–25 мин"
    };
  }

  return generic;
}

function getCourseSlots(course: StudentCourse): CourseSlot[] {
  const teacher = getTeacherById(course.teacherId);

  if (!teacher) {
    return [];
  }

  return teacher.scheduleSlots
    .flatMap((slot) =>
      slot.times.map((time) => ({
        id: `${course.id}__${slot.date}__${time.replace(":", "-")}`,
        date: slot.date,
        time,
        durationMinutes: 60
      }))
    )
    .slice(0, 6);
}

function getCourseHomeworkPlan(courseId: string) {
  return homeworkItems
    .filter((item) => item.courseId === courseId)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

function getHomeworkStatusBadge(item: HomeworkItem) {
  if (item.status === "graded") {
    return "Проверено";
  }
  if (item.status === "submitted") {
    return "На проверке";
  }
  if (item.status === "in_progress") {
    return "В работе";
  }
  return "Новое";
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

  const progress = getCourseProgressPercent(course);
  const programBlocks = buildProgramBlocks(course.title, course.lessonsTotal);
  const materials = getCourseMaterials(course);
  const plannedHomework = getCourseHomeworkPlan(course.id);
  const availableSlots = getCourseSlots(course);

  const nextLesson = upcomingLessons
    .filter((lesson) => lesson.courseId === course.id)
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())[0];

  const isScheduledCourse = course.accessType === "По расписанию";
  const primaryCtaHref = `/app/lessons?course=${encodeURIComponent(course.id)}`;
  const primaryCtaLabel =
    progress > 0 ? "Продолжить обучение" : isScheduledCourse ? "Открыть расписание курса" : "Начать курс";

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-white p-4 shadow-card sm:p-5">
        <nav aria-label="Хлебные крошки" className="text-sm text-muted-foreground">
          <Link href="/app/courses" className="hover:text-foreground">
            Курсы
          </Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-foreground">{course.title}</span>
        </nav>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-border bg-white p-6 shadow-card sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{course.category}</span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">{course.level}</span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">{course.accessType}</span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold text-foreground">{course.title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{course.description}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Прогресс</p>
              <p className="mt-1 text-xl font-semibold text-foreground">{progress}%</p>
            </div>
            <div className="rounded-2xl border border-border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Уроков</p>
              <p className="mt-1 text-xl font-semibold text-foreground">
                {course.lessonsCompleted}/{course.lessonsTotal}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Длительность</p>
              <p className="mt-1 text-xl font-semibold text-foreground">{course.durationHours} ч</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
            <p className="font-semibold">Как проходит обучение по курсу</p>
            <ol className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>1. Открываете модуль, изучаете материалы и конспект.</li>
              <li>2. Выполняете практические задания и мини-тесты с автопроверкой.</li>
              <li>3. Сдаёте экспертные задания (эссе/аудио) на проверку ИИ + преподавателя.</li>
              <li>4. Бронируете живой урок, если нужен разбор сложных тем в реальном времени.</li>
            </ol>
          </div>
        </article>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-border bg-white p-5 shadow-card">
            <h2 className="text-lg font-semibold text-foreground">Что получает ученик</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="inline-flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                Готовые материалы к каждому модулю (видео, конспект, тренажер)
              </li>
              <li className="inline-flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                Автотесты и мини-тренажеры с мгновенной проверкой
              </li>
              <li className="inline-flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                Домашние задания с проверкой ИИ и преподавателя
              </li>
              <li className="inline-flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                ИИ-конспект уроков и рекомендации по слабым темам
              </li>
            </ul>

            <div className="mt-5 grid gap-2">
              <Link
                href={primaryCtaHref}
                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                {primaryCtaLabel}
              </Link>
              <Link
                href={`/app/messages?teacher=${encodeURIComponent(course.teacherId)}`}
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground"
              >
                Обсудить план с преподавателем
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-white p-5 shadow-card">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              Ближайшее занятие
            </h3>
            {nextLesson ? (
              <>
                <p className="mt-2 text-sm text-foreground">{formatDate(nextLesson.startAt)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Преподаватель: {nextLesson.teacherName}</p>
                <Link
                  href={nextLesson.joinUrl}
                  className="mt-3 inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground"
                >
                  Перейти в урок
                </Link>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Пока нет запланированных уроков по этому курсу.</p>
            )}
          </section>
        </aside>
      </section>

      <section className="rounded-3xl border border-border bg-white p-6 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-foreground">Материалы курса</h2>
          <span className="text-sm text-muted-foreground">{materials.length} материалов в текущем модуле</span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {materials.map((material) => (
            <article key={material.id} className="rounded-2xl border border-border bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{material.title}</p>
                <span className="rounded-full border border-border bg-white px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                  {material.type}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{material.description}</p>
              <p className="mt-2 text-xs font-medium text-foreground">Длительность: {material.duration}</p>
              <button
                type="button"
                className="mt-3 inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
              >
                Открыть материал (демо)
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-white p-6 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-foreground">План домашних заданий</h2>
          <Link href="/app/homework" className="text-sm font-semibold text-primary hover:underline">
            Все задания
          </Link>
        </div>

        {plannedHomework.length > 0 ? (
          <div className="mt-4 space-y-3">
            {plannedHomework.map((item) => (
              <article key={item.id} className="rounded-2xl border border-border bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <span className="rounded-full border border-border bg-white px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                    {getHomeworkStatusBadge(item)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded-full border border-border bg-white px-2.5 py-1 text-muted-foreground">
                    Срок: {formatShortDate(item.dueDate)}
                  </span>
                  <span className="rounded-full border border-border bg-white px-2.5 py-1 text-muted-foreground">
                    {homeworkAssignmentTypeLabels[item.assignmentType]}
                  </span>
                  <span className="rounded-full border border-border bg-white px-2.5 py-1 text-muted-foreground">
                    {homeworkCheckModeLabels[item.checkMode]}
                  </span>
                </div>
                <Link
                  href={`/app/homework/${item.id}`}
                  className="mt-3 inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  Открыть задание
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">Домашние задания для этого курса будут добавлены после первого урока.</p>
        )}
      </section>

      <section className="rounded-3xl border border-border bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-foreground">Запись на занятия</h2>
          <span className="text-sm text-muted-foreground">Выберите слот и подтвердите бронь в расписании</span>
        </div>

        {availableSlots.length > 0 ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {availableSlots.map((slot) => (
              <article key={slot.id} className="rounded-2xl border border-border bg-slate-50 p-4">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {formatSlotDate(slot.date)}
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5 text-primary" />
                  {slot.time} • {slot.durationMinutes} мин
                </p>
                <Link
                  href={`/app/lessons?course=${encodeURIComponent(course.id)}&teacher=${encodeURIComponent(
                    course.teacherId
                  )}&subject=${encodeURIComponent(course.title)}&slot=${encodeURIComponent(`${slot.date} ${slot.time}`)}`}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  Записаться на это время
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Свободные слоты скоро появятся. Напишите преподавателю, чтобы согласовать время вручную.
          </p>
        )}
      </section>

      <section className="rounded-3xl border border-border bg-white p-6 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-foreground">Программа курса</h2>
          <span className="text-sm text-muted-foreground">{programBlocks.length} модулей</span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {programBlocks.map((block) => (
            <article key={block.id} className="rounded-2xl border border-border bg-slate-50 p-4">
              <p className="text-sm font-semibold text-foreground">{block.title}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <BookOpenText className="h-3.5 w-3.5" />
                {block.lessonsInBlock} урока
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Результат: {block.result}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-white p-6 shadow-card">
        <h2 className="text-2xl font-semibold text-foreground">Почему здесь есть запись на урок</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Запись нужна для живых занятий с преподавателем и резервирует слот в расписании. Для модульных материалов вы можете
          учиться в любое время, а живой урок подключать для разбора сложных тем и проверки прогресса.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border border-border bg-slate-50 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <UsersRound className="h-4 w-4 text-primary" />
              Поддержка преподавателя
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Индивидуальный разбор ваших ошибок и темпа обучения.</p>
          </article>
          <article className="rounded-2xl border border-border bg-slate-50 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <Video className="h-4 w-4 text-primary" />
              Онлайн-класс
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Живой урок, чат, конспект и домашка в едином интерфейсе.</p>
          </article>
          <article className="rounded-2xl border border-border bg-slate-50 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Измеримый результат
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Аналитика прогресса, оценка работ и персональные рекомендации.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
