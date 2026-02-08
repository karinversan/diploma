export type HomeworkStatus = "new" | "in_progress" | "submitted" | "graded";

export type HomeworkAssignmentType = "quiz" | "skill_drill" | "essay" | "audio_response" | "project";
export type HomeworkCheckMode = "auto" | "ai_teacher";

export type HomeworkAutoExercise =
  | {
      id: string;
      kind: "single_choice";
      prompt: string;
      options: string[];
      correctOptionIndex: number;
      explanation: string;
      points: number;
    }
  | {
      id: string;
      kind: "fill_blank";
      prompt: string;
      placeholder: string;
      correctAnswers: string[];
      explanation: string;
      points: number;
      hint?: string;
    }
  | {
      id: string;
      kind: "reorder";
      prompt: string;
      tokens: string[];
      correctOrder: string[];
      explanation: string;
      points: number;
      hint?: string;
    };

export type HomeworkManualConfig = {
  deliverableLabel: string;
  deliverableHint: string;
  minWords?: number;
  minAudioMinutes?: number;
  rubric: Array<{
    id: string;
    title: string;
    description: string;
    weight: number;
  }>;
};

export type HomeworkItem = {
  id: string;
  title: string;
  subject: string;
  lessonId: string;
  courseId: string;
  dueDate: string;
  status: HomeworkStatus;
  description: string;
  assignmentType: HomeworkAssignmentType;
  checkMode: HomeworkCheckMode;
  maxScore?: number;
  score?: number;
  xpReward: number;
  estimatedMinutes: number;
  instructions: string[];
  aiPrecheckNote?: string;
  autoExercises?: HomeworkAutoExercise[];
  manualConfig?: HomeworkManualConfig;
};

export const homeworkAssignmentTypeLabels: Record<HomeworkAssignmentType, string> = {
  quiz: "Тест",
  skill_drill: "Тренажер",
  essay: "Эссе",
  audio_response: "Аудио-ответ",
  project: "Практический проект"
};

export const homeworkCheckModeLabels: Record<HomeworkCheckMode, string> = {
  auto: "Автопроверка",
  ai_teacher: "ИИ + преподаватель"
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
    assignmentType: "essay",
    checkMode: "ai_teacher",
    maxScore: 20,
    xpReward: 90,
    estimatedMinutes: 55,
    instructions: [
      "Сформулируйте тезис и 2 аргумента.",
      "Добавьте контраргумент и вывод.",
      "Проверьте орфографию и связность текста."
    ],
    aiPrecheckNote: "ИИ проверит структуру, повторы и речевые ошибки до финальной оценки преподавателя.",
    manualConfig: {
      deliverableLabel: "Текст эссе",
      deliverableHint: "Вставьте текст в поле ниже. Можно добавить план в начале.",
      minWords: 220,
      rubric: [
        { id: "argument", title: "Аргументация", description: "Логика тезиса и доказательная база", weight: 40 },
        { id: "structure", title: "Структура", description: "Вступление, основная часть, вывод", weight: 30 },
        { id: "language", title: "Язык", description: "Грамотность и стиль", weight: 30 }
      ]
    }
  },
  {
    id: "hw-002",
    title: "Алгебра: мини-тест + быстрые упражнения",
    subject: "Математика",
    lessonId: "lesson-002",
    courseId: "course-math-1",
    dueDate: "2026-02-10",
    status: "in_progress",
    description: "Короткие задания в формате тренажера: тест, пропуски, порядок шагов.",
    assignmentType: "quiz",
    checkMode: "auto",
    maxScore: 24,
    xpReward: 70,
    estimatedMinutes: 20,
    instructions: [
      "Решите все задания подряд.",
      "Получите мгновенную проверку и разбор ошибок.",
      "Перезапустите попытку для улучшения результата."
    ],
    autoExercises: [
      {
        id: "math-q1",
        kind: "single_choice",
        prompt: "Решите уравнение: 3x + 9 = 24",
        options: ["x = 3", "x = 5", "x = 8", "x = 11"],
        correctOptionIndex: 1,
        explanation: "3x = 15, значит x = 5.",
        points: 8
      },
      {
        id: "math-q2",
        kind: "fill_blank",
        prompt: "Заполните пропуск: 2(x + 4) = 2x + __",
        placeholder: "Введите число",
        correctAnswers: ["8"],
        explanation: "Распределяем множитель: 2 * 4 = 8.",
        points: 8,
        hint: "Используйте правило раскрытия скобок."
      },
      {
        id: "math-q3",
        kind: "reorder",
        prompt: "Расположите шаги решения уравнения 2x - 6 = 10 в правильном порядке:",
        tokens: ["x = 8", "2x = 16", "2x - 6 = 10", "x = 16"],
        correctOrder: ["2x - 6 = 10", "2x = 16", "x = 8"],
        explanation: "Сначала переносим -6, затем делим обе части на 2.",
        points: 8
      }
    ]
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
    assignmentType: "audio_response",
    checkMode: "ai_teacher",
    maxScore: 15,
    xpReward: 65,
    estimatedMinutes: 25,
    instructions: [
      "Запишите монолог на тему Daily Routine (2 минуты).",
      "Используйте минимум 8 новых выражений.",
      "Добавьте короткий текстовый план выступления."
    ],
    aiPrecheckNote: "ИИ проверит произношение, темп и частые языковые ошибки. Итоговый балл выставляет преподаватель.",
    manualConfig: {
      deliverableLabel: "Аудио-ответ и заметки",
      deliverableHint: "Вставьте ссылку на запись или прикрепите файл (демо), затем добавьте текст заметок.",
      minAudioMinutes: 2,
      rubric: [
        { id: "fluency", title: "Беглость речи", description: "Темп и естественность", weight: 35 },
        { id: "accuracy", title: "Точность", description: "Грамматика и словоупотребление", weight: 35 },
        { id: "task", title: "Полнота задания", description: "Раскрытие темы и структура", weight: 30 }
      ]
    }
  },
  {
    id: "hw-004",
    title: "Спринт Python: типовые ошибки",
    subject: "Программирование",
    lessonId: "lesson-003",
    courseId: "course-python-1",
    dueDate: "2026-02-12",
    status: "in_progress",
    description: "Серия коротких заданий как в языковых тренажерах: быстрое решение и мгновенный фидбек.",
    assignmentType: "skill_drill",
    checkMode: "auto",
    maxScore: 30,
    xpReward: 80,
    estimatedMinutes: 25,
    instructions: [
      "Проходите задания по шагам, как мини-уровни.",
      "После каждого шага сверяйтесь с подсказкой.",
      "Добейтесь результата 80%+ для закрытия темы."
    ],
    autoExercises: [
      {
        id: "py-q1",
        kind: "single_choice",
        prompt: "Что вернет выражение len('skill')?",
        options: ["4", "5", "6", "Ошибка"],
        correctOptionIndex: 1,
        explanation: "В слове skill пять букв: s-k-i-l-l.",
        points: 10
      },
      {
        id: "py-q2",
        kind: "fill_blank",
        prompt: "Допишите функцию: def square(x): return __",
        placeholder: "Введите выражение",
        correctAnswers: ["x * x", "x*x", "x ** 2", "x**2"],
        explanation: "Квадрат числа можно записать как x*x или x**2.",
        points: 10
      },
      {
        id: "py-q3",
        kind: "reorder",
        prompt: "Соберите корректный порядок для цикла вывода чисел 1..3:",
        tokens: ["for i in range(1, 4):", "print(i)", "range(1, 4)", "for"],
        correctOrder: ["for i in range(1, 4):", "print(i)"],
        explanation: "Нужны только две строки: заголовок цикла и тело с print.",
        points: 10
      }
    ]
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
    assignmentType: "essay",
    checkMode: "ai_teacher",
    maxScore: 20,
    score: 17,
    xpReward: 95,
    estimatedMinutes: 60,
    instructions: [
      "Соблюдайте структуру DELF B2.",
      "Используйте связки для логических переходов.",
      "Проверьте согласование времен."
    ],
    aiPrecheckNote: "ИИ выделил повторяющиеся конструкции и подсказал, как улучшить стиль.",
    manualConfig: {
      deliverableLabel: "Текст эссе",
      deliverableHint: "Вставьте финальную версию текста.",
      minWords: 220,
      rubric: [
        { id: "task", title: "Соответствие теме", description: "Полнота раскрытия задания", weight: 35 },
        { id: "coherence", title: "Связность", description: "Логика и структура текста", weight: 35 },
        { id: "lexic", title: "Лексика и грамматика", description: "Точность и разнообразие языка", weight: 30 }
      ]
    }
  },
  {
    id: "hw-006",
    title: "Физика: тест по импульсу",
    subject: "Физика",
    lessonId: "lesson-005",
    courseId: "course-phys-1",
    dueDate: "2026-02-07",
    status: "graded",
    description: "Короткий тест по законам сохранения импульса.",
    assignmentType: "quiz",
    checkMode: "auto",
    maxScore: 16,
    score: 14,
    xpReward: 55,
    estimatedMinutes: 15,
    instructions: [
      "Ответьте на все вопросы теста.",
      "Проверьте объяснения по неверным ответам.",
      "Повторите темы с низким баллом."
    ],
    autoExercises: [
      {
        id: "phys-q1",
        kind: "single_choice",
        prompt: "Импульс тела рассчитывается по формуле:",
        options: ["p = mv", "p = ma", "p = m/v", "p = v/m"],
        correctOptionIndex: 0,
        explanation: "Импульс p равен произведению массы на скорость.",
        points: 8
      },
      {
        id: "phys-q2",
        kind: "fill_blank",
        prompt: "В замкнутой системе суммарный импульс ___",
        placeholder: "Введите слово",
        correctAnswers: ["сохраняется", "постоянен"],
        explanation: "Это формулировка закона сохранения импульса.",
        points: 8
      }
    ]
  }
];

export function getHomeworkById(id: string) {
  return homeworkItems.find((item) => item.id === id);
}

export function isHomeworkAutoChecked(item: HomeworkItem) {
  return item.checkMode === "auto";
}
