"use client";

import Link from "next/link";
import { AlertTriangle, CreditCard, LayoutDashboard, ShieldCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: React.ReactNode;
};

const mobileNavItems = [
  { href: "/admin/dashboard", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/users", label: "Люди", icon: Users },
  { href: "/admin/lessons", label: "Инциденты", icon: AlertTriangle },
  { href: "/admin/payments", label: "Платежи", icon: CreditCard },
  { href: "/admin/quality", label: "Качество", icon: ShieldCheck }
];

function isMobileItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_18%_8%,rgba(116,76,255,0.12),transparent_30%),radial-gradient(circle_at_88%_2%,rgba(185,250,119,0.2),transparent_28%),#f6f7fd]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[288px] p-4 lg:block">
        <AdminSidebar pathname={pathname} />
      </aside>

      <div className="min-h-screen lg:pl-[288px]">
        <AdminTopbar pathname={pathname} onOpenSidebar={() => setIsMobileSidebarOpen(true)} />
        <main className="px-4 pb-24 pt-6 sm:px-6 lg:px-10">{children}</main>
      </div>

      {isMobileSidebarOpen ? (
        <>
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
            aria-label="Закрыть меню администратора"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[88vw] max-w-[320px] p-3 lg:hidden">
            <AdminSidebar
              pathname={pathname}
              onNavigate={() => setIsMobileSidebarOpen(false)}
              onClose={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </>
      ) : null}

      <nav
        className="fixed inset-x-3 bottom-3 z-20 grid grid-cols-5 gap-1 rounded-2xl border border-border/80 bg-white/95 p-1 shadow-card backdrop-blur lg:hidden"
        aria-label="Быстрая навигация администратора"
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
