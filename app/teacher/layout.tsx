import type { Metadata } from "next";
import { Suspense } from "react";

import { TeacherCabinetShell } from "@/components/teacher-cabinet/TeacherCabinetShell";

export const metadata: Metadata = {
  title: "Кабинет преподавателя | УмныйКласс",
  description: "Управление курсами, календарем, учениками, квизами, сообщениями и выплатами преподавателя."
};

export default function TeacherLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <TeacherCabinetShell>{children}</TeacherCabinetShell>
    </Suspense>
  );
}
