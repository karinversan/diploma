export type PaymentSettingsTabId = "details" | "profile" | "password" | "payment" | "notifications";

export type PaymentCardBrand = "Visa" | "Mastercard" | "Мир";
export type PaymentCardTheme = "dark" | "purple" | "light";

export type PaymentCard = {
  id: string;
  bankName: string;
  holderName: string;
  last4: string;
  exp: string;
  brand: PaymentCardBrand;
  theme: PaymentCardTheme;
  isPrimary: boolean;
};

export type PaymentTransactionStatus = "Оплачен" | "Возврат" | "Отменен" | "В обработке";
export type PaymentTransactionType = "course" | "lesson" | "subscription";

export type PaymentTransaction = {
  id: string;
  invoice: string;
  date: string;
  status: PaymentTransactionStatus;
  productTitle: string;
  productSubtitle: string;
  teacherName: string;
  cardId: string;
  amount: number;
  currency: "₽";
  type: PaymentTransactionType;
};

export const paymentSettingsTabs: Array<{ id: PaymentSettingsTabId; label: string }> = [
  { id: "details", label: "Мои данные" },
  { id: "profile", label: "Профиль" },
  { id: "password", label: "Пароль" },
  { id: "payment", label: "Платежные данные" },
  { id: "notifications", label: "Уведомления" }
];

export const paymentStatusFilters: Array<{ id: "all" | PaymentTransactionStatus; label: string }> = [
  { id: "all", label: "Все статусы" },
  { id: "Оплачен", label: "Оплачен" },
  { id: "В обработке", label: "В обработке" },
  { id: "Возврат", label: "Возврат" },
  { id: "Отменен", label: "Отменен" }
];

export const paymentCards: PaymentCard[] = [
  {
    id: "card-3139",
    bankName: "SkillZone Bank",
    holderName: "София Анисимова",
    last4: "3139",
    exp: "06/27",
    brand: "Mastercard",
    theme: "dark",
    isPrimary: true
  },
  {
    id: "card-5320",
    bankName: "SkillZone Plus",
    holderName: "София Анисимова",
    last4: "5320",
    exp: "10/28",
    brand: "Visa",
    theme: "purple",
    isPrimary: false
  }
];

export const paymentTransactions: PaymentTransaction[] = [
  {
    id: "trx-3066",
    invoice: "#3066",
    date: "2026-02-07",
    status: "Оплачен",
    productTitle: "Пакет: Аналитика бизнеса",
    productSubtitle: "Курс и практикум",
    teacherName: "Анна Акимова",
    cardId: "card-3139",
    amount: 7490,
    currency: "₽",
    type: "course"
  },
  {
    id: "trx-3064",
    invoice: "#3064",
    date: "2026-01-28",
    status: "Оплачен",
    productTitle: "Курс Python-разработки",
    productSubtitle: "Курс + домашние задания",
    teacherName: "Евгений Ларионов",
    cardId: "card-5320",
    amount: 6890,
    currency: "₽",
    type: "course"
  },
  {
    id: "trx-3062",
    invoice: "#3062",
    date: "2026-01-21",
    status: "Возврат",
    productTitle: "Интенсив по экономике",
    productSubtitle: "Отмененный блок",
    teacherName: "Карина Лукьянова",
    cardId: "card-3139",
    amount: -2600,
    currency: "₽",
    type: "lesson"
  },
  {
    id: "trx-3060",
    invoice: "#3060",
    date: "2026-01-12",
    status: "Отменен",
    productTitle: "Экономика: введение",
    productSubtitle: "Пробный поток",
    teacherName: "Дарья Комарова",
    cardId: "card-5320",
    amount: 0,
    currency: "₽",
    type: "course"
  },
  {
    id: "trx-3058",
    invoice: "#3058",
    date: "2026-01-05",
    status: "Оплачен",
    productTitle: "Подписка Pro для ученика",
    productSubtitle: "1 месяц доступа",
    teacherName: "Платформа SkillZone",
    cardId: "card-3139",
    amount: 1290,
    currency: "₽",
    type: "subscription"
  },
  {
    id: "trx-3056",
    invoice: "#3056",
    date: "2025-12-23",
    status: "В обработке",
    productTitle: "Пакет уроков по математике",
    productSubtitle: "8 индивидуальных занятий",
    teacherName: "Илья Котов",
    cardId: "card-3139",
    amount: 5900,
    currency: "₽",
    type: "lesson"
  },
  {
    id: "trx-3054",
    invoice: "#3054",
    date: "2025-12-18",
    status: "Оплачен",
    productTitle: "Разговорный английский",
    productSubtitle: "Модуль B2",
    teacherName: "Наталья Смирнова",
    cardId: "card-5320",
    amount: 4190,
    currency: "₽",
    type: "course"
  },
  {
    id: "trx-3052",
    invoice: "#3052",
    date: "2025-12-04",
    status: "Оплачен",
    productTitle: "Подписка Pro для ученика",
    productSubtitle: "1 месяц доступа",
    teacherName: "Платформа SkillZone",
    cardId: "card-3139",
    amount: 1290,
    currency: "₽",
    type: "subscription"
  }
];

export function getPaymentCardById(cardId: string) {
  return paymentCards.find((card) => card.id === cardId);
}
