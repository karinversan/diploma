export type CourseLevel = "Начинающий" | "Средний" | "Продвинутый" | "Эксперт";
export type CourseFormat = "Видеоуроки" | "Вебинары/живые занятия" | "Интерактивные занятия" | "Практика";
export type CourseAccessType = "По запросу" | "По расписанию";

export type StudentCourse = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: CourseLevel;
  format: CourseFormat;
  durationHours: number;
  lessonsTotal: number;
  lessonsCompleted: number;
  teacherId: string;
  teacherName: string;
  imageUrl: string;
  accessType: CourseAccessType;
  certificateAvailable: boolean;
  isFeatured?: boolean;
};

export const courseCategories = ["Все", "Языки", "Программирование", "Бизнес", "Дизайн", "Математика"];

export const courses: StudentCourse[] = [
  {
    id: "course-eng-1",
    title: "Английский для уверенного общения",
    description: "Разговорная практика, аудирование и словарь для повседневных и рабочих ситуаций.",
    category: "Языки",
    level: "Средний",
    format: "Интерактивные занятия",
    durationHours: 32,
    lessonsTotal: 16,
    lessonsCompleted: 9,
    teacherId: "natalya-smirnova",
    teacherName: "Наталья Смирнова",
    imageUrl: "/classroom-preview.svg",
    accessType: "По расписанию",
    certificateAvailable: true,
    isFeatured: true
  },
  {
    id: "course-math-1",
    title: "Математика: подготовка к ЕГЭ",
    description: "Пошаговый разбор типовых задач и стратегия выполнения сложных вариантов.",
    category: "Математика",
    level: "Продвинутый",
    format: "Практика",
    durationHours: 48,
    lessonsTotal: 24,
    lessonsCompleted: 11,
    teacherId: "alexey-ivanov",
    teacherName: "Алексей Иванов",
    imageUrl: "/classroom-preview.svg",
    accessType: "По расписанию",
    certificateAvailable: true
  },
  {
    id: "course-python-1",
    title: "Python для старта в разработке",
    description: "Основы языка, алгоритмы и мини-проекты для портфолио.",
    category: "Программирование",
    level: "Начинающий",
    format: "Видеоуроки",
    durationHours: 28,
    lessonsTotal: 20,
    lessonsCompleted: 5,
    teacherId: "maksim-volkov",
    teacherName: "Максим Волков",
    imageUrl: "/classroom-preview.svg",
    accessType: "По запросу",
    certificateAvailable: true
  },
  {
    id: "course-rus-1",
    title: "Русский язык: сочинение и аргументация",
    description: "Структура, тезисы и работа с критериями оценки письменной части.",
    category: "Языки",
    level: "Средний",
    format: "Вебинары/живые занятия",
    durationHours: 22,
    lessonsTotal: 12,
    lessonsCompleted: 7,
    teacherId: "irina-petrova",
    teacherName: "Ирина Петрова",
    imageUrl: "/classroom-preview.svg",
    accessType: "По расписанию",
    certificateAvailable: false
  },
  {
    id: "course-bio-1",
    title: "Биология для поступления",
    description: "Теория + тестовые задания в формате вступительных испытаний.",
    category: "Математика",
    level: "Продвинутый",
    format: "Практика",
    durationHours: 36,
    lessonsTotal: 18,
    lessonsCompleted: 6,
    teacherId: "dmitry-kolesov",
    teacherName: "Дмитрий Колесов",
    imageUrl: "/classroom-preview.svg",
    accessType: "По расписанию",
    certificateAvailable: true
  },
  {
    id: "course-business-1",
    title: "Английский для работы и интервью",
    description: "Деловая переписка, созвоны, самопрезентация и фидбек по речи.",
    category: "Бизнес",
    level: "Продвинутый",
    format: "Интерактивные занятия",
    durationHours: 30,
    lessonsTotal: 15,
    lessonsCompleted: 4,
    teacherId: "natalya-smirnova",
    teacherName: "Наталья Смирнова",
    imageUrl: "/classroom-preview.svg",
    accessType: "По расписанию",
    certificateAvailable: true,
    isFeatured: true
  },
  {
    id: "course-design-1",
    title: "Визуальная подача учебных проектов",
    description: "Как оформлять презентации, заметки и конспекты для лучшего запоминания.",
    category: "Дизайн",
    level: "Начинающий",
    format: "Видеоуроки",
    durationHours: 14,
    lessonsTotal: 10,
    lessonsCompleted: 2,
    teacherId: "timur-safonov",
    teacherName: "Тимур Сафонов",
    imageUrl: "/classroom-preview.svg",
    accessType: "По запросу",
    certificateAvailable: false
  },
  {
    id: "course-phys-1",
    title: "Физика через практические задачи",
    description: "От базовых формул к комплексным заданиям с разбором типичных ошибок.",
    category: "Математика",
    level: "Средний",
    format: "Практика",
    durationHours: 40,
    lessonsTotal: 20,
    lessonsCompleted: 8,
    teacherId: "timur-safonov",
    teacherName: "Тимур Сафонов",
    imageUrl: "/classroom-preview.svg",
    accessType: "По расписанию",
    certificateAvailable: true
  },
  {
    id: "course-fr-1",
    title: "Французский для учебы за рубежом",
    description: "Подготовка к DELF и развитие академического письма.",
    category: "Языки",
    level: "Эксперт",
    format: "Вебинары/живые занятия",
    durationHours: 44,
    lessonsTotal: 22,
    lessonsCompleted: 13,
    teacherId: "yana-zorina",
    teacherName: "Яна Зорина",
    imageUrl: "/classroom-preview.svg",
    accessType: "По расписанию",
    certificateAvailable: true
  },
  {
    id: "course-de-1",
    title: "Немецкий: разговорный интенсив",
    description: "Ускоренный трек для переезда и рабочих коммуникаций.",
    category: "Языки",
    level: "Средний",
    format: "Интерактивные занятия",
    durationHours: 24,
    lessonsTotal: 12,
    lessonsCompleted: 3,
    teacherId: "svetlana-orlova",
    teacherName: "Светлана Орлова",
    imageUrl: "/classroom-preview.svg",
    accessType: "По расписанию",
    certificateAvailable: false
  },
  {
    id: "course-hist-1",
    title: "История и обществознание: системная подготовка",
    description: "Карта тем, аргументация и тренировка письменных ответов.",
    category: "Бизнес",
    level: "Продвинутый",
    format: "Практика",
    durationHours: 34,
    lessonsTotal: 17,
    lessonsCompleted: 10,
    teacherId: "viktor-sergeev",
    teacherName: "Виктор Сергеев",
    imageUrl: "/classroom-preview.svg",
    accessType: "По расписанию",
    certificateAvailable: true
  },
  {
    id: "course-kids-math-1",
    title: "Математика без страха для младших классов",
    description: "Игровые задания и короткие уроки для устойчивого прогресса.",
    category: "Математика",
    level: "Начинающий",
    format: "Интерактивные занятия",
    durationHours: 18,
    lessonsTotal: 12,
    lessonsCompleted: 6,
    teacherId: "kirill-andreev",
    teacherName: "Кирилл Андреев",
    imageUrl: "/classroom-preview.svg",
    accessType: "По расписанию",
    certificateAvailable: false
  }
];

export function getCourseById(id: string) {
  return courses.find((course) => course.id === id);
}

export function getCourseProgressPercent(course: StudentCourse) {
  if (course.lessonsTotal <= 0) {
    return 0;
  }

  return Math.round((course.lessonsCompleted / course.lessonsTotal) * 100);
}

export type CourseUnitKind = "Видео" | "Чтение" | "Практика" | "Тест" | "Созвон" | "Проект";

export type CourseLessonUnit = {
  id: string;
  title: string;
  description: string;
  kind: CourseUnitKind;
  durationMinutes: number;
  hasAutoCheck?: boolean;
  hasTeacherReview?: boolean;
  isPreview?: boolean;
};

export type CourseModulePlan = {
  id: string;
  title: string;
  week: number;
  goal: string;
  lessons: CourseLessonUnit[];
  checkpoint: {
    title: string;
    passScore: number;
    mode: "Автопроверка" | "Проверка преподавателем";
  };
};

export type CourseRoadmapMilestone = {
  id: string;
  week: number;
  title: string;
  description: string;
};

export type CourseRoadmap = {
  totalWeeks: number;
  hoursPerWeek: number;
  targetResult: string;
  certificateConditions: string[];
  milestones: CourseRoadmapMilestone[];
  weeklyPlan: Array<{
    id: string;
    dayLabel: string;
    action: string;
  }>;
};

export type CourseFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type CourseSyllabus = {
  skills: string[];
  outcomes: string[];
  prerequisites: string[];
  modules: CourseModulePlan[];
  roadmap: CourseRoadmap;
  faq: CourseFaqItem[];
};

export type CourseFlattenedUnit = CourseLessonUnit & {
  moduleId: string;
  moduleTitle: string;
  moduleWeek: number;
  order: number;
};

const syllabusCache = new Map<string, CourseSyllabus>();

const categoryTopics: Record<string, string[]> = {
  Языки: [
    "базовые конструкции",
    "разговорные шаблоны",
    "аудирование",
    "письмо и структура",
    "лексика по темам",
    "грамматические нюансы",
    "устная практика",
    "итоговая коммуникация"
  ],
  Программирование: [
    "основы синтаксиса",
    "структуры данных",
    "алгоритмическое мышление",
    "работа с ошибками",
    "практические задачи",
    "проектная архитектура",
    "рефакторинг",
    "финальный проект"
  ],
  Бизнес: [
    "бизнес-контекст",
    "анализ кейсов",
    "коммуникация",
    "управление задачами",
    "принятие решений",
    "финансовая логика",
    "презентация решений",
    "стратегия роста"
  ],
  Дизайн: [
    "визуальные принципы",
    "композиция",
    "типографика",
    "цвет и контраст",
    "пользовательские сценарии",
    "прототипирование",
    "UI-детали",
    "проектная защита"
  ],
  Математика: [
    "база и формулы",
    "типовые задачи",
    "повышенный уровень",
    "задачи с параметрами",
    "прикладные кейсы",
    "разбор ошибок",
    "экзаменационный формат",
    "контрольный блок"
  ]
};

const categorySkills: Record<string, string[]> = {
  Языки: ["Говорение", "Аудирование", "Письмо", "Словарь", "Грамматика"],
  Программирование: ["Алгоритмы", "Код-стиль", "Отладка", "Проектирование", "Тестирование"],
  Бизнес: ["Аналитика", "Коммуникация", "Стратегия", "Презентация", "Планирование"],
  Дизайн: ["Композиция", "Типографика", "UX-мышление", "Прототипы", "Презентация решений"],
  Математика: ["Логика", "Решение задач", "Проверка гипотез", "Скорость", "Точность"]
};

const levelPrerequisites: Record<CourseLevel, string[]> = {
  Начинающий: [
    "Достаточно базовой подготовки по предмету.",
    "Понадобится 3-4 часа в неделю на учебный ритм.",
    "Рекомендуется проходить модули по порядку."
  ],
  Средний: [
    "Нужны базовые знания и готовность к регулярной практике.",
    "Минимум 4 часа в неделю для закрепления.",
    "Желательно выполнить входной мини-тест."
  ],
  Продвинутый: [
    "Требуется уверенное владение базовыми темами.",
    "Рекомендуется 5-6 часов в неделю и выполнение всех тренажеров.",
    "Для созвонов желательно заранее готовить вопросы."
  ],
  Эксперт: [
    "Ожидается продвинутая подготовка и самостоятельная работа.",
    "Нужно не менее 6 часов в неделю.",
    "Важна готовность к проектным и экзаменационным заданиям."
  ]
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function distribute(total: number, buckets: number) {
  const base = Math.floor(total / buckets);
  const remainder = total % buckets;
  return Array.from({ length: buckets }, (_, index) => base + (index < remainder ? 1 : 0));
}

function getTopicsForCourse(course: StudentCourse) {
  return categoryTopics[course.category] ?? categoryTopics["Бизнес"];
}

function createModuleTitle(course: StudentCourse, topic: string, moduleIndex: number) {
  return `Модуль ${moduleIndex + 1}: ${topic[0].toUpperCase()}${topic.slice(1)} в курсе «${course.title}»`;
}

function createLessonTitle(kind: CourseUnitKind, topic: string, lessonNumber: number) {
  if (kind === "Видео") {
    return `Видео-урок ${lessonNumber}: ${topic}`;
  }
  if (kind === "Чтение") {
    return `Конспект и разбор: ${topic}`;
  }
  if (kind === "Практика") {
    return `Практика ${lessonNumber}: ${topic}`;
  }
  if (kind === "Тест") {
    return `Квиз ${lessonNumber}: проверка темы «${topic}»`;
  }
  if (kind === "Созвон") {
    return `Живой разбор с преподавателем: ${topic}`;
  }
  return `Мини-проект: ${topic}`;
}

function createLessonDescription(kind: CourseUnitKind, course: StudentCourse) {
  if (kind === "Видео") {
    return "Короткий структурированный урок с примерами и пояснениями.";
  }
  if (kind === "Чтение") {
    return "Конспект, схема и чек-лист по теме для повторения.";
  }
  if (kind === "Практика") {
    return "Интерактивные упражнения в стиле тренажера с моментальным фидбеком.";
  }
  if (kind === "Тест") {
    return "Тест с автопроверкой, объяснениями ошибок и рекомендациями.";
  }
  if (kind === "Созвон") {
    return "Онлайн-занятие в классе платформы: разбор сложных вопросов и практика.";
  }
  return `Практическое задание по курсу «${course.title}» с результатом для портфолио.`;
}

function createLessonDuration(kind: CourseUnitKind) {
  if (kind === "Видео") {
    return 18;
  }
  if (kind === "Чтение") {
    return 14;
  }
  if (kind === "Практика") {
    return 25;
  }
  if (kind === "Тест") {
    return 16;
  }
  if (kind === "Созвон") {
    return 60;
  }
  return 45;
}

function createCourseModules(course: StudentCourse): CourseModulePlan[] {
  const moduleCount = clamp(Math.round(course.lessonsTotal / 4), 3, 8);
  const lessonsByModule = distribute(course.lessonsTotal, moduleCount);
  const topics = getTopicsForCourse(course);

  const livePattern: CourseUnitKind[] = ["Видео", "Практика", "Тест", "Созвон", "Практика", "Проект"];
  const asyncPattern: CourseUnitKind[] = ["Видео", "Чтение", "Практика", "Тест", "Практика", "Проект"];
  const pattern = course.accessType === "По расписанию" ? livePattern : asyncPattern;

  return lessonsByModule.map((lessonsInModule, moduleIndex) => {
    const moduleTopic = topics[moduleIndex % topics.length];
    const lessons = Array.from({ length: lessonsInModule }, (_, lessonIndex) => {
      const kind = pattern[lessonIndex % pattern.length];
      const order = moduleIndex * 10 + lessonIndex + 1;

      return {
        id: `${course.id}-m${moduleIndex + 1}-u${lessonIndex + 1}`,
        title: createLessonTitle(kind, moduleTopic, lessonIndex + 1),
        description: createLessonDescription(kind, course),
        kind,
        durationMinutes: createLessonDuration(kind),
        hasAutoCheck: kind === "Тест" || kind === "Практика",
        hasTeacherReview: kind === "Проект" || kind === "Созвон",
        isPreview: order <= 2
      } satisfies CourseLessonUnit;
    });

    return {
      id: `${course.id}-module-${moduleIndex + 1}`,
      title: createModuleTitle(course, moduleTopic, moduleIndex),
      week: moduleIndex + 1,
      goal: `Освоить тему «${moduleTopic}», закрепить на практике и пройти контрольную точку.`,
      lessons,
      checkpoint: {
        title: `Контрольная точка ${moduleIndex + 1}`,
        passScore: course.level === "Эксперт" ? 80 : course.level === "Продвинутый" ? 75 : 70,
        mode: lessons.some((lesson) => lesson.kind === "Проект" || lesson.kind === "Созвон")
          ? "Проверка преподавателем"
          : "Автопроверка"
      }
    };
  });
}

function createRoadmap(course: StudentCourse, modules: CourseModulePlan[]): CourseRoadmap {
  const totalWeeks = clamp(Math.round(course.durationHours / 4), 4, 16);
  const hoursPerWeek = clamp(Math.round(course.durationHours / totalWeeks), 3, 8);
  const quarter = Math.max(1, Math.floor(totalWeeks / 4));

  return {
    totalWeeks,
    hoursPerWeek,
    targetResult: `Закрыть программу курса «${course.title}», закрепить навыки и выйти на измеримый результат.`,
    certificateConditions: [
      "Пройти не менее 90% уроков программы.",
      "Закрыть все контрольные точки по модулям.",
      "Сдать финальную работу или итоговый тест.",
      "Поддерживать средний результат не ниже 70%."
    ],
    milestones: [
      {
        id: `${course.id}-ms-1`,
        week: 1,
        title: "Старт и диагностика",
        description: "Оценка уровня, вводный модуль и постановка индивидуальной цели."
      },
      {
        id: `${course.id}-ms-2`,
        week: quarter * 2,
        title: "Средний контроль",
        description: "Проверка динамики, корректировка темпа и усиление слабых зон."
      },
      {
        id: `${course.id}-ms-3`,
        week: quarter * 3,
        title: "Практический этап",
        description: "Фокус на прикладных заданиях, созвонах и полноценном закреплении."
      },
      {
        id: `${course.id}-ms-4`,
        week: totalWeeks,
        title: "Финал и сертификат",
        description: `Итоговая контрольная точка и завершение ${modules.length} модулей.`
      }
    ],
    weeklyPlan: [
      { id: `${course.id}-wp-1`, dayLabel: "Пн", action: "Видео + конспект (30-40 мин)" },
      { id: `${course.id}-wp-2`, dayLabel: "Ср", action: "Практика/тренажер (40-60 мин)" },
      { id: `${course.id}-wp-3`, dayLabel: "Пт", action: "Тест + разбор ошибок (30-45 мин)" },
      {
        id: `${course.id}-wp-4`,
        dayLabel: "Сб",
        action: course.accessType === "По расписанию" ? "Живой урок с преподавателем (60 мин)" : "Проектный блок (45-60 мин)"
      }
    ]
  };
}

function createFaq(course: StudentCourse): CourseFaqItem[] {
  return [
    {
      id: `${course.id}-faq-1`,
      question: "Как проходит обучение в курсе?",
      answer:
        "Вы идете по модулям: теория, практика, тест, затем контрольная точка. Платформа показывает следующий шаг автоматически."
    },
    {
      id: `${course.id}-faq-2`,
      question: "Что, если я пропущу занятие?",
      answer:
        "Материалы и домашние задания остаются доступны. Для живых уроков можно выбрать новый слот в разделе расписания."
    },
    {
      id: `${course.id}-faq-3`,
      question: "Как оцениваются задания?",
      answer:
        "Тесты и тренажеры проверяются автоматически. Эссе, аудио и проекты проходят ИИ-проверку и финальную оценку преподавателя."
    },
    {
      id: `${course.id}-faq-4`,
      question: "Можно ли учиться в своем темпе?",
      answer:
        course.accessType === "По расписанию"
          ? "Да. Теорию и практику можно проходить в своем темпе, а созвоны бронируются отдельно."
          : "Да. Курс полностью доступен сразу, а прогресс фиксируется автоматически."
    },
    {
      id: `${course.id}-faq-5`,
      question: "Что нужно для получения сертификата?",
      answer: "Необходимо выполнить условия по прогрессу, закрыть контрольные точки и успешно пройти финальный этап."
    }
  ];
}

function createSyllabus(course: StudentCourse): CourseSyllabus {
  const modules = createCourseModules(course);
  const skills = categorySkills[course.category] ?? categorySkills["Бизнес"];
  const outcomes = [
    `Системно освоить ${course.category.toLowerCase()} на уровне «${course.level}».`,
    "Выстроить персональный учебный ритм и закрыть пробелы по темам.",
    "Получить практические артефакты: тесты, домашки, итоговые работы.",
    "Использовать рекомендации ИИ для ускорения прогресса."
  ];

  return {
    skills,
    outcomes,
    prerequisites: levelPrerequisites[course.level],
    modules,
    roadmap: createRoadmap(course, modules),
    faq: createFaq(course)
  };
}

export function getCourseSyllabus(courseId: string) {
  if (syllabusCache.has(courseId)) {
    return syllabusCache.get(courseId);
  }

  const course = getCourseById(courseId);
  if (!course) {
    return undefined;
  }

  const syllabus = createSyllabus(course);
  syllabusCache.set(courseId, syllabus);
  return syllabus;
}

export function getCourseModuleCount(courseId: string) {
  return getCourseSyllabus(courseId)?.modules.length ?? 0;
}

export function getCourseEstimatedWeeks(courseId: string) {
  return getCourseSyllabus(courseId)?.roadmap.totalWeeks ?? 0;
}

export function flattenCourseUnits(syllabus: CourseSyllabus): CourseFlattenedUnit[] {
  return syllabus.modules.flatMap((module, moduleIndex) =>
    module.lessons.map((lesson, lessonIndex) => ({
      ...lesson,
      moduleId: module.id,
      moduleTitle: module.title,
      moduleWeek: module.week,
      order: moduleIndex * 100 + lessonIndex
    }))
  );
}

export function getInitialCompletedUnitIds(course: StudentCourse, syllabus: CourseSyllabus) {
  const units = flattenCourseUnits(syllabus);
  return units.slice(0, clamp(course.lessonsCompleted, 0, units.length)).map((unit) => unit.id);
}
