"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search } from "lucide-react";

import { teacherCabinetProfile } from "@/data/teacher-cabinet";
import { NotificationCenter } from "@/components/shared/NotificationCenter";

type TeacherCabinetTopbarProps = {
  pathname: string;
  onOpenSidebar: () => void;
};

const titleMap: Array<{ match: string; title: string; subtitle: string }> = [
  {
    match: "/teacher/dashboard",
    title: "Кабинет преподавателя",
    subtitle: "Управляйте курсами, уроками, учениками и аналитикой"
  },
  { match: "/teacher/classroom", title: "Мой класс", subtitle: "Курсы, календарь, ученики и операции по занятиям" },
  { match: "/teacher/courses", title: "Курсы", subtitle: "Создание, публикация и контроль контента по модулям" },
  { match: "/teacher/quizzes", title: "Квизы и тесты", subtitle: "Сборка тестов, сценарии прохождения и проверка результатов" },
  { match: "/teacher/messages", title: "Сообщения", subtitle: "Общение с учениками и согласование учебных шагов" },
  { match: "/teacher/analytics", title: "Аналитика", subtitle: "Доход, прогресс групп и ключевые метрики обучения" },
  { match: "/teacher/payouts", title: "Выплаты", subtitle: "История поступлений, статусы и детали транзакций" },
  { match: "/teacher/settings", title: "Настройки", subtitle: "Профиль преподавателя и параметры кабинета" }
];

function resolveHeading(pathname: string) {
  return titleMap.find((item) => pathname === item.match || pathname.startsWith(`${item.match}/`)) ?? titleMap[0];
}

export function TeacherCabinetTopbar({ pathname, onOpenSidebar }: TeacherCabinetTopbarProps) {
  const heading = resolveHeading(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/85 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-white text-foreground lg:hidden"
            aria-label="Открыть меню преподавателя"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <p className="truncate text-xl font-semibold text-foreground">{heading.title}</p>
            <p className="hidden truncate text-sm text-muted-foreground sm:block">{heading.subtitle}</p>
          </div>
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto sm:flex-1 sm:justify-end">
          <label className="relative min-w-0 flex-1 sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Поиск курса, ученика или занятия…"
              className="w-full rounded-2xl border border-border bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary"
              aria-label="Поиск в кабинете преподавателя"
            />
          </label>

          <NotificationCenter role="teacher" />

          <details className="relative">
            <summary className="list-none [&::-webkit-details-marker]:hidden">
              <span className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-border bg-white px-2.5 py-1.5">
                <Image
                  src={teacherCabinetProfile.avatarUrl}
                  alt={`Аватар ${teacherCabinetProfile.name}`}
                  width={30}
                  height={30}
                  className="h-[30px] w-[30px] rounded-xl"
                />
                <span className="hidden text-sm font-semibold text-foreground md:block">{teacherCabinetProfile.name}</span>
              </span>
            </summary>

            <div className="absolute right-0 top-[calc(100%+0.5rem)] w-56 rounded-2xl border border-border bg-white p-2 shadow-card">
              <Link href="/teacher/settings" className="block rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-slate-50">
                Профиль преподавателя
              </Link>
              <Link href="/teacher/payouts" className="block rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-slate-50">
                Выплаты
              </Link>
              <div className="my-1 h-px bg-border" />
              <Link href="/app" className="block rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-slate-50">
                Перейти в кабинет ученика
              </Link>
              <Link href="/admin" className="block rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-slate-50">
                Перейти в кабинет администратора
              </Link>
              <Link href="/login?role=teacher" className="block rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-slate-50">
                Выйти (демо)
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
