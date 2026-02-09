import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Админ-панель | УмныйКласс",
  description: "Модерация платформы, контроль качества, пользователи, инциденты и платежи."
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell>{children}</AdminShell>;
}
