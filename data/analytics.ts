export type AnalyticsMetric = {
  id: string;
  label: string;
  value: string;
  delta: string;
};

export type WeeklyProgressPoint = {
  week: string;
  hours: number;
};

export type TrendPoint = {
  label: string;
  hours: number;
  lessons: number;
  accuracy: number;
};

export type SubjectProgress = {
  subject: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  averageScore: number;
};

export type FocusArea = {
  id: string;
  title: string;
  errorRate: number;
  recommendation: string;
};

export type MonthlyGoal = {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
};

export type Achievement = {
  id: string;
  title: string;
  date: string;
  description: string;
};

export const dashboardMetrics: AnalyticsMetric[] = [
  { id: "courses", label: "Всего курсов", value: "12", delta: "+2 за месяц" },
  { id: "hours", label: "Всего часов", value: "94", delta: "+7 за неделю" },
  { id: "lessons", label: "Пройдено уроков", value: "38", delta: "+3 за 7 дней" },
  { id: "progress", label: "Средний прогресс", value: "67%", delta: "+5% за месяц" }
];

export const weeklyProgress: WeeklyProgressPoint[] = [
  { week: "Нед 1", hours: 4 },
  { week: "Нед 2", hours: 6 },
  { week: "Нед 3", hours: 5 },
  { week: "Нед 4", hours: 7 },
  { week: "Нед 5", hours: 8 }
];

export const learningTrendByPeriod: Record<"week" | "month" | "quarter", TrendPoint[]> = {
  week: [
    { label: "Пн", hours: 1.2, lessons: 1, accuracy: 78 },
    { label: "Вт", hours: 1.8, lessons: 1, accuracy: 81 },
    { label: "Ср", hours: 0.8, lessons: 1, accuracy: 76 },
    { label: "Чт", hours: 2.1, lessons: 2, accuracy: 84 },
    { label: "Пт", hours: 1.6, lessons: 1, accuracy: 82 },
    { label: "Сб", hours: 2.4, lessons: 2, accuracy: 86 },
    { label: "Вс", hours: 1.3, lessons: 1, accuracy: 80 }
  ],
  month: [
    { label: "Нед 1", hours: 6, lessons: 3, accuracy: 79 },
    { label: "Нед 2", hours: 8, lessons: 4, accuracy: 82 },
    { label: "Нед 3", hours: 7, lessons: 3, accuracy: 84 },
    { label: "Нед 4", hours: 9, lessons: 4, accuracy: 86 }
  ],
  quarter: [
    { label: "Дек", hours: 24, lessons: 11, accuracy: 77 },
    { label: "Янв", hours: 29, lessons: 14, accuracy: 82 },
    { label: "Фев", hours: 31, lessons: 15, accuracy: 86 }
  ]
};

export const subjectProgress: SubjectProgress[] = [
  { subject: "Английский", progress: 74, completedLessons: 18, totalLessons: 24, averageScore: 86 },
  { subject: "Математика", progress: 61, completedLessons: 11, totalLessons: 18, averageScore: 79 },
  { subject: "Программирование", progress: 38, completedLessons: 5, totalLessons: 13, averageScore: 72 },
  { subject: "Французский", progress: 58, completedLessons: 7, totalLessons: 12, averageScore: 81 }
];

export const focusAreas: FocusArea[] = [
  {
    id: "focus-1",
    title: "Вопросительные конструкции (английский)",
    errorRate: 28,
    recommendation: "Сделайте тренажер на 20 вопросов и повторите вспомогательные глаголы."
  },
  {
    id: "focus-2",
    title: "Параметры в тригонометрии",
    errorRate: 33,
    recommendation: "Разберите 5 типовых задач с полным оформлением решения."
  },
  {
    id: "focus-3",
    title: "Декомпозиция задач в Python",
    errorRate: 24,
    recommendation: "Перед кодом составляйте план из 4–6 функций и тестируйте по шагам."
  }
];

export const monthlyGoals: MonthlyGoal[] = [
  {
    id: "goal-1",
    title: "Учебные часы за месяц",
    current: 31,
    target: 36,
    unit: "ч"
  },
  {
    id: "goal-2",
    title: "Выполненные домашние задания",
    current: 14,
    target: 16,
    unit: "шт"
  },
  {
    id: "goal-3",
    title: "Новые слова в словаре",
    current: 47,
    target: 60,
    unit: "слов"
  }
];

export const achievementTimeline: Achievement[] = [
  {
    id: "ach-1",
    title: "Серия занятий 12 дней",
    date: "2026-02-08",
    description: "Вы поддерживаете стабильный ритм обучения без пропусков."
  },
  {
    id: "ach-2",
    title: "Точность в английском +8%",
    date: "2026-02-03",
    description: "По итогам последних 4 уроков выросла точность использования времен."
  },
  {
    id: "ach-3",
    title: "10 уроков по математике",
    date: "2026-01-28",
    description: "Закрыт базовый блок тем перед переходом к сложным задачам."
  }
];

export const aiInsights = {
  latestLessonId: "lesson-001",
  summary:
    "На последнем уроке вы улучшили точность использования времен в речи. Самый заметный прогресс — в вопросительных конструкциях.",
  frequentMistakes: [
    "Пропуск вспомогательных глаголов в вопросах",
    "Смешение времен в длинных ответах",
    "Недостаточно связок в устной речи"
  ],
  recommendedTasks: [
    "Тренажер: 20 вопросов на Present Perfect",
    "Мини-диалог на 3 минуты с новыми выражениями",
    "Карточки слов из последнего урока"
  ]
};
