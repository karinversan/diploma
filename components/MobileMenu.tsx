"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type MobileMenuProps = {
  navItems: Array<{ label: string; href: string }>;
};

export function MobileMenu({ navItems }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.removeProperty("overflow");
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.removeProperty("overflow");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-foreground"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label="Открыть меню"
      >
        <span className="sr-only">Меню</span>
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {isOpen ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <>
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </>
          )}
        </svg>
      </button>

      {isOpen ? (
        <div id="mobile-navigation" className="fixed inset-0 z-50 bg-slate-950/60 p-4" role="dialog" aria-modal="true">
          <div className="mx-auto flex h-full max-w-md flex-col rounded-3xl bg-white p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Навигация</p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-border px-3 py-1 text-sm font-medium"
              >
                Закрыть
              </button>
            </div>

            <nav className="flex-1" aria-label="Мобильное меню">
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-2xl border border-border bg-slate-50 px-4 py-3 text-base font-medium text-foreground transition hover:border-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-6 grid gap-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-border px-4 py-3 text-sm font-medium"
              >
                Войти
              </Link>
              <Link
                href="/signup?role=student"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                Начать обучение
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
