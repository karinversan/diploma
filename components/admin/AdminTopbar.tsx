"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Menu, Search } from "lucide-react";

import { adminProfile } from "@/data/admin";

type AdminTopbarProps = {
  pathname: string;
  onOpenSidebar: () => void;
};

const titleMap: Array<{ match: string; title: string; subtitle: string }> = [
  { match: "/admin/dashboard", title: "Админ-панель", subtitle: "Операционные метрики, модерация и контроль качества платформы" },
  { match: "/admin/users", title: "Пользователи", subtitle: "Управление учениками, преподавателями и доступами" },
  { match: "/admin/lessons", title: "Занятия и инциденты", subtitle: "Мониторинг спорных уроков и эскалаций" },
  { match: "/admin/payments", title: "Платежи и возвраты", subtitle: "Контроль финансовых операций и заявок на возврат" },
  { match: "/admin/quality", title: "Качество и тестирование", subtitle: "Unit, integration, e2e и метрики ИИ/UX" },
  { match: "/admin/settings", title: "Настройки платформы", subtitle: "Фичи, лимиты и параметры модерации" }
];

function resolveHeading(pathname: string) {
  return titleMap.find((item) => pathname === item.match || pathname.startsWith(`${item.match}/`)) ?? titleMap[0];
}

export function AdminTopbar({ pathname, onOpenSidebar }: AdminTopbarProps) {
  const heading = resolveHeading(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/85 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-white text-foreground lg:hidden"
            aria-label="Открыть меню администратора"
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
              placeholder="Поиск по пользователям, тикетам и платежам…"
              className="w-full rounded-2xl border border-border bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary"
              aria-label="Поиск в админ-панели"
            />
          </label>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-white text-foreground transition hover:border-primary"
            aria-label="Уведомления"
          >
            <Bell className="h-4 w-4" />
          </button>

          <details className="relative">
            <summary className="list-none [&::-webkit-details-marker]:hidden">
              <span className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-border bg-white px-2.5 py-1.5">
                <Image
                  src={adminProfile.avatarUrl}
                  alt={`Аватар ${adminProfile.name}`}
                  width={30}
                  height={30}
                  className="h-[30px] w-[30px] rounded-xl"
                />
                <span className="hidden text-sm font-semibold text-foreground md:block">{adminProfile.name}</span>
              </span>
            </summary>

            <div className="absolute right-0 top-[calc(100%+0.5rem)] w-64 rounded-2xl border border-border bg-white p-2 shadow-card">
              <p className="px-3 py-2 text-xs font-medium uppercase text-muted-foreground">Режимы кабинета</p>
              <Link href="/app" className="block rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-slate-50">
                Кабинет ученика
              </Link>
              <Link href="/teacher" className="block rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-slate-50">
                Кабинет преподавателя
              </Link>
              <div className="my-1 h-px bg-border" />
              <Link href="/login?role=admin" className="block rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-slate-50">
                Выйти (демо)
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
