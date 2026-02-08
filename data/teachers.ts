export type Teacher = {
  id: string;
  name: string;
  subjects: string[];
  bio: string;
  rating: number;
  reviewsCount: number;
  pricePerHour: number;
  badges: string[];
  availableToday: boolean;
  avatarUrl: string;
  category: "Дети" | "Подростки" | "Студенты" | "Взрослые";
};

export const teachers: Teacher[] = [
  {
    id: "natalya-smirnova",
    name: "Наталья Смирнова",
    subjects: ["Английский", "Разговорная практика"],
    bio: "Готовлю к международным экзаменам и прокачиваю разговорный английский через реальные кейсы.",
    rating: 4.9,
    reviewsCount: 187,
    pricePerHour: 1700,
    badges: ["Проверен", "Топ"],
    availableToday: true,
    avatarUrl: "/avatars/avatar-1.svg",
    category: "Студенты"
  },
  {
    id: "alexey-ivanov",
    name: "Алексей Иванов",
    subjects: ["Математика", "ЕГЭ/ОГЭ"],
    bio: "12 лет готовлю школьников к экзаменам и олимпиадам. Уроки с упором на понимание, а не зубрежку.",
    rating: 4.8,
    reviewsCount: 231,
    pricePerHour: 1900,
    badges: ["Проверен"],
    availableToday: false,
    avatarUrl: "/avatars/avatar-2.svg",
    category: "Подростки"
  },
  {
    id: "irina-petrova",
    name: "Ирина Петрова",
    subjects: ["Русский язык", "Литература"],
    bio: "Помогаю писать сильные сочинения и уверенно сдавать русский язык без стресса.",
    rating: 4.9,
    reviewsCount: 142,
    pricePerHour: 1500,
    badges: ["Топ"],
    availableToday: true,
    avatarUrl: "/avatars/avatar-3.svg",
    category: "Подростки"
  },
  {
    id: "timur-safonov",
    name: "Тимур Сафонов",
    subjects: ["Физика", "Математика"],
    bio: "Разбираем сложные темы через визуализацию и интерактивную доску.",
    rating: 4.7,
    reviewsCount: 98,
    pricePerHour: 1800,
    badges: ["Проверен"],
    availableToday: true,
    avatarUrl: "/avatars/avatar-4.svg",
    category: "Студенты"
  },
  {
    id: "elena-kim",
    name: "Елена Ким",
    subjects: ["Корейский", "Английский"],
    bio: "Работаю с нуля и до уверенного уровня. Уроки для детей и взрослых.",
    rating: 4.9,
    reviewsCount: 76,
    pricePerHour: 2100,
    badges: ["Проверен", "Топ"],
    availableToday: false,
    avatarUrl: "/avatars/avatar-5.svg",
    category: "Взрослые"
  },
  {
    id: "maksim-volkov",
    name: "Максим Волков",
    subjects: ["Программирование", "Python"],
    bio: "Учу писать код на практике: проекты, алгоритмы, подготовка к стажировкам.",
    rating: 4.8,
    reviewsCount: 164,
    pricePerHour: 2300,
    badges: ["Топ"],
    availableToday: true,
    avatarUrl: "/avatars/avatar-6.svg",
    category: "Студенты"
  },
  {
    id: "olga-romanova",
    name: "Ольга Романова",
    subjects: ["Начальная школа", "Чтение"],
    bio: "Занятия в игровом формате для детей 7–10 лет: внимание, чтение, базовая математика.",
    rating: 4.9,
    reviewsCount: 121,
    pricePerHour: 1400,
    badges: ["Проверен"],
    availableToday: true,
    avatarUrl: "/avatars/avatar-7.svg",
    category: "Дети"
  },
  {
    id: "dmitry-kolesov",
    name: "Дмитрий Колесов",
    subjects: ["Химия", "Биология"],
    bio: "Подготовка к экзаменам и поступлению в медвузы. Индивидуальные треки обучения.",
    rating: 4.6,
    reviewsCount: 89,
    pricePerHour: 1750,
    badges: ["Проверен"],
    availableToday: false,
    avatarUrl: "/avatars/avatar-8.svg",
    category: "Подростки"
  },
  {
    id: "svetlana-orlova",
    name: "Светлана Орлова",
    subjects: ["Немецкий", "Разговорный клуб"],
    bio: "Помогаю заговорить на немецком в работе и путешествиях. Уроки с живыми диалогами.",
    rating: 4.8,
    reviewsCount: 74,
    pricePerHour: 1850,
    badges: ["Топ"],
    availableToday: true,
    avatarUrl: "/avatars/avatar-9.svg",
    category: "Взрослые"
  },
  {
    id: "viktor-sergeev",
    name: "Виктор Сергеев",
    subjects: ["История", "Обществознание"],
    bio: "Готовлю к ЕГЭ и олимпиадам, учу мыслить критически и аргументировать.",
    rating: 4.7,
    reviewsCount: 113,
    pricePerHour: 1600,
    badges: ["Проверен"],
    availableToday: false,
    avatarUrl: "/avatars/avatar-10.svg",
    category: "Подростки"
  },
  {
    id: "yana-zorina",
    name: "Яна Зорина",
    subjects: ["Французский", "Подготовка к DELF"],
    bio: "Французский с упором на устную речь и академические цели.",
    rating: 5,
    reviewsCount: 67,
    pricePerHour: 2400,
    badges: ["Проверен", "Топ"],
    availableToday: true,
    avatarUrl: "/avatars/avatar-11.svg",
    category: "Взрослые"
  },
  {
    id: "kirill-andreev",
    name: "Кирилл Андреев",
    subjects: ["Математика", "Начальная школа"],
    bio: "Спокойно и понятно объясняю математику младшим школьникам.",
    rating: 4.8,
    reviewsCount: 54,
    pricePerHour: 1300,
    badges: ["Проверен"],
    availableToday: true,
    avatarUrl: "/avatars/avatar-12.svg",
    category: "Дети"
  }
];

export const subjects = [
  "Все предметы",
  "Английский",
  "Математика",
  "Русский язык",
  "Программирование",
  "Физика",
  "Химия",
  "Биология",
  "Немецкий",
  "Французский"
];

export const categories: Array<Teacher["category"]> = ["Дети", "Подростки", "Студенты", "Взрослые"];
