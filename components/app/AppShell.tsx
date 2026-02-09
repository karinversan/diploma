"use client";

import Link from "next/link";
import { BookOpen, GraduationCap, LayoutDashboard, MessageSquare, NotebookText } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Sidebar } from "@/components/app/Sidebar";
import { Topbar } from "@/components/app/Topbar";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
};

const mobileNavItems = [
  { href: "/app/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { href: "/app/courses", label: "Курсы", icon: BookOpen },
  { href: "/app/teachers", label: "Учителя", icon: GraduationCap },
  { href: "/app/lessons", label: "Занятия", icon: NotebookText },
  { href: "/app/messages", label: "Чат", icon: MessageSquare }
];

function isMobileItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isLiveLessonRoom = pathname.startsWith("/app/lessons/") && searchParams.get("live") === "1";

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  if (isLiveLessonRoom) {
    return (
      <div className="min-h-screen bg-[#d3d8e3] p-2 sm:p-3 lg:p-4">
        <main className="mx-auto max-w-[1680px]">{children}</main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_18%_10%,rgba(116,76,255,0.11),transparent_32%),radial-gradient(circle_at_90%_0%,rgba(185,250,119,0.2),transparent_26%),#f7f8ff]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[288px] p-4 lg:block">
        <Sidebar pathname={pathname} />
      </aside>

      <div className="min-h-screen lg:pl-[288px]">
        <Topbar pathname={pathname} onOpenSidebar={() => setIsMobileSidebarOpen(true)} />
        <main className="px-4 pb-24 pt-6 sm:px-6 lg:px-10">{children}</main>
      </div>

      {isMobileSidebarOpen ? (
        <>
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
            aria-label="Закрыть меню"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[88vw] max-w-[320px] p-3 lg:hidden">
            <Sidebar
              pathname={pathname}
              onNavigate={() => setIsMobileSidebarOpen(false)}
              onClose={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </>
      ) : null}

      <nav
        className="fixed inset-x-3 bottom-3 z-20 grid grid-cols-5 gap-1 rounded-2xl border border-border/80 bg-white/95 p-1 shadow-card backdrop-blur lg:hidden"
        aria-label="Быстрая навигация"
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
