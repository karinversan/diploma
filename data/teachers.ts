export type TeacherScheduleSlot = {
  date: string;
  times: string[];
};

export type TeacherReview = {
  id: string;
  studentName: string;
  studentAvatarUrl?: string;
  rating: number;
  text: string;
  date: string;
};

export type TeacherCourse = {
  id: string;
  title: string;
  level: string;
  duration: string;
  description: string;
};

export type TeacherResume = {
  education: string[];
  certificates: string[];
  languages: string[];
  teachingStyle: string[];
  achievements: string[];
};

export type Teacher = {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  intro: string;
  about: string;
  subjects: string[];
  bio: string;
  badges: string[];
  rating: number;
  reviewsCount: number;
  pricePerHour: number;
  experienceYears: number;
  studentsCount: number;
  lessonsCount: number;
  coursesCount: number;
  responseTimeHours: number;
  bookedLast48h: number;
  availableToday: boolean;
  category: "Дети" | "Подростки" | "Студенты" | "Взрослые";
  videoPreviewUrl?: string;
  scheduleSlots: TeacherScheduleSlot[];
  reviews: TeacherReview[];
  ratingBreakdown: {
    qualification: number;
    expertise: number;
    communication: number;
    value: number;
  };
  courses: TeacherCourse[];
  resume: TeacherResume;
};

type TeacherSeed = {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  intro: string;
  about: string;
  subjects: string[];
  bio: string;
  badges: string[];
  rating: number;
  reviewsCount: number;
  pricePerHour: number;
  experienceYears: number;
  studentsCount: number;
  lessonsCount: number;
  coursesCount: number;
  responseTimeHours: number;
  bookedLast48h: number;
  availableToday: boolean;
  category: Teacher["category"];
  videoPreviewUrl?: string;
};

const timeMatrix = [
  ["08:00", "10:30", "13:00", "16:00", "19:00"],
  ["09:00", "11:30", "14:00", "17:30", "20:00"],
  ["08:30", "12:00", "15:00", "18:00", "20:30"],
  ["09:30", "12:30", "16:30", "19:30", "21:00"]
];

const reviewTemplates = [
  "Очень понравился подход к объяснению темы по {subject}. После 2 занятий стало намного понятнее.",
  "Занятия проходят структурировано, преподаватель держит темп и при этом отвечает на все вопросы.",
  "Отличная коммуникация и поддержка между уроками. Домашние задания действительно помогают закрепить материал.",
  "Понравилось, что на уроке много практики и примеров из реальных задач. Рекомендую.",
  "Преподаватель помогает не только решить задачу, но и понять логику. Это заметно повышает уверенность.",
  "Был запрос на быстрый результат, и за месяц увидели прогресс. Формат занятий полностью устроил."
];

const reviewNames = [
  "Мария",
  "Егор",
  "София",
  "Артём",
  "Анна",
  "Илья",
  "Виктория",
  "Даниил",
  "Кира",
  "Максим"
];

const courseLevels = ["Начальный", "Средний", "Продвинутый"];
const courseDurations = ["4 недели", "6 недель", "8 недель", "10 недель"];
const courseFocus = [
  "База и фундамент",
  "Практика и задачи",
  "Подготовка к экзамену",
  "Интенсив",
  "Разговорный модуль",
  "Профильный трек"
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function formatIsoDate(daysAhead: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().slice(0, 10);
}

function buildSchedule(seedIndex: number): TeacherScheduleSlot[] {
  return Array.from({ length: 7 }, (_, dayIndex) => {
    const row = timeMatrix[(seedIndex + dayIndex) % timeMatrix.length];
    const start = (seedIndex + dayIndex) % 2;
    const times = row.slice(start, start + 3);

    return {
      date: formatIsoDate(dayIndex),
      times: times.length > 1 ? times : row.slice(0, 3)
    };
  });
}

function buildCourses(seed: TeacherSeed, seedIndex: number): TeacherCourse[] {
  if (seed.coursesCount <= 0) {
    return [];
  }

  const count = Math.min(seed.coursesCount, 12);

  return Array.from({ length: count }, (_, index) => {
    const subject = seed.subjects[index % seed.subjects.length];
    const level = courseLevels[(seedIndex + index) % courseLevels.length];
    const duration = courseDurations[(seedIndex + index) % courseDurations.length];
    const focus = courseFocus[(seedIndex + index) % courseFocus.length];

    return {
      id: `${seed.id}-course-${index + 1}`,
      title: `${subject}: ${focus}`,
      level,
      duration,
      description: `Курс ориентирован на ${focus.toLowerCase()} и включает практические задания с разбором ошибок.`
    };
  });
}

function buildReviews(seed: TeacherSeed, seedIndex: number): TeacherReview[] {
  return Array.from({ length: 5 }, (_, index) => {
    const template = reviewTemplates[(seedIndex + index) % reviewTemplates.length];
    const text = template.replace("{subject}", seed.subjects[0].toLowerCase());
    const ratingShift = ((seedIndex + index) % 3) * 0.1;

    return {
      id: `${seed.id}-review-${index + 1}`,
      studentName: reviewNames[(seedIndex + index) % reviewNames.length],
      studentAvatarUrl: `/avatars/avatar-${((seedIndex + index) % 12) + 1}.svg`,
      rating: round1(clamp(seed.rating - ratingShift, 4.6, 5)),
      text,
      date: formatIsoDate(-(index + 1) * 13)
    };
  });
}

function buildRatingBreakdown(seed: TeacherSeed, seedIndex: number): Teacher["ratingBreakdown"] {
  const offsets = [0.1, 0, -0.1, 0.2];

  return {
    qualification: round1(clamp(seed.rating + offsets[seedIndex % offsets.length], 4.4, 5)),
    expertise: round1(clamp(seed.rating + offsets[(seedIndex + 1) % offsets.length], 4.4, 5)),
    communication: round1(clamp(seed.rating + offsets[(seedIndex + 2) % offsets.length], 4.4, 5)),
    value: round1(clamp(seed.rating + offsets[(seedIndex + 3) % offsets.length], 4.4, 5))
  };
}

function buildResume(seed: TeacherSeed): TeacherResume {
  const primarySubject = seed.subjects[0];

  return {
    education: [
      `Магистр по направлению «${primarySubject}»`,
      "Педагогическое образование и методика онлайн-обучения"
    ],
    certificates: [
      "Сертификат по современным образовательным технологиям",
      "Курс по оценке прогресса и учебной аналитике"
    ],
    languages: ["Русский — родной", "Английский — рабочий"],
    teachingStyle: [
      "Объяснение через реальные примеры",
      "Пошаговая обратная связь после каждого занятия",
      "Индивидуальный темп и план на 4 недели"
    ],
    achievements: [
      `Подготовлено более ${seed.studentsCount} учеников`,
      `Проведено свыше ${seed.lessonsCount} занятий`
    ]
  };
}

function createTeacher(seed: TeacherSeed, seedIndex: number): Teacher {
  const courses = buildCourses(seed, seedIndex);

  return {
    ...seed,
    videoPreviewUrl: seed.videoPreviewUrl ?? "/classroom-preview.svg",
    scheduleSlots: buildSchedule(seedIndex),
    reviews: buildReviews(seed, seedIndex),
    ratingBreakdown: buildRatingBreakdown(seed, seedIndex),
    courses,
    resume: buildResume(seed)
  };
}

const teacherSeeds: TeacherSeed[] = [
  {
    id: "natalya-smirnova",
    name: "Наталья Смирнова",
    title: "Преподаватель английского языка",
    avatarUrl: "/avatars/avatar-1.svg",
    intro: "Помогаю перейти от школьного английского к свободной речи для учебы, работы и путешествий.",
    about:
      "Работаю с учениками более 9 лет: от базового уровня до подготовки к международным экзаменам. На уроках делаю упор на разговорную практику, актуальную лексику и уверенное использование языка в реальных ситуациях. После каждого занятия вы получаете краткий конспект и индивидуальные рекомендации по темам, которые стоит усилить.",
    subjects: ["Английский", "Разговорная практика"],
    bio: "Готовлю к международным экзаменам и прокачиваю разговорный английский через реальные кейсы.",
    badges: ["Проверен", "ТОП преподаватель"],
    rating: 4.9,
    reviewsCount: 236,
    pricePerHour: 1700,
    experienceYears: 9,
    studentsCount: 420,
    lessonsCount: 3100,
    coursesCount: 8,
    responseTimeHours: 1,
    bookedLast48h: 14,
    availableToday: true,
    category: "Студенты"
  },
  {
    id: "alexey-ivanov",
    name: "Алексей Иванов",
    title: "Преподаватель математики",
    avatarUrl: "/avatars/avatar-2.svg",
    intro: "Системно готовлю к ЕГЭ/ОГЭ и олимпиадам: закрываем пробелы и формируем стратегию решения.",
    about:
      "За 12 лет работы разработал структурированную программу подготовки к экзаменам по математике. Уроки строятся вокруг типичных ошибок и тренировки задач повышенной сложности. Для каждого ученика формирую маршрут по темам с регулярным контролем прогресса и понятными метриками результата.",
    subjects: ["Математика", "ЕГЭ/ОГЭ"],
    bio: "12 лет готовлю школьников к экзаменам и олимпиадам. Уроки с упором на понимание, а не зубрежку.",
    badges: ["Проверен"],
    rating: 4.8,
    reviewsCount: 231,
    pricePerHour: 1900,
    experienceYears: 12,
    studentsCount: 510,
    lessonsCount: 3800,
    coursesCount: 10,
    responseTimeHours: 2,
    bookedLast48h: 11,
    availableToday: false,
    category: "Подростки"
  },
  {
    id: "irina-petrova",
    name: "Ирина Петрова",
    title: "Преподаватель русского языка и литературы",
    avatarUrl: "/avatars/avatar-3.svg",
    intro: "Помогаю писать сильные сочинения и уверенно сдавать экзамены по русскому языку.",
    about:
      "Специализируюсь на подготовке к экзаменам и развитии письменной речи. На занятиях мы учимся структурировать аргументацию, развивать мысль и избегать типичных ошибок. Материал подается через понятные алгоритмы и практические шаблоны, которые легко применить на экзамене.",
    subjects: ["Русский язык", "Литература"],
    bio: "Помогаю писать сильные сочинения и уверенно сдавать русский язык без стресса.",
    badges: ["ТОП преподаватель"],
    rating: 4.9,
    reviewsCount: 189,
    pricePerHour: 1500,
    experienceYears: 8,
    studentsCount: 360,
    lessonsCount: 2600,
    coursesCount: 7,
    responseTimeHours: 2,
    bookedLast48h: 9,
    availableToday: true,
    category: "Подростки"
  },
  {
    id: "timur-safonov",
    name: "Тимур Сафонов",
    title: "Преподаватель физики и математики",
    avatarUrl: "/avatars/avatar-4.svg",
    intro: "Объясняю сложные темы через визуализацию, эксперименты и понятные модели.",
    about:
      "Моя цель — сделать физику и математику прозрачными и практичными. На уроках используем интерактивную доску, схемы и пошаговые разборы задач. Ученики отмечают, что начинают видеть логику формул и быстрее переходят к самостоятельному решению.",
    subjects: ["Физика", "Математика"],
    bio: "Разбираем сложные темы через визуализацию и интерактивную доску.",
    badges: ["Проверен"],
    rating: 4.7,
    reviewsCount: 124,
    pricePerHour: 1800,
    experienceYears: 7,
    studentsCount: 280,
    lessonsCount: 1950,
    coursesCount: 6,
    responseTimeHours: 3,
    bookedLast48h: 8,
    availableToday: true,
    category: "Студенты"
  },
  {
    id: "elena-kim",
    name: "Елена Ким",
    title: "Преподаватель корейского и английского",
    avatarUrl: "/avatars/avatar-5.svg",
    intro: "Веду учеников от нуля до уверенного уровня с упором на живую речь и понимание контекста.",
    about:
      "Работаю со взрослыми и подростками, которым важно быстро начать говорить. Комбинирую разговорные задания, грамматические блоки и культурный контекст. Для каждого ученика формирую дорожную карту с микроцелями, чтобы сохранять мотивацию и прогресс.",
    subjects: ["Корейский", "Английский"],
    bio: "Работаю с нуля и до уверенного уровня. Уроки для детей и взрослых.",
    badges: ["Проверен", "ТОП преподаватель"],
    rating: 4.9,
    reviewsCount: 98,
    pricePerHour: 2100,
    experienceYears: 6,
    studentsCount: 210,
    lessonsCount: 1450,
    coursesCount: 6,
    responseTimeHours: 2,
    bookedLast48h: 7,
    availableToday: false,
    category: "Взрослые"
  },
  {
    id: "maksim-volkov",
    name: "Максим Волков",
    title: "Преподаватель программирования",
    avatarUrl: "/avatars/avatar-6.svg",
    intro: "Помогаю освоить Python и алгоритмы через практические проекты, близкие к реальным задачам.",
    about:
      "Учу программированию через практику: от первых скриптов до проектной разработки. Большое внимание уделяю логике, декомпозиции задачи и качеству кода. После каждого урока студент получает план доработок и мини-проект для закрепления навыков.",
    subjects: ["Программирование", "Python"],
    bio: "Учу писать код на практике: проекты, алгоритмы, подготовка к стажировкам.",
    badges: ["ТОП преподаватель"],
    rating: 4.8,
    reviewsCount: 174,
    pricePerHour: 2300,
    experienceYears: 8,
    studentsCount: 300,
    lessonsCount: 2200,
    coursesCount: 9,
    responseTimeHours: 1,
    bookedLast48h: 12,
    availableToday: true,
    category: "Студенты"
  },
  {
    id: "olga-romanova",
    name: "Ольга Романова",
    title: "Преподаватель начальной школы",
    avatarUrl: "/avatars/avatar-7.svg",
    intro: "Провожу занятия в мягком игровом формате, который удерживает внимание и развивает базовые навыки.",
    about:
      "Работаю с детьми 7–10 лет и помогаю укреплять фундамент по чтению, письму и математике. Занятия включают интерактивные упражнения, мини-игры и визуальные материалы. Родители получают понятный отчет о прогрессе и рекомендации для домашней практики.",
    subjects: ["Начальная школа", "Чтение"],
    bio: "Занятия в игровом формате для детей 7–10 лет: внимание, чтение, базовая математика.",
    badges: ["Проверен"],
    rating: 4.9,
    reviewsCount: 132,
    pricePerHour: 1400,
    experienceYears: 10,
    studentsCount: 390,
    lessonsCount: 3400,
    coursesCount: 6,
    responseTimeHours: 2,
    bookedLast48h: 10,
    availableToday: true,
    category: "Дети"
  },
  {
    id: "dmitry-kolesov",
    name: "Дмитрий Колесов",
    title: "Преподаватель химии и биологии",
    avatarUrl: "/avatars/avatar-8.svg",
    intro: "Готовлю к поступлению в медвузы и помогаю уверенно проходить экзамены по профильным предметам.",
    about:
      "На занятиях по химии и биологии связываю теорию с практикой и заданиями экзаменационного формата. Используем разбор типовых ошибок и короткие контрольные после каждого блока. Ученики быстрее систематизируют материал и стабильно улучшают результаты.",
    subjects: ["Химия", "Биология"],
    bio: "Подготовка к экзаменам и поступлению в медвузы. Индивидуальные треки обучения.",
    badges: ["Проверен"],
    rating: 4.6,
    reviewsCount: 104,
    pricePerHour: 1750,
    experienceYears: 7,
    studentsCount: 240,
    lessonsCount: 1800,
    coursesCount: 5,
    responseTimeHours: 3,
    bookedLast48h: 6,
    availableToday: false,
    category: "Подростки"
  },
  {
    id: "svetlana-orlova",
    name: "Светлана Орлова",
    title: "Преподаватель немецкого языка",
    avatarUrl: "/avatars/avatar-9.svg",
    intro: "Помогаю заговорить на немецком для учебы, работы и путешествий без языкового барьера.",
    about:
      "Ставлю акцент на разговорной практике и понимании живой речи. Уроки адаптирую под ваши цели: экзамен, переезд, карьера или свободное общение. Работаем в спокойном темпе, но с четкими недельными результатами.",
    subjects: ["Немецкий", "Разговорный клуб"],
    bio: "Помогаю заговорить на немецком в работе и путешествиях. Уроки с живыми диалогами.",
    badges: ["ТОП преподаватель"],
    rating: 4.8,
    reviewsCount: 126,
    pricePerHour: 1850,
    experienceYears: 9,
    studentsCount: 310,
    lessonsCount: 2400,
    coursesCount: 7,
    responseTimeHours: 2,
    bookedLast48h: 9,
    availableToday: true,
    category: "Взрослые"
  },
  {
    id: "viktor-sergeev",
    name: "Виктор Сергеев",
    title: "Преподаватель истории и обществознания",
    avatarUrl: "/avatars/avatar-10.svg",
    intro: "Учу мыслить критически, аргументировать и уверенно отвечать на экзаменационные задания.",
    about:
      "Помогаю выстроить системное понимание истории и обществознания, а не просто запоминать факты. На каждом занятии разбираем задания формата ЕГЭ, тренировочные эссе и аргументацию. Такой подход повышает балл и уверенность на экзамене.",
    subjects: ["История", "Обществознание"],
    bio: "Готовлю к ЕГЭ и олимпиадам, учу мыслить критически и аргументировать.",
    badges: ["Проверен"],
    rating: 4.7,
    reviewsCount: 141,
    pricePerHour: 1600,
    experienceYears: 11,
    studentsCount: 410,
    lessonsCount: 3200,
    coursesCount: 8,
    responseTimeHours: 2,
    bookedLast48h: 8,
    availableToday: false,
    category: "Подростки"
  },
  {
    id: "yana-zorina",
    name: "Яна Зорина",
    title: "Преподаватель французского языка",
    avatarUrl: "/avatars/avatar-11.svg",
    intro: "Готовлю к DELF и развиваю академический французский для учебы и международных программ.",
    about:
      "Специализируюсь на подготовке к международным экзаменам и академическому французскому. На уроках уделяем внимание устной части, письму и пониманию структуры заданий. Индивидуальный план помогает стабильно расти от недели к неделе.",
    subjects: ["Французский", "Подготовка к DELF"],
    bio: "Французский с упором на устную речь и академические цели.",
    badges: ["Проверен", "ТОП преподаватель"],
    rating: 5,
    reviewsCount: 116,
    pricePerHour: 2400,
    experienceYears: 8,
    studentsCount: 230,
    lessonsCount: 1700,
    coursesCount: 6,
    responseTimeHours: 1,
    bookedLast48h: 7,
    availableToday: true,
    category: "Взрослые"
  },
  {
    id: "kirill-andreev",
    name: "Кирилл Андреев",
    title: "Преподаватель математики для младших классов",
    avatarUrl: "/avatars/avatar-12.svg",
    intro: "Объясняю математику спокойно и понятно, чтобы ребенок полюбил предмет и начал решать увереннее.",
    about:
      "Работаю с детьми начальной школы и помогаю убрать страх перед математикой. Использую визуальные схемы, игровые задания и короткие блоки практики. Главный результат — рост самостоятельности и уверенности ребенка на уроках.",
    subjects: ["Математика", "Начальная школа"],
    bio: "Спокойно и понятно объясняю математику младшим школьникам.",
    badges: ["Проверен"],
    rating: 4.8,
    reviewsCount: 93,
    pricePerHour: 1300,
    experienceYears: 6,
    studentsCount: 260,
    lessonsCount: 1900,
    coursesCount: 5,
    responseTimeHours: 2,
    bookedLast48h: 6,
    availableToday: true,
    category: "Дети"
  }
];

export const teachers: Teacher[] = teacherSeeds.map((seed, index) => createTeacher(seed, index));

const uniqueSubjects = Array.from(new Set(teachers.flatMap((teacher) => teacher.subjects))).sort((a, b) =>
  a.localeCompare(b, "ru")
);

export const subjects = ["Все предметы", ...uniqueSubjects];

export const categories: Array<Teacher["category"]> = ["Дети", "Подростки", "Студенты", "Взрослые"];

export function getTeacherById(id: string) {
  return teachers.find((teacher) => teacher.id === id);
}
