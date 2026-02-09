"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { DemoRole, resolveRouteByRole, writeDemoRole } from "@/lib/demo-role";

type LoginFormProps = {
  initialRole?: DemoRole;
};

const roleOptions: Array<{ id: DemoRole; label: string }> = [
  { id: "student", label: "Ученик" },
  { id: "teacher", label: "Преподаватель" },
  { id: "admin", label: "Администратор" }
];

export function LoginForm({ initialRole = "student" }: LoginFormProps) {
  const router = useRouter();
  const [role, setRole] = useState<DemoRole>(initialRole);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    window.setTimeout(() => {
      writeDemoRole(role);
      router.push(resolveRouteByRole(role));
    }, 500);
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-white p-6 shadow-soft sm:p-8">
      <h1 className="text-2xl font-semibold text-foreground">Вход в аккаунт</h1>
      <p className="mt-2 text-sm text-muted-foreground">Это демонстрационная форма без реальной авторизации.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <fieldset>
          <legend className="mb-2 block text-sm font-medium text-foreground">Войти как</legend>
          <div className="grid grid-cols-3 gap-1 rounded-2xl border border-border bg-slate-50 p-1">
            {roleOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setRole(option.id)}
                className={`rounded-xl px-2 py-2 text-xs font-semibold transition sm:text-sm ${
                  role === option.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

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

      {role !== "admin" ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Нет аккаунта?{" "}
          <Link href={`/signup?role=${role === "teacher" ? "tutor" : "student"}`} className="font-semibold text-primary">
            Создать аккаунт
          </Link>
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Для администраторов регистрация выполняется централизованно. Используйте рабочий аккаунт.
        </p>
      )}
    </div>
  );
}
