import Link from "next/link";

import { Container } from "@/components/Container";

const socialLinks = [
  { href: "#", label: "Telegram" },
  { href: "#", label: "VK" },
  { href: "#", label: "YouTube" }
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-white/90 py-10">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-foreground">УмныйКласс</p>
            <p className="mt-2 text-sm text-muted-foreground">AI-платформа для онлайн-обучения и живых уроков с преподавателем.</p>
          </div>

          <nav aria-label="Нижняя навигация" className="flex flex-wrap gap-5 text-sm text-muted-foreground">
            <Link href="/privacy" className="transition hover:text-foreground">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="transition hover:text-foreground">
              Пользовательское соглашение
            </Link>
            <Link href="/contacts" className="transition hover:text-foreground">
              Контакты
            </Link>
          </nav>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">© 2026 УмныйКласс. Все права защищены.</p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground transition hover:text-foreground"
                aria-label={social.label}
              >
                {social.label.slice(0, 1)}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
