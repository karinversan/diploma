import Link from "next/link";
import {
  BookOpen,
  BookOpenCheck,
  CircleHelp,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  NotebookText,
  Settings,
  Sparkles,
  X
} from "lucide-react";

import { cn } from "@/lib/utils";

type SidebarProps = {
  pathname: string;
  onNavigate?: () => void;
  onClose?: () => void;
  className?: string;
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

const mainNavItems: NavItem[] = [
  { href: "/app/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { href: "/app/courses", label: "Курсы", icon: BookOpen },
  { href: "/app/lessons", label: "Расписание", icon: BookOpenCheck },
  { href: "/app/homework", label: "Домашка", icon: NotebookText },
  { href: "/app/vocabulary", label: "Словарь", icon: Sparkles },
  { href: "/app/teachers", label: "Преподаватели", icon: GraduationCap },
  { href: "/app/messages", label: "Сообщения", icon: MessageSquare },
  { href: "/app/analytics", label: "Аналитика", icon: LineChart },
  { href: "/app/payments", label: "Платежи", icon: CreditCard },
  { href: "/app/settings", label: "Настройки", icon: Settings }
];

const supportItem: NavItem = {
  href: "/contacts",
  label: "Поддержка",
  icon: CircleHelp,
  exact: true
};

function isRouteActive(pathname: string, item: NavItem) {
  const normalizedHref = item.href.split("#")[0];

  if (item.exact) {
    return pathname === normalizedHref;
  }

  return pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`);
}

function SidebarNavLink({ item, pathname, onNavigate }: { item: NavItem; pathname: string; onNavigate?: () => void }) {
  const active = isRouteActive(pathname, item);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-300 transition",
        active ? "bg-primary text-primary-foreground" : "hover:bg-slate-800 hover:text-white"
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className={cn("h-4 w-4", active ? "text-primary-foreground" : "text-slate-400 group-hover:text-white")} />
      <span>{item.label}</span>
    </Link>
  );
}

export function Sidebar({ pathname, onNavigate, onClose, className }: SidebarProps) {
  return (
    <aside className={cn("flex h-full flex-col rounded-[28px] border border-slate-800 bg-slate-950 p-4 shadow-card", className)}>
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link href="/app/dashboard" onClick={onNavigate} className="inline-flex items-center gap-2 text-white" aria-label="УмныйКласс">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
            УК
          </span>
          <span className="text-lg font-semibold">УмныйКласс</span>
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

      <nav aria-label="Навигация личного кабинета" className="space-y-1.5">
        {mainNavItems.map((item) => (
          <SidebarNavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900 p-3">
        <SidebarNavLink item={supportItem} pathname={pathname} onNavigate={onNavigate} />
        <p className="mt-2 text-xs text-slate-400">Помогаем с переносом уроков, оплатой и доступом к материалам.</p>
      </div>
    </aside>
  );
}
