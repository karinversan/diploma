export type LessonStatus = "upcoming" | "completed" | "cancelled";

export type StudentLesson = {
  id: string;
  courseId: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  startAt: string;
  durationMinutes: number;
  status: LessonStatus;
  joinUrl: string;
  chatThreadId: string;
  isStartingSoon?: boolean;
  summarySnippet: string;
  transcriptSnippet: string;
  recommendations: string[];
  files: Array<{ id: string; name: string; size: string }>;
};

export const lessons: StudentLesson[] = [
  {
    id: "lesson-001",
    courseId: "course-eng-1",
    subject: "Английский",
    teacherId: "natalya-smirnova",
    teacherName: "Наталья Смирнова",
    startAt: "2026-02-08T19:10:00+03:00",
    durationMinutes: 60,
    status: "upcoming",
    joinUrl: "/app/lessons/lesson-001",
    chatThreadId: "thread-natalya",
    isStartingSoon: true,
    summarySnippet: "Отработали Present Perfect и связки для разговорной речи.",
    transcriptSnippet: "Today we focused on speaking patterns for everyday discussions...",
    recommendations: [
      "Повторить таблицу неправильных глаголов",
      "Сделать упражнение на вопросительные формы",
      "Подготовить мини-рассказ о рабочем дне"
    ],
    files: [
      { id: "f-001", name: "Конспект_урока_08_02.pdf", size: "1.2 МБ" },
      { id: "f-002", name: "Домашка_модуль_4.docx", size: "420 КБ" }
    ]
  },
  {
    id: "lesson-002",
    courseId: "course-math-1",
    subject: "Математика",
    teacherId: "alexey-ivanov",
    teacherName: "Алексей Иванов",
    startAt: "2026-02-09T18:00:00+03:00",
    durationMinutes: 90,
    status: "upcoming",
    joinUrl: "/app/lessons/lesson-002",
    chatThreadId: "thread-alexey",
    summarySnippet: "Разобрали параметры в тригонометрических уравнениях.",
    transcriptSnippet: "Сначала выделяем область допустимых значений, затем анализируем параметр...",
    recommendations: ["Решить 6 задач уровня профиль", "Повторить формулы приведения"],
    files: [{ id: "f-003", name: "Разбор_варианта_17.pdf", size: "2.4 МБ" }]
  },
  {
    id: "lesson-003",
    courseId: "course-python-1",
    subject: "Программирование",
    teacherId: "maksim-volkov",
    teacherName: "Максим Волков",
    startAt: "2026-02-11T20:00:00+03:00",
    durationMinutes: 75,
    status: "upcoming",
    joinUrl: "/app/lessons/lesson-003",
    chatThreadId: "thread-maksim",
    summarySnippet: "Создали CLI-приложение и обсудили структуру модулей.",
    transcriptSnippet: "Декомпозируем задачу на функции и покрываем ключевые сценарии...",
    recommendations: ["Добавить обработку ошибок", "Подготовить pull request"],
    files: [{ id: "f-004", name: "Python_CLI_template.zip", size: "980 КБ" }]
  },
  {
    id: "lesson-004",
    courseId: "course-fr-1",
    subject: "Французский",
    teacherId: "yana-zorina",
    teacherName: "Яна Зорина",
    startAt: "2026-02-06T17:30:00+03:00",
    durationMinutes: 60,
    status: "completed",
    joinUrl: "/app/lessons/lesson-004",
    chatThreadId: "thread-yana",
    summarySnippet: "Тренировали письменную часть DELF B2: структура эссе.",
    transcriptSnippet: "Нужно четко выделять тезис, аргументы и контраргумент...",
    recommendations: ["Написать эссе на 220 слов", "Выучить 15 связок для аргументации"],
    files: [{ id: "f-005", name: "Template_DELF_B2.pdf", size: "650 КБ" }]
  },
  {
    id: "lesson-005",
    courseId: "course-phys-1",
    subject: "Физика",
    teacherId: "timur-safonov",
    teacherName: "Тимур Сафонов",
    startAt: "2026-02-05T19:00:00+03:00",
    durationMinutes: 80,
    status: "completed",
    joinUrl: "/app/lessons/lesson-005",
    chatThreadId: "thread-timur",
    summarySnippet: "Разобрали задачи на импульс и законы сохранения.",
    transcriptSnippet: "Перед расчетом важно выбрать систему отсчета и обозначить оси...",
    recommendations: ["Пройти тест по теме импульс", "Повторить формулы механики"],
    files: [{ id: "f-006", name: "Physics_Worksheet_05_02.pdf", size: "1.1 МБ" }]
  },
  {
    id: "lesson-006",
    courseId: "course-rus-1",
    subject: "Русский язык",
    teacherId: "irina-petrova",
    teacherName: "Ирина Петрова",
    startAt: "2026-02-03T18:30:00+03:00",
    durationMinutes: 60,
    status: "completed",
    joinUrl: "/app/lessons/lesson-006",
    chatThreadId: "thread-irina",
    summarySnippet: "Отработали связки и аргументацию для сочинения.",
    transcriptSnippet: "Для сильного сочинения важны логические мостики между абзацами...",
    recommendations: ["Написать новый тезис и аргумент", "Проверить пунктуацию в вводных конструкциях"],
    files: [{ id: "f-007", name: "Essay_feedback.pdf", size: "560 КБ" }]
  }
];

export const upcomingLessons = lessons.filter((lesson) => lesson.status === "upcoming");
export const pastLessons = lessons.filter((lesson) => lesson.status === "completed");

export function getLessonById(id: string) {
  return lessons.find((lesson) => lesson.id === id);
}

export function isLessonStartingSoon(lesson: StudentLesson, now = new Date()) {
  const start = new Date(lesson.startAt).getTime();
  const diffMinutes = (start - now.getTime()) / 60000;
  return lesson.status === "upcoming" && diffMinutes >= 0 && diffMinutes <= 15;
}
