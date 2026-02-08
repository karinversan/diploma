export type VocabularyWord = {
  id: string;
  word: string;
  translation: string;
  context: string;
  tags: string[];
  addedAt: string;
  lessonId?: string;
  isFavorite: boolean;
};

export const vocabularyWords: VocabularyWord[] = [
  {
    id: "voc-001",
    word: "sustainable",
    translation: "устойчивый, долгосрочный",
    context: "We need a sustainable learning routine to keep progress.",
    tags: ["Английский", "Работа"],
    addedAt: "2026-02-06",
    lessonId: "lesson-001",
    isFavorite: true
  },
  {
    id: "voc-002",
    word: "argumentation",
    translation: "аргументация",
    context: "Strong argumentation improves essay quality.",
    tags: ["Русский язык", "Экзамен"],
    addedAt: "2026-02-05",
    lessonId: "lesson-006",
    isFavorite: false
  },
  {
    id: "voc-003",
    word: "debug",
    translation: "отлаживать",
    context: "First, debug the function before optimization.",
    tags: ["Программирование", "Python"],
    addedAt: "2026-02-07",
    lessonId: "lesson-003",
    isFavorite: true
  },
  {
    id: "voc-004",
    word: "momentum",
    translation: "импульс",
    context: "Momentum is conserved in a closed system.",
    tags: ["Физика", "Теория"],
    addedAt: "2026-02-04",
    lessonId: "lesson-005",
    isFavorite: false
  },
  {
    id: "voc-005",
    word: "cohérence",
    translation: "связность",
    context: "La cohérence du texte est essentielle pour le DELF.",
    tags: ["Французский", "DELF"],
    addedAt: "2026-02-03",
    lessonId: "lesson-004",
    isFavorite: false
  },
  {
    id: "voc-006",
    word: "deadline",
    translation: "крайний срок",
    context: "Set a clear deadline for each homework task.",
    tags: ["Английский", "Планирование"],
    addedAt: "2026-02-02",
    isFavorite: true
  },
  {
    id: "voc-007",
    word: "analyse",
    translation: "анализировать",
    context: "Nous allons analyser les erreurs fréquentes.",
    tags: ["Французский", "Практика"],
    addedAt: "2026-01-31",
    isFavorite: false
  }
];

export const vocabularyTags = Array.from(new Set(vocabularyWords.flatMap((item) => item.tags))).sort((a, b) =>
  a.localeCompare(b, "ru")
);
