import type { Metadata } from "next";
import { Suspense } from "react";

import { AppShell } from "@/components/app/AppShell";

export const metadata: Metadata = {
  title: "Личный кабинет ученика | УмныйКласс",
  description: "Дашборд ученика: курсы, расписание, домашние задания, словарь, сообщения и платежи."
};

export default function StudentAppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
