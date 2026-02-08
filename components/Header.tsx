"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Container } from "@/components/Container";
import { MobileMenu } from "@/components/MobileMenu";

type HeaderAction = {
  label: string;
  href: string;
};

type HeaderProps = {
  showSectionLinks?: boolean;
  navItems?: Array<{ label: string; href: string }>;
  secondaryAction?: HeaderAction;
  primaryAction?: HeaderAction;
  navLabel?: string;
};

const sectionLinks = [
  { id: "how-it-works", label: "Как это работает" },
  { id: "online-class", label: "Онлайн-класс" },
  { id: "ai-features", label: "ИИ-возможности" },
  { id: "teachers", label: "Преподаватели" },
  { id: "pricing", label: "Цены" },
  { id: "for-tutors", label: "Для преподавателей" },
  { id: "faq", label: "Вопросы" }
];

const pageLinks = [
  { href: "/", label: "Главная" },
  { href: "/teachers", label: "Найти репетитора" },
  { href: "/assessment", label: "Тестирование" },
  { href: "/#how-it-works", label: "Как это работает" },
  { href: "/#pricing", label: "Цены" },
  { href: "/lead?role=student", label: "Оставить заявку" }
];

const defaultSecondaryAction = { label: "Войти", href: "/login" };
const defaultPrimaryAction = { label: "Оставить заявку", href: "/lead?role=student" };

export function Header({
  showSectionLinks = true,
  navItems,
  secondaryAction = defaultSecondaryAction,
  primaryAction = defaultPrimaryAction,
  navLabel = "Навигация по разделам"
}: HeaderProps) {
  const pathname = usePathname();

  const resolvedNavItems = navItems
    ? navItems
    : showSectionLinks
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

        <nav className="hidden flex-1 items-center justify-center xl:flex" aria-label={navLabel}>
          <ul className="flex flex-nowrap items-center gap-5 text-sm font-medium text-muted-foreground">
            {resolvedNavItems.map((item) => (
              <li key={item.href}>
                <Link className="whitespace-nowrap transition-colors hover:text-foreground" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <Link
            href={secondaryAction.href}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            {secondaryAction.label}
          </Link>
          <Link
            href={primaryAction.href}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-90"
          >
            {primaryAction.label}
          </Link>
        </div>

        <MobileMenu navItems={resolvedNavItems} secondaryAction={secondaryAction} primaryAction={primaryAction} />
      </Container>
    </header>
  );
}
