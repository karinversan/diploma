export type HomeworkStatus = "new" | "in_progress" | "submitted" | "graded";

export type HomeworkItem = {
  id: string;
  title: string;
  subject: string;
  lessonId: string;
  courseId: string;
  dueDate: string;
  status: HomeworkStatus;
  description: string;
  maxScore?: number;
  score?: number;
};

export const homeworkItems: HomeworkItem[] = [
  {
    id: "hw-001",
    title: "Сочинение: аргументация позиции",
    subject: "Русский язык",
    lessonId: "lesson-006",
    courseId: "course-rus-1",
    dueDate: "2026-02-09",
    status: "new",
    description: "Напишите сочинение на 220–250 слов с тезисом и двумя аргументами.",
    maxScore: 20
  },
  {
    id: "hw-002",
    title: "Тренировочный вариант №18",
    subject: "Математика",
    lessonId: "lesson-002",
    courseId: "course-math-1",
    dueDate: "2026-02-10",
    status: "in_progress",
    description: "Решите задания 1–14 профильного уровня и подготовьте вопросы по сложным пунктам.",
    maxScore: 34
  },
  {
    id: "hw-003",
    title: "Разговорный блок: Daily Routines",
    subject: "Английский",
    lessonId: "lesson-001",
    courseId: "course-eng-1",
    dueDate: "2026-02-08",
    status: "submitted",
    description: "Запишите аудио на 2 минуты и составьте список новых выражений.",
    maxScore: 15
  },
  {
    id: "hw-004",
    title: "Мини-проект: CLI калькулятор",
    subject: "Программирование",
    lessonId: "lesson-003",
    courseId: "course-python-1",
    dueDate: "2026-02-12",
    status: "in_progress",
    description: "Добавьте историю вычислений и обработку некорректного ввода.",
    maxScore: 25
  },
  {
    id: "hw-005",
    title: "Эссе DELF B2",
    subject: "Французский",
    lessonId: "lesson-004",
    courseId: "course-fr-1",
    dueDate: "2026-02-07",
    status: "graded",
    description: "Подготовьте эссе с аргументацией и выводом по структуре экзамена.",
    maxScore: 20,
    score: 17
  },
  {
    id: "hw-006",
    title: "Задачи на импульс",
    subject: "Физика",
    lessonId: "lesson-005",
    courseId: "course-phys-1",
    dueDate: "2026-02-07",
    status: "graded",
    description: "Решите 8 задач на законы сохранения импульса с пояснением хода решения.",
    maxScore: 16,
    score: 14
  }
];
