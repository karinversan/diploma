export type PricingPlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
};

export const studentPricingPlans: PricingPlan[] = [
  {
    id: "student-start",
    name: "Старт",
    price: "2 990 ₽",
    period: "в месяц",
    description: "Для тех, кто хочет начать с 2 уроков в неделю.",
    features: [
      "До 8 уроков в месяц",
      "Доступ к онлайн-классу",
      "ИИ-конспект после урока",
      "Поддержка в чате"
    ],
    cta: "Выбрать тариф"
  },
  {
    id: "student-pro",
    name: "Прогресс",
    price: "5 490 ₽",
    period: "в месяц",
    description: "Оптимальный выбор для стабильного роста.",
    features: [
      "До 16 уроков в месяц",
      "Приоритетный подбор преподавателя",
      "Персональные рекомендации ИИ",
      "Проверка домашних заданий"
    ],
    cta: "Выбрать тариф",
    highlight: true
  },
  {
    id: "student-intense",
    name: "Интенсив",
    price: "8 990 ₽",
    period: "в месяц",
    description: "Для ускоренной подготовки к экзаменам и целям.",
    features: [
      "До 24 уроков в месяц",
      "Индивидуальная программа",
      "Еженедельная аналитика прогресса",
      "Персональный куратор"
    ],
    cta: "Выбрать тариф"
  }
];

export const tutorPricingPlans: PricingPlan[] = [
  {
    id: "tutor-basic",
    name: "Базовый",
    price: "0 ₽",
    period: "в месяц",
    description: "Для старта и первых учеников на платформе.",
    features: [
      "Личный профиль преподавателя",
      "До 20 активных учеников",
      "Базовая аналитика уроков",
      "Комиссия 15%"
    ],
    cta: "Начать бесплатно"
  },
  {
    id: "tutor-pro",
    name: "Профи",
    price: "1 990 ₽",
    period: "в месяц",
    description: "Для преподавателей с постоянным потоком учеников.",
    features: [
      "Безлимит учеников",
      "Снижение комиссии до 10%",
      "Расширенная аналитика",
      "Выделение в каталоге"
    ],
    cta: "Подключить",
    highlight: true
  },
  {
    id: "tutor-team",
    name: "Команда",
    price: "4 990 ₽",
    period: "в месяц",
    description: "Для мини-школ и авторских команд преподавателей.",
    features: [
      "До 10 преподавателей",
      "Единый кабинет и расписание",
      "Отчеты по группе учеников",
      "Персональный менеджер"
    ],
    cta: "Оставить заявку"
  }
];
