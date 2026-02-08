import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "УмныйКласс — онлайн-занятия с ИИ-помощником",
  description:
    "AI-платформа для онлайн-обучения: видеосвязь, интерактивный класс, подбор репетиторов и персональные рекомендации.",
  openGraph: {
    title: "УмныйКласс — онлайн-занятия с ИИ-помощником",
    description:
      "Видеосвязь, совместная доска, автоконспект урока и каталог проверенных преподавателей в одном сервисе.",
    type: "website",
    locale: "ru_RU"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
