"use client";

import Link from "next/link";
import {
  BookOpen,
  CircleHelp,
  Coins,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Settings,
  X
} from "lucide-react";

import { cn } from "@/lib/utils";

type TeacherCabinetSidebarProps = {
  pathname: string;
  onNavigate?: () => void;
  onClose?: () => void;
};

type TeacherNavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const teacherNavItems: TeacherNavItem[] = [
  { href: "/teacher/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { href: "/teacher/classroom", label: "Мой класс", icon: GraduationCap },
  { href: "/teacher/courses", label: "Курсы", icon: BookOpen },
  { href: "/teacher/messages", label: "Сообщения", icon: MessageSquare },
  { href: "/teacher/analytics", label: "Аналитика", icon: Gauge },
  { href: "/teacher/payouts", label: "Выплаты", icon: Coins },
  { href: "/teacher/settings", label: "Настройки", icon: Settings }
];

function isItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function TeacherCabinetSidebar({ pathname, onNavigate, onClose }: TeacherCabinetSidebarProps) {
  return (
    <aside className="flex h-full flex-col rounded-[30px] border border-slate-800 bg-slate-950 p-4 shadow-card">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link href="/teacher/dashboard" onClick={onNavigate} className="inline-flex items-center gap-3 px-2 text-white">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
            SZ
          </span>
          <span className="text-2xl font-semibold tracking-tight">УмныйКласс</span>
        </Link>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 text-slate-300 transition hover:text-white"
            aria-label="Закрыть меню"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <nav aria-label="Навигация кабинета преподавателя" className="space-y-1.5">
        {teacherNavItems.map((item) => {
          const active = isItemActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition",
                active ? "bg-primary text-primary-foreground" : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={cn("h-4 w-4", active ? "text-primary-foreground" : "text-slate-400 group-hover:text-white")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900 p-3 text-xs text-slate-400">
        <Link href="/contacts" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-white">
          <CircleHelp className="h-4 w-4" />
          Поддержка
        </Link>
        <p className="mt-2">Проблемы с курсом, календарём или выплатами? Напишите в поддержку.</p>
      </div>
    </aside>
  );
}
