export type TeacherCabinetProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  title: string;
  timezone: string;
  subjects: string[];
  rating: number;
  reviewsCount: number;
};

export type TeacherDashboardMetric = {
  id: string;
  label: string;
  value: string;
  delta: string;
};

export type TeacherTask = {
  id: string;
  title: string;
  deadline: string;
  priority: "Низкий" | "Средний" | "Высокий";
};

export type TeacherCourseStatus = "Черновик" | "Опубликован" | "На проверке" | "Архив";

export type TeacherCourse = {
  id: string;
  title: string;
  category: string;
  level: string;
  status: TeacherCourseStatus;
  studentsCount: number;
  lessonsCount: number;
  completionRate: number;
  price: number;
  rating: number;
  imageUrl: string;
  shortDescription: string;
};

export type ClassroomEventType = "Лекция" | "Практика" | "Дискуссия" | "Проверка";

export type ClassroomEvent = {
  id: string;
  title: string;
  type: ClassroomEventType;
  date: string;
  startTime: string;
  endTime: string;
  participantName: string;
  participantAvatarUrl: string;
  courseId: string;
};

export type TeacherStudent = {
  id: string;
  name: string;
  avatarUrl: string;
  activeCourse: string;
  progress: number;
  attendance: number;
  homeworkStatus: "Сдано" | "На проверке" | "Просрочено";
  lastActivity: string;
};

export type TeacherMessage = {
  id: string;
  sender: "teacher" | "student";
  text: string;
  sentAt: string;
};

export type TeacherMessageThread = {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatarUrl: string;
  courseTitle: string;
  lastMessage: string;
  unreadCount: number;
  updatedAt: string;
  messages: TeacherMessage[];
};

export type TeacherPayoutStatus = "Завершено" | "В обработке" | "Возврат";

export type TeacherPayoutTransaction = {
  id: string;
  date: string;
  source: string;
  studentName: string;
  amount: number;
  status: TeacherPayoutStatus;
};

export type TeacherAnalyticsPoint = {
  label: string;
  revenue: number;
  lessons: number;
  retention: number;
};

export type CourseSubsection = {
  id: string;
  title: string;
  intro: string;
  videoTitle: string;
  bulletItems: string[];
  mediaGallery: string[];
};

export type CourseBuilderTemplate = {
  id: string;
  weekTitle: string;
  subtitle: string;
  lastSavedLabel: string;
  subsections: CourseSubsection[];
};

export type QuizQuestionType =
  | "Multiple Choice"
  | "True/False"
  | "Open Ended"
  | "Poll"
  | "Reorder"
  | "Match"
  | "Drag and Drop"
  | "Sequencing";

export type TeacherQuizQuestion = {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  options: string[];
  correctOptionIndexes: number[];
  explanation: string;
  points: number;
  mediaUrl?: string;
};

export type TeacherQuizTemplate = {
  id: string;
  title: string;
  lessonTitle: string;
  durationMinutes: number;
  questions: TeacherQuizQuestion[];
};

export const teacherCabinetProfile: TeacherCabinetProfile = {
  id: "teacher-jenny-wilson",
  name: "Дженни Уилсон",
  email: "j.wilson@skillzone.demo",
  avatarUrl: "/avatars/avatar-1.svg",
  title: "Преподаватель экономики",
  timezone: "МСК UTC+03:00",
  subjects: ["Экономика", "Бизнес-аналитика", "Финансы"],
  rating: 4.9,
  reviewsCount: 236
};

export const teacherDashboardMetrics: TeacherDashboardMetric[] = [
  { id: "students", label: "Активные ученики", value: "84", delta: "+6 за месяц" },
  { id: "courses", label: "Опубликованные курсы", value: "7", delta: "+1 в этом квартале" },
  { id: "revenue", label: "Доход за месяц", value: "214 500 ₽", delta: "+18% к прошлому месяцу" },
  { id: "lessons", label: "Проведено занятий", value: "126", delta: "92% посещаемость" }
];

export const teacherTodayTasks: TeacherTask[] = [
  { id: "task-1", title: "Проверить эссе группы «Бизнес B2»", deadline: "до 14:00", priority: "Высокий" },
  { id: "task-2", title: "Подготовить квиз к модулю «Финансовые риски»", deadline: "до 16:30", priority: "Средний" },
  { id: "task-3", title: "Подтвердить 5 броней на завтра", deadline: "до 18:00", priority: "Высокий" },
  { id: "task-4", title: "Обновить описание курса «Экономика для старта»", deadline: "до 20:00", priority: "Низкий" }
];

export const teacherCourses: TeacherCourse[] = [
  {
    id: "teacher-course-1",
    title: "Бизнес-управление с нуля: от стратегии до решений",
    category: "Бизнес",
    level: "Начальный",
    status: "Опубликован",
    studentsCount: 250,
    lessonsCount: 24,
    completionRate: 78,
    price: 8799,
    rating: 4.9,
    imageUrl: "/classroom-preview.svg",
    shortDescription: "Системный курс по бизнес-основам, аналитике и управленческим решениям."
  },
  {
    id: "teacher-course-2",
    title: "Экономика для старта карьеры",
    category: "Экономика",
    level: "Средний",
    status: "Опубликован",
    studentsCount: 132,
    lessonsCount: 18,
    completionRate: 66,
    price: 7490,
    rating: 4.8,
    imageUrl: "/classroom-preview.svg",
    shortDescription: "Экономические инструменты для принятия решений и анализа рынков."
  },
  {
    id: "teacher-course-3",
    title: "Финансовое моделирование: практика",
    category: "Финансы",
    level: "Продвинутый",
    status: "Черновик",
    studentsCount: 0,
    lessonsCount: 15,
    completionRate: 0,
    price: 12900,
    rating: 0,
    imageUrl: "/classroom-preview.svg",
    shortDescription: "Практический курс с кейсами, шаблонами и разбором отчетности."
  },
  {
    id: "teacher-course-4",
    title: "Спринт по бизнес-аналитике",
    category: "Аналитика",
    level: "Средний",
    status: "На проверке",
    studentsCount: 0,
    lessonsCount: 12,
    completionRate: 0,
    price: 9900,
    rating: 0,
    imageUrl: "/classroom-preview.svg",
    shortDescription: "Интенсив по метрикам, гипотезам и принятию продуктовых решений."
  }
];

export const teacherClassroomEvents: ClassroomEvent[] = [
  {
    id: "event-1",
    title: "Лекция",
    type: "Лекция",
    date: "2026-04-07",
    startTime: "08:00",
    endTime: "09:30",
    participantName: "Адам С.",
    participantAvatarUrl: "/avatars/avatar-2.svg",
    courseId: "teacher-course-1"
  },
  {
    id: "event-2",
    title: "Практика",
    type: "Практика",
    date: "2026-04-08",
    startTime: "09:00",
    endTime: "10:30",
    participantName: "Кристофер Н.",
    participantAvatarUrl: "/avatars/avatar-4.svg",
    courseId: "teacher-course-2"
  },
  {
    id: "event-3",
    title: "Дискуссия",
    type: "Дискуссия",
    date: "2026-04-09",
    startTime: "07:30",
    endTime: "08:30",
    participantName: "Стюарт С.",
    participantAvatarUrl: "/avatars/avatar-6.svg",
    courseId: "teacher-course-1"
  },
  {
    id: "event-4",
    title: "Проверка",
    type: "Проверка",
    date: "2026-04-10",
    startTime: "10:00",
    endTime: "11:00",
    participantName: "Кэти А.",
    participantAvatarUrl: "/avatars/avatar-8.svg",
    courseId: "teacher-course-2"
  },
  {
    id: "event-5",
    title: "Лекция",
    type: "Лекция",
    date: "2026-04-12",
    startTime: "09:00",
    endTime: "10:00",
    participantName: "София С.",
    participantAvatarUrl: "/avatars/avatar-10.svg",
    courseId: "teacher-course-1"
  }
];

export const teacherStudents: TeacherStudent[] = [
  {
    id: "student-1",
    name: "Александра Новикова",
    avatarUrl: "/avatars/avatar-3.svg",
    activeCourse: "Бизнес-управление с нуля: от стратегии до решений",
    progress: 74,
    attendance: 93,
    homeworkStatus: "На проверке",
    lastActivity: "сегодня, 11:20"
  },
  {
    id: "student-2",
    name: "Егор Фролов",
    avatarUrl: "/avatars/avatar-5.svg",
    activeCourse: "Экономика для старта карьеры",
    progress: 58,
    attendance: 88,
    homeworkStatus: "Сдано",
    lastActivity: "сегодня, 09:05"
  },
  {
    id: "student-3",
    name: "Марина Белова",
    avatarUrl: "/avatars/avatar-7.svg",
    activeCourse: "Бизнес-управление с нуля: от стратегии до решений",
    progress: 81,
    attendance: 95,
    homeworkStatus: "Сдано",
    lastActivity: "вчера, 20:14"
  },
  {
    id: "student-4",
    name: "Даниил Кравцов",
    avatarUrl: "/avatars/avatar-9.svg",
    activeCourse: "Экономика для старта карьеры",
    progress: 42,
    attendance: 70,
    homeworkStatus: "Просрочено",
    lastActivity: "2 дня назад"
  }
];

export const teacherMessageThreads: TeacherMessageThread[] = [
  {
    id: "t-thread-1",
    studentId: "student-1",
    studentName: "Александра Новикова",
    studentAvatarUrl: "/avatars/avatar-3.svg",
    courseTitle: "Бизнес-управление с нуля: от стратегии до решений",
    lastMessage: "Отправила финальную версию задания, проверьте, пожалуйста.",
    unreadCount: 1,
    updatedAt: "2026-02-09T11:16:00+03:00",
    messages: [
      { id: "m-1", sender: "student", text: "Отправила финальную версию задания, проверьте, пожалуйста.", sentAt: "2026-02-09T11:16:00+03:00" },
      { id: "m-2", sender: "teacher", text: "Хорошо, проверю до 14:00 и оставлю комментарии.", sentAt: "2026-02-09T11:28:00+03:00" }
    ]
  },
  {
    id: "t-thread-2",
    studentId: "student-2",
    studentName: "Егор Фролов",
    studentAvatarUrl: "/avatars/avatar-5.svg",
    courseTitle: "Экономика для старта карьеры",
    lastMessage: "Можно перенести занятие с пятницы на субботу?",
    unreadCount: 0,
    updatedAt: "2026-02-08T19:40:00+03:00",
    messages: [
      { id: "m-3", sender: "student", text: "Можно перенести занятие с пятницы на субботу?", sentAt: "2026-02-08T19:40:00+03:00" },
      { id: "m-4", sender: "teacher", text: "Да, предложу доступные слоты сегодня вечером.", sentAt: "2026-02-08T20:04:00+03:00" }
    ]
  }
];

export const teacherPayoutTransactions: TeacherPayoutTransaction[] = [
  { id: "pay-1", date: "2026-02-07", source: "Пакет: Аналитика бизнеса", studentName: "Марина Белова", amount: 4890, status: "Завершено" },
  { id: "pay-2", date: "2026-02-05", source: "Курс «Экономика для старта карьеры»", studentName: "Егор Фролов", amount: 3720, status: "Завершено" },
  { id: "pay-3", date: "2026-02-03", source: "Индивидуальный созвон", studentName: "Александра Новикова", amount: 1420, status: "В обработке" },
  { id: "pay-4", date: "2026-01-30", source: "Возврат по отмене", studentName: "Даниил Кравцов", amount: -980, status: "Возврат" }
];

export const teacherAnalyticsTrend: TeacherAnalyticsPoint[] = [
  { label: "Нед 1", revenue: 35600, lessons: 24, retention: 82 },
  { label: "Нед 2", revenue: 42800, lessons: 29, retention: 84 },
  { label: "Нед 3", revenue: 46700, lessons: 31, retention: 88 },
  { label: "Нед 4", revenue: 51200, lessons: 34, retention: 91 }
];

export const courseBuilderTemplates: CourseBuilderTemplate[] = [
  {
    id: "teacher-course-1",
    weekTitle: "Неделя 1 — старт в бизнес-управлении",
    subtitle: "Добавляйте и редактируйте подразделы курса",
    lastSavedLabel: "Изменения сохранены 2 минуты назад",
    subsections: [
      {
        id: "sub-1",
        title: "Прочитайте перед началом",
        intro:
          "Добро пожаловать в курс. В этом блоке объясняем структуру, цели и формат работы на ближайшие недели.",
        videoTitle: "Как начать обучение",
        bulletItems: [
          "Ключевые понятия и план первой недели",
          "Что нужно подготовить к первому практическому занятию",
          "Как будет проходить проверка домашней работы"
        ],
        mediaGallery: ["/classroom-preview.svg", "/classroom-preview.svg"]
      },
      {
        id: "sub-2",
        title: "Введение в бизнес-основы",
        intro: "Разбираем фундаментальные термины и роль аналитики в принятии решений.",
        videoTitle: "Базовые принципы бизнеса",
        bulletItems: ["Микро- и макроуровень экономики", "Метрики эффективности", "Типичные ошибки новичков"],
        mediaGallery: ["/classroom-preview.svg"]
      },
      {
        id: "sub-3",
        title: "Введение в бренд-менеджмент",
        intro: "Как бренд влияет на ценность продукта и поведение клиента.",
        videoTitle: "Бренд и поведение клиента",
        bulletItems: ["Ценностное предложение", "Позиционирование", "Коммуникационная стратегия"],
        mediaGallery: ["/classroom-preview.svg"]
      }
    ]
  },
  {
    id: "teacher-course-2",
    weekTitle: "Неделя 1 — ключевые экономические модели",
    subtitle: "Постройте вводный трек из видео, кейсов и проверочных заданий",
    lastSavedLabel: "Изменения сохранены 8 минут назад",
    subsections: [
      {
        id: "economics-sub-1",
        title: "Стартовый бриф",
        intro: "Покажите ученикам цель недели и ожидаемый результат.",
        videoTitle: "Что такое экономическое мышление",
        bulletItems: ["Роль спроса и предложения", "Почему важны данные", "Как читать базовые метрики"],
        mediaGallery: ["/classroom-preview.svg"]
      },
      {
        id: "economics-sub-2",
        title: "Практический кейс",
        intro: "Разберите прикладной пример с ценой, спросом и себестоимостью.",
        videoTitle: "Кейс: динамика цены",
        bulletItems: ["Гипотеза", "Расчет", "Выводы"],
        mediaGallery: ["/classroom-preview.svg"]
      }
    ]
  },
  {
    id: "teacher-course-3",
    weekTitle: "Неделя 1 — финансовая модель продукта",
    subtitle: "Подготовьте практическую структуру модуля",
    lastSavedLabel: "Черновик сохранен",
    subsections: [
      {
        id: "finance-sub-1",
        title: "Шаблон модели",
        intro: "Покажите ученикам, как строить отчёт о прибылях и считать экономику юнита.",
        videoTitle: "Скелет финансовой модели",
        bulletItems: ["Доходы", "Переменные затраты", "Постоянные затраты"],
        mediaGallery: ["/classroom-preview.svg"]
      }
    ]
  },
  {
    id: "teacher-course-4",
    weekTitle: "Неделя 1 — основы продуктовой аналитики",
    subtitle: "Соберите модуль с акцентом на метрики и гипотезы",
    lastSavedLabel: "Ожидает проверку методиста",
    subsections: [
      {
        id: "analytics-sub-1",
        title: "Метрики роста",
        intro: "Вводный блок про воронку роста и ключевые бизнес-метрики.",
        videoTitle: "Как выбрать ключевые показатели",
        bulletItems: ["Привлечение", "Активация", "Удержание"],
        mediaGallery: ["/classroom-preview.svg"]
      }
    ]
  }
];

export const teacherQuizTemplates: TeacherQuizTemplate[] = [
  {
    id: "quiz-business-week1",
    title: "Урок 1 — вводный квиз",
    lessonTitle: "Неделя 1 — старт в бизнес-управлении",
    durationMinutes: 10,
    questions: [
      {
        id: "q-1",
        type: "Multiple Choice",
        prompt: "Какой из факторов чаще всего приводит к росту курса национальной валюты?",
        options: [
          "Резкий рост инфляции",
          "Снижение спроса на экспорт",
          "Рост спроса на продукцию страны и валюту",
          "Падение процентной ставки"
        ],
        correctOptionIndexes: [2],
        explanation: "Увеличение внешнего спроса на товары повышает спрос и на валюту страны.",
        points: 10,
        mediaUrl: "/classroom-preview.svg"
      },
      {
        id: "q-2",
        type: "True/False",
        prompt: "Положительное сальдо торгового баланса обычно укрепляет национальную валюту.",
        options: ["Верно", "Неверно"],
        correctOptionIndexes: [0],
        explanation: "Положительный баланс увеличивает приток валютной выручки.",
        points: 8
      },
      {
        id: "q-3",
        type: "Poll",
        prompt: "Какой формат объяснения темы для вас наиболее понятен?",
        options: ["Короткое видео", "Интерактивная схема", "Практический кейс", "Текстовый конспект"],
        correctOptionIndexes: [2],
        explanation: "Опрос используется для адаптации урока под группу.",
        points: 0
      }
    ]
  }
];

export const quizQuestionTypeOptions: QuizQuestionType[] = [
  "Multiple Choice",
  "True/False",
  "Open Ended",
  "Poll",
  "Reorder",
  "Match",
  "Drag and Drop",
  "Sequencing"
];

export const courseEditorComponentBlocks = [
  "Изображение",
  "Галерея",
  "Видео",
  "Список",
  "Вложение",
  "Таблица",
  "Квиз",
  "Кейс"
];

export function getTeacherCourseById(courseId: string) {
  return teacherCourses.find((course) => course.id === courseId);
}

export function getCourseBuilderTemplateByCourseId(courseId: string) {
  return courseBuilderTemplates.find((template) => template.id === courseId);
}

export function getTeacherQuizById(quizId: string) {
  return teacherQuizTemplates.find((quiz) => quiz.id === quizId);
}
