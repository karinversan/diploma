export type PaymentTransaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: "₽";
  status: "Оплачен" | "Ожидает" | "Возврат";
  method: string;
};

export type LessonPackage = {
  id: string;
  name: string;
  lessonsLeft: number;
  totalLessons: number;
  expiresAt: string;
};

export const paymentTransactions: PaymentTransaction[] = [
  {
    id: "pay-001",
    date: "2026-02-01",
    description: "Пакет «Прогресс» — 8 занятий",
    amount: 5490,
    currency: "₽",
    status: "Оплачен",
    method: "Банковская карта •••• 4242"
  },
  {
    id: "pay-002",
    date: "2026-01-15",
    description: "Индивидуальное занятие по математике",
    amount: 1900,
    currency: "₽",
    status: "Оплачен",
    method: "СБП"
  },
  {
    id: "pay-003",
    date: "2026-01-04",
    description: "Пакет «Старт» — 4 занятия",
    amount: 2990,
    currency: "₽",
    status: "Оплачен",
    method: "Банковская карта •••• 4242"
  },
  {
    id: "pay-004",
    date: "2025-12-21",
    description: "Возврат за перенесенное занятие",
    amount: -1200,
    currency: "₽",
    status: "Возврат",
    method: "На исходный способ оплаты"
  }
];

export const lessonPackages: LessonPackage[] = [
  {
    id: "pack-001",
    name: "Пакет «Прогресс»",
    lessonsLeft: 5,
    totalLessons: 8,
    expiresAt: "2026-03-01"
  },
  {
    id: "pack-002",
    name: "Практика английского",
    lessonsLeft: 2,
    totalLessons: 4,
    expiresAt: "2026-02-18"
  }
];

export const paymentMethods = ["Банковская карта •••• 4242", "СБП", "Apple Pay (подключено)"];
