import Link from "next/link";

import { Header } from "@/components/Header";

export default function AppStubPage() {
  return (
    <>
      <Header showSectionLinks={false} />
      <main className="flex min-h-screen items-center justify-center px-4 pt-24">
        <section className="w-full max-w-xl rounded-3xl border border-border bg-white p-8 text-center shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Демо-кабинет</p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground">Вы вошли в приложение</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Это демо-заглушка после входа и регистрации. Здесь может быть ваш учебный кабинет.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/teachers"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              К каталогу преподавателей
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground"
            >
              На главную
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
