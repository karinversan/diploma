export type AdminPlatformKpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "stable";
};

export type TutorVerificationRequest = {
  id: string;
  tutorName: string;
  subjects: string[];
  experienceYears: number;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  note?: string;
};

export type PlatformUser = {
  id: string;
  name: string;
  role: "student" | "teacher" | "admin";
  email: string;
  status: "active" | "blocked" | "invited";
  registeredAt: string;
  lastActivityAt: string;
};

export type LessonIncident = {
  id: string;
  lessonTitle: string;
  teacherName: string;
  studentName: string;
  type: "связь" | "оплата" | "контент" | "поведение";
  severity: "низкий" | "средний" | "высокий";
  createdAt: string;
  status: "open" | "in_progress" | "resolved";
};

export type RefundTicket = {
  id: string;
  invoice: string;
  studentName: string;
  amountRubles: number;
  reason: string;
  createdAt: string;
  status: "pending" | "approved" | "declined";
};

export type TestRun = {
  id: string;
  suite: "Unit" | "Integration" | "E2E";
  total: number;
  passed: number;
  failed: number;
  durationSeconds: number;
  updatedAt: string;
};

export type AiQualityMetric = {
  id: string;
  label: string;
  value: string;
  target: string;
  status: "ok" | "warning" | "critical";
  hint: string;
};

export type UxMetric = {
  id: string;
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  description: string;
};

export const adminProfile = {
  name: "Мария Ким",
  role: "Администратор платформы",
  avatarUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=120&q=80"
};

export const platformKpis: AdminPlatformKpi[] = [
  { id: "active_students", label: "Активные ученики", value: "1 284", delta: "+6.2% за неделю", trend: "up" },
  { id: "active_teachers", label: "Активные преподаватели", value: "176", delta: "+3.1% за неделю", trend: "up" },
  { id: "lessons_today", label: "Занятий сегодня", value: "342", delta: "-1.4% к вчера", trend: "down" },
  { id: "nps", label: "Индекс удовлетворенности", value: "71", delta: "Стабильно", trend: "stable" }
];

export const tutorVerificationQueue: TutorVerificationRequest[] = [
  {
    id: "tv-001",
    tutorName: "Елена Марченко",
    subjects: ["Английский", "IELTS"],
    experienceYears: 7,
    submittedAt: "2026-02-09T09:10:00+03:00",
    status: "pending"
  },
  {
    id: "tv-002",
    tutorName: "Сергей Громов",
    subjects: ["Математика", "ЕГЭ"],
    experienceYears: 4,
    submittedAt: "2026-02-08T18:35:00+03:00",
    status: "pending"
  },
  {
    id: "tv-003",
    tutorName: "Нина Шульгина",
    subjects: ["Экономика"],
    experienceYears: 9,
    submittedAt: "2026-02-07T14:00:00+03:00",
    status: "approved",
    note: "Проверка документов завершена"
  }
];

export const adminUsers: PlatformUser[] = [
  {
    id: "u-001",
    name: "София Анисимова",
    role: "student",
    email: "sofia@example.com",
    status: "active",
    registeredAt: "2025-11-20T10:20:00+03:00",
    lastActivityAt: "2026-02-09T13:44:00+03:00"
  },
  {
    id: "u-002",
    name: "Наталья Смирнова",
    role: "teacher",
    email: "n.smirnova@example.com",
    status: "active",
    registeredAt: "2025-09-16T09:10:00+03:00",
    lastActivityAt: "2026-02-09T15:05:00+03:00"
  },
  {
    id: "u-003",
    name: "Денис Волков",
    role: "student",
    email: "denis@example.com",
    status: "blocked",
    registeredAt: "2025-12-02T12:40:00+03:00",
    lastActivityAt: "2026-02-03T09:30:00+03:00"
  },
  {
    id: "u-004",
    name: "Алина Прохорова",
    role: "teacher",
    email: "a.prokhorova@example.com",
    status: "invited",
    registeredAt: "2026-02-08T16:25:00+03:00",
    lastActivityAt: "2026-02-08T16:25:00+03:00"
  },
  {
    id: "u-005",
    name: "Мария Ким",
    role: "admin",
    email: "admin@skillzone.example",
    status: "active",
    registeredAt: "2025-06-01T09:00:00+03:00",
    lastActivityAt: "2026-02-09T15:12:00+03:00"
  }
];

export const lessonIncidents: LessonIncident[] = [
  {
    id: "inc-001",
    lessonTitle: "Разговорный английский B2",
    teacherName: "Наталья Смирнова",
    studentName: "Ирина Котова",
    type: "связь",
    severity: "средний",
    createdAt: "2026-02-09T11:25:00+03:00",
    status: "in_progress"
  },
  {
    id: "inc-002",
    lessonTitle: "Экономика: макроуровень",
    teacherName: "Анна Акимова",
    studentName: "Максим Савин",
    type: "контент",
    severity: "низкий",
    createdAt: "2026-02-09T09:48:00+03:00",
    status: "open"
  },
  {
    id: "inc-003",
    lessonTitle: "Математика профиль",
    teacherName: "Илья Котов",
    studentName: "Олег Миронов",
    type: "поведение",
    severity: "высокий",
    createdAt: "2026-02-08T20:15:00+03:00",
    status: "open"
  }
];

export const refundTickets: RefundTicket[] = [
  {
    id: "rf-001",
    invoice: "#4312",
    studentName: "Ирина Котова",
    amountRubles: 2490,
    reason: "Урок не состоялся по технической причине",
    createdAt: "2026-02-09T12:10:00+03:00",
    status: "pending"
  },
  {
    id: "rf-002",
    invoice: "#4308",
    studentName: "Максим Савин",
    amountRubles: 1990,
    reason: "Перенос без согласования",
    createdAt: "2026-02-08T17:42:00+03:00",
    status: "approved"
  },
  {
    id: "rf-003",
    invoice: "#4302",
    studentName: "Олег Миронов",
    amountRubles: 1590,
    reason: "Неактуальная заявка",
    createdAt: "2026-02-07T15:03:00+03:00",
    status: "declined"
  }
];

export const testRuns: TestRun[] = [
  { id: "tr-1", suite: "Unit", total: 186, passed: 183, failed: 3, durationSeconds: 46, updatedAt: "2026-02-09T14:21:00+03:00" },
  {
    id: "tr-2",
    suite: "Integration",
    total: 72,
    passed: 69,
    failed: 3,
    durationSeconds: 138,
    updatedAt: "2026-02-09T14:28:00+03:00"
  },
  { id: "tr-3", suite: "E2E", total: 34, passed: 32, failed: 2, durationSeconds: 326, updatedAt: "2026-02-09T14:36:00+03:00" }
];

export const aiQualityMetrics: AiQualityMetric[] = [
  {
    id: "asr",
    label: "Точность распознавания речи",
    value: "93.4%",
    target: ">= 92%",
    status: "ok",
    hint: "Стабильно на уроках с шумом ниже среднего"
  },
  {
    id: "summary",
    label: "Оценка качества конспектов",
    value: "4.5/5",
    target: ">= 4.3/5",
    status: "ok",
    hint: "Небольшие замечания по структуре в длинных занятиях"
  },
  {
    id: "recommendations",
    label: "Релевантность рекомендаций ИИ",
    value: "81%",
    target: ">= 85%",
    status: "warning",
    hint: "Нужна корректировка весов ошибок в адаптивном подборе"
  },
  {
    id: "translation",
    label: "Точность перевода и словаря",
    value: "96.1%",
    target: ">= 95%",
    status: "ok",
    hint: "Покрытие терминов по экономике улучшено"
  }
];

export const uxMetrics: UxMetric[] = [
  {
    id: "activation",
    label: "Конверсия в первое занятие",
    value: "62%",
    trend: "up",
    description: "Доля новых учеников, дошедших до первого оплаченного урока за 7 дней"
  },
  {
    id: "retention",
    label: "Удержание 4 недели",
    value: "48%",
    trend: "up",
    description: "Процент учеников, которые продолжают занятия через 4 недели"
  },
  {
    id: "completion",
    label: "Завершение домашних заданий",
    value: "74%",
    trend: "stable",
    description: "Доля домашних заданий, закрытых в срок"
  },
  {
    id: "churn",
    label: "Отток учеников",
    value: "7.8%",
    trend: "down",
    description: "Снижение оттока после запуска адаптивных рекомендаций"
  }
];
