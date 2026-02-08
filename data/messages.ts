export type ChatMessage = {
  id: string;
  sender: "student" | "teacher";
  text: string;
  sentAt: string;
};

export type MessageThread = {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherAvatarUrl: string;
  subject: string;
  lastMessage: string;
  unreadCount: number;
  updatedAt: string;
  messages: ChatMessage[];
};

export const messageThreads: MessageThread[] = [
  {
    id: "thread-natalya",
    teacherId: "natalya-smirnova",
    teacherName: "Наталья Смирнова",
    teacherAvatarUrl: "/avatars/avatar-1.svg",
    subject: "Английский",
    lastMessage: "Проверьте, пожалуйста, список выражений перед уроком.",
    unreadCount: 1,
    updatedAt: "2026-02-08T16:40:00+03:00",
    messages: [
      {
        id: "msg-001",
        sender: "teacher",
        text: "Добрый день! Напоминаю, сегодня урок в 19:10.",
        sentAt: "2026-02-08T15:30:00+03:00"
      },
      {
        id: "msg-002",
        sender: "student",
        text: "Отлично, буду вовремя. Подготовила домашнее задание.",
        sentAt: "2026-02-08T15:41:00+03:00"
      },
      {
        id: "msg-003",
        sender: "teacher",
        text: "Проверьте, пожалуйста, список выражений перед уроком.",
        sentAt: "2026-02-08T16:40:00+03:00"
      }
    ]
  },
  {
    id: "thread-alexey",
    teacherId: "alexey-ivanov",
    teacherName: "Алексей Иванов",
    teacherAvatarUrl: "/avatars/avatar-2.svg",
    subject: "Математика",
    lastMessage: "На следующем занятии разберём задания 13 и 15.",
    unreadCount: 0,
    updatedAt: "2026-02-08T11:05:00+03:00",
    messages: [
      {
        id: "msg-004",
        sender: "student",
        text: "По задаче 12 остался вопрос про замену переменной.",
        sentAt: "2026-02-08T10:34:00+03:00"
      },
      {
        id: "msg-005",
        sender: "teacher",
        text: "На следующем занятии разберём задания 13 и 15.",
        sentAt: "2026-02-08T11:05:00+03:00"
      }
    ]
  },
  {
    id: "thread-maksim",
    teacherId: "maksim-volkov",
    teacherName: "Максим Волков",
    teacherAvatarUrl: "/avatars/avatar-6.svg",
    subject: "Программирование",
    lastMessage: "Посмотрел PR, есть 2 комментария по структуре функций.",
    unreadCount: 2,
    updatedAt: "2026-02-07T20:12:00+03:00",
    messages: [
      {
        id: "msg-006",
        sender: "teacher",
        text: "Посмотрел PR, есть 2 комментария по структуре функций.",
        sentAt: "2026-02-07T20:12:00+03:00"
      }
    ]
  },
  {
    id: "thread-irina",
    teacherId: "irina-petrova",
    teacherName: "Ирина Петрова",
    teacherAvatarUrl: "/avatars/avatar-3.svg",
    subject: "Русский язык",
    lastMessage: "Отличная работа по аргументации, добавьте более сильное заключение.",
    unreadCount: 0,
    updatedAt: "2026-02-06T18:22:00+03:00",
    messages: [
      {
        id: "msg-007",
        sender: "teacher",
        text: "Отличная работа по аргументации, добавьте более сильное заключение.",
        sentAt: "2026-02-06T18:22:00+03:00"
      }
    ]
  }
];

export function getThreadById(id: string) {
  return messageThreads.find((thread) => thread.id === id);
}
