export type StudentProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  timezone: string;
  level: "Начинающий" | "Средний" | "Продвинутый";
  goals: string[];
  streakDays: number;
  targetHoursPerWeek: number;
  preferredFormats: string[];
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
};

export const studentProfile: StudentProfile = {
  id: "student-001",
  name: "Александра Новикова",
  email: "alex.novikova@example.com",
  avatarUrl: "/avatars/avatar-3.svg",
  timezone: "МСК UTC+03:00",
  level: "Средний",
  goals: ["Подготовка к экзамену", "Разговорный английский", "Повышение успеваемости"],
  streakDays: 12,
  targetHoursPerWeek: 6,
  preferredFormats: ["Интерактивные занятия", "Практика"],
  notifications: {
    email: true,
    push: true,
    reminders: true
  }
};
