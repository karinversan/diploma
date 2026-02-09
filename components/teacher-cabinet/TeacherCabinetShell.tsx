"use client";

import Link from "next/link";
import { BookOpen, CalendarDays, LayoutDashboard, MessageSquare, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { TeacherCabinetSidebar } from "@/components/teacher-cabinet/TeacherCabinetSidebar";
import { TeacherCabinetTopbar } from "@/components/teacher-cabinet/TeacherCabinetTopbar";
import { cn } from "@/lib/utils";

type TeacherCabinetShellProps = {
  children: React.ReactNode;
};

const mobileNavItems = [
  { href: "/teacher/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { href: "/teacher/classroom", label: "Класс", icon: CalendarDays },
  { href: "/teacher/courses", label: "Курсы", icon: BookOpen },
  { href: "/teacher/messages", label: "Чат", icon: MessageSquare },
  { href: "/teacher/payouts", label: "Выплаты", icon: Wallet }
];

function isMobileItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function TeacherCabinetShell({ children }: TeacherCabinetShellProps) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_22%_6%,rgba(116,76,255,0.12),transparent_30%),radial-gradient(circle_at_85%_0%,rgba(185,250,119,0.18),transparent_26%),#f6f7fd]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[288px] p-4 lg:block">
        <TeacherCabinetSidebar pathname={pathname} />
      </aside>

      <div className="min-h-screen lg:pl-[288px]">
        <TeacherCabinetTopbar pathname={pathname} onOpenSidebar={() => setIsMobileSidebarOpen(true)} />
        <main className="px-4 pb-24 pt-6 sm:px-6 lg:px-10">{children}</main>
      </div>

      {isMobileSidebarOpen ? (
        <>
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
            aria-label="Закрыть меню преподавателя"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[88vw] max-w-[320px] p-3 lg:hidden">
            <TeacherCabinetSidebar
              pathname={pathname}
              onNavigate={() => setIsMobileSidebarOpen(false)}
              onClose={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </>
      ) : null}

      <nav
        className="fixed inset-x-3 bottom-3 z-20 grid grid-cols-5 gap-1 rounded-2xl border border-border/80 bg-white/95 p-1 shadow-card backdrop-blur lg:hidden"
        aria-label="Быстрая навигация преподавателя"
      >
        {mobileNavItems.map((item) => {
          const active = isMobileItemActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
