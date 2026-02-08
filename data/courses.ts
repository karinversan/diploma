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
