"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    window.setTimeout(() => {
      router.push("/app");
    }, 500);
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-white p-6 shadow-soft sm:p-8">
      <h1 className="text-2xl font-semibold text-foreground">Вход в аккаунт</h1>
      <p className="mt-2 text-sm text-muted-foreground">Это демонстрационная форма без реальной авторизации.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">Электронная почта или телефон</span>
          <input
            required
            type="text"
            className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
            placeholder="Введите email или телефон"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">Пароль</span>
          <input
            required
            type="password"
            className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
            placeholder="Введите пароль"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-70"
        >
          {isSubmitting ? "Вход..." : "Войти"}
        </button>
      </form>

      <p className="mt-4 text-sm text-muted-foreground">
        Нет аккаунта?{" "}
        <Link href="/signup?role=student" className="font-semibold text-primary">
          Создать аккаунт
        </Link>
      </p>
    </div>
  );
}
