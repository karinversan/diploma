"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Container } from "@/components/Container";
import { MobileMenu } from "@/components/MobileMenu";

type HeaderProps = {
  showSectionLinks?: boolean;
};

const sectionLinks = [
  { id: "how-it-works", label: "Как это работает" },
  { id: "online-class", label: "Онлайн-класс" },
  { id: "ai-features", label: "ИИ-возможности" },
  { id: "teachers", label: "Преподаватели" },
  { id: "pricing", label: "Цены" },
  { id: "for-tutors", label: "Для преподавателей" },
  { id: "faq", label: "FAQ" }
];

const pageLinks = [
  { href: "/", label: "Главная" },
  { href: "/teachers", label: "Преподаватели" },
  { href: "/for-tutors", label: "Для преподавателей" },
  { href: "/signup?role=student", label: "Регистрация" }
];

export function Header({ showSectionLinks = true }: HeaderProps) {
  const pathname = usePathname();

  const navItems = showSectionLinks
    ? sectionLinks.map((link) => ({
        label: link.label,
        href: pathname === "/" ? `#${link.id}` : `/#${link.id}`
      }))
    : pageLinks;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/60 bg-white/85 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground"
          aria-label="УмныйКласс"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
            УК
          </span>
          УмныйКласс
        </Link>

        <nav className="hidden flex-1 items-center justify-center lg:flex" aria-label="Навигация по разделам">
          <ul className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link className="transition-colors hover:text-foreground" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            Войти
          </Link>
          <Link
            href="/signup?role=student"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-90"
          >
            Начать
          </Link>
        </div>

        <MobileMenu navItems={navItems} />
      </Container>
    </header>
  );
}
