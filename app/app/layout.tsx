import type { Metadata } from "next";

import { AppShell } from "@/components/app/AppShell";

export const metadata: Metadata = {
  title: "Личный кабинет ученика | УмныйКласс",
  description: "Дашборд ученика: курсы, расписание, домашние задания, словарь, сообщения и платежи."
};

export default function StudentAppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AppShell>{children}</AppShell>;
}
