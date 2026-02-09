"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { studentProfile } from "@/data/student";

const pageTitles: Array<{ match: string; title: string; subtitle: string }> = [
  { match: "/app/dashboard", title: "Личный кабинет", subtitle: "Контролируйте прогресс и план обучения в одном месте" },
  { match: "/app/courses", title: "Курсы", subtitle: "Подберите формат обучения под свою цель" },
  { match: "/app/lessons", title: "Занятия", subtitle: "Следите за расписанием и подключайтесь к урокам вовремя" },
  { match: "/app/homework", title: "Домашние задания", subtitle: "Не пропускайте дедлайны и сдавайте задания вовремя" },
  { match: "/app/vocabulary", title: "Словарь", subtitle: "Сохраняйте новые слова и повторяйте их в контексте" },
  { match: "/app/teachers", title: "Преподаватели", subtitle: "Найдите подходящего наставника и запишитесь на урок" },
  { match: "/app/messages", title: "Сообщения", subtitle: "Общение с преподавателями и поддержкой" },
  { match: "/app/analytics", title: "Аналитика", subtitle: "Смотрите динамику, ошибки и рекомендации по обучению" },
  { match: "/app/payments", title: "Платежи", subtitle: "Карты, транзакции, статусы оплат и возвратов" },
  { match: "/app/settings", title: "Настройки", subtitle: "Профиль, уведомления и учебные предпочтения" }
];

function resolveHeading(pathname: string) {
  const found = pageTitles.find((item) => pathname === item.match || pathname.startsWith(`${item.match}/`));

  if (found) {
    return found;
  }

  return pageTitles[0];
}

type TopbarProps = {
  pathname: string;
  onOpenSidebar: () => void;
};

export function Topbar({ pathname, onOpenSidebar }: TopbarProps) {
  const heading = resolveHeading(pathname);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();

    if (!query) {
      router.push("/app/teachers");
      return;
    }

    router.push(`/app/teachers?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-white text-foreground lg:hidden"
            aria-label="Открыть меню"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <p className="truncate text-xl font-semibold text-foreground">{heading.title}</p>
            <p className="hidden truncate text-sm text-muted-foreground sm:block">{heading.subtitle}</p>
          </div>
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto sm:flex-1 sm:justify-end">
          <form onSubmit={handleSearchSubmit} className="relative min-w-0 flex-1 sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Поиск преподавателей и предметов…"
              className="w-full rounded-2xl border border-border bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary"
              aria-label="Поиск преподавателей"
            />
          </form>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-white text-foreground transition hover:border-primary"
            aria-label="Уведомления"
          >
            <Bell className="h-4 w-4" />
          </button>

          <details className="relative">
            <summary className="list-none">
              <span className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-border bg-white px-2.5 py-1.5">
                <Image
                  src={studentProfile.avatarUrl}
                  alt={`Аватар пользователя ${studentProfile.name}`}
                  width={30}
                  height={30}
                  className="h-[30px] w-[30px] rounded-xl"
                />
                <span className="hidden text-sm font-semibold text-foreground md:block">{studentProfile.name}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </span>
            </summary>

            <div className="absolute right-0 top-[calc(100%+0.5rem)] w-56 rounded-2xl border border-border bg-white p-2 shadow-card">
              <Link href="/app/settings" className="block rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-slate-50">
                Профиль и настройки
              </Link>
              <Link href="/app/payments" className="block rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-slate-50">
                Платежи
              </Link>
              <Link href="/" className="block rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-slate-50">
                Выйти (демо)
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
