export type VocabularyReviewGrade = "again" | "hard" | "good" | "easy";

export type VocabularyFolder = {
  id: string;
  title: string;
  description: string;
  colorClass: string;
  dailyGoal: number;
  createdAt: string;
};

export type VocabularyWord = {
  id: string;
  word: string;
  translation: string;
  context: string;
  tags: string[];
  addedAt: string;
  lessonId?: string;
  folderId: string;
  isFavorite: boolean;
  review: {
    stage: number;
    successStreak: number;
    lapses: number;
    intervalDays: number;
    nextReviewAt: string;
    lastReviewedAt?: string;
  };
};

export const vocabularyFolders: VocabularyFolder[] = [
  {
    id: "folder-exam",
    title: "Экзамен",
    description: "Ключевые слова для подготовки к тестам и письменным заданиям.",
    colorClass: "bg-primary/10 text-primary border-primary/30",
    dailyGoal: 18,
    createdAt: "2026-01-20"
  },
  {
    id: "folder-speaking",
    title: "Разговор",
    description: "Лексика для устной практики и онлайн-занятий.",
    colorClass: "bg-accent/35 text-slate-900 border-accent/80",
    dailyGoal: 15,
    createdAt: "2026-01-25"
  },
  {
    id: "folder-work",
    title: "Работа и карьера",
    description: "Слова для интервью, переписки и деловых встреч.",
    colorClass: "bg-slate-100 text-slate-700 border-slate-300",
    dailyGoal: 12,
    createdAt: "2026-01-30"
  }
];

export const vocabularyWords: VocabularyWord[] = [
  {
    id: "voc-001",
    word: "sustainable",
    translation: "устойчивый, долгосрочный",
    context: "We need a sustainable learning routine to keep progress.",
    tags: ["Английский", "Работа"],
    addedAt: "2026-02-06",
    lessonId: "lesson-001",
    folderId: "folder-work",
    isFavorite: true,
    review: {
      stage: 3,
      successStreak: 4,
      lapses: 1,
      intervalDays: 5,
      nextReviewAt: "2026-02-08T09:00:00+03:00",
      lastReviewedAt: "2026-02-03T10:00:00+03:00"
    }
  },
  {
    id: "voc-002",
    word: "argumentation",
    translation: "аргументация",
    context: "Strong argumentation improves essay quality.",
    tags: ["Русский язык", "Экзамен"],
    addedAt: "2026-02-05",
    lessonId: "lesson-006",
    folderId: "folder-exam",
    isFavorite: false,
    review: {
      stage: 2,
      successStreak: 2,
      lapses: 0,
      intervalDays: 3,
      nextReviewAt: "2026-02-08T11:00:00+03:00",
      lastReviewedAt: "2026-02-05T08:40:00+03:00"
    }
  },
  {
    id: "voc-003",
    word: "debug",
    translation: "отлаживать",
    context: "First, debug the function before optimization.",
    tags: ["Программирование", "Python"],
    addedAt: "2026-02-07",
    lessonId: "lesson-003",
    folderId: "folder-work",
    isFavorite: true,
    review: {
      stage: 1,
      successStreak: 1,
      lapses: 1,
      intervalDays: 1,
      nextReviewAt: "2026-02-08T16:00:00+03:00",
      lastReviewedAt: "2026-02-07T16:00:00+03:00"
    }
  },
  {
    id: "voc-004",
    word: "momentum",
    translation: "импульс",
    context: "Momentum is conserved in a closed system.",
    tags: ["Физика", "Теория"],
    addedAt: "2026-02-04",
    lessonId: "lesson-005",
    folderId: "folder-exam",
    isFavorite: false,
    review: {
      stage: 4,
      successStreak: 6,
      lapses: 1,
      intervalDays: 7,
      nextReviewAt: "2026-02-11T09:30:00+03:00",
      lastReviewedAt: "2026-02-04T09:30:00+03:00"
    }
  },
  {
    id: "voc-005",
    word: "cohérence",
    translation: "связность",
    context: "La cohérence du texte est essentielle pour le DELF.",
    tags: ["Французский", "DELF"],
    addedAt: "2026-02-03",
    lessonId: "lesson-004",
    folderId: "folder-exam",
    isFavorite: false,
    review: {
      stage: 2,
      successStreak: 3,
      lapses: 2,
      intervalDays: 2,
      nextReviewAt: "2026-02-08T07:15:00+03:00",
      lastReviewedAt: "2026-02-06T07:15:00+03:00"
    }
  },
  {
    id: "voc-006",
    word: "deadline",
    translation: "крайний срок",
    context: "Set a clear deadline for each homework task.",
    tags: ["Английский", "Планирование"],
    addedAt: "2026-02-02",
    folderId: "folder-work",
    isFavorite: true,
    review: {
      stage: 3,
      successStreak: 5,
      lapses: 0,
      intervalDays: 6,
      nextReviewAt: "2026-02-10T12:00:00+03:00",
      lastReviewedAt: "2026-02-04T12:00:00+03:00"
    }
  },
  {
    id: "voc-007",
    word: "analyse",
    translation: "анализировать",
    context: "Nous allons analyser les erreurs fréquentes.",
    tags: ["Французский", "Практика"],
    addedAt: "2026-01-31",
    folderId: "folder-speaking",
    isFavorite: false,
    review: {
      stage: 1,
      successStreak: 1,
      lapses: 0,
      intervalDays: 1,
      nextReviewAt: "2026-02-08T14:00:00+03:00",
      lastReviewedAt: "2026-02-07T14:00:00+03:00"
    }
  },
  {
    id: "voc-008",
    word: "negotiate",
    translation: "вести переговоры",
    context: "She can negotiate terms with confidence.",
    tags: ["Английский", "Разговор"],
    addedAt: "2026-02-01",
    folderId: "folder-speaking",
    isFavorite: false,
    review: {
      stage: 0,
      successStreak: 0,
      lapses: 0,
      intervalDays: 0,
      nextReviewAt: "2026-02-08T18:00:00+03:00"
    }
  }
];

export const vocabularyTags = Array.from(new Set(vocabularyWords.flatMap((item) => item.tags))).sort((a, b) =>
  a.localeCompare(b, "ru")
);
