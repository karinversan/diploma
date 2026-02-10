"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { teachers } from "@/data/teachers";
import { resolveRouteByRole, writeDemoRole } from "@/lib/demo-role";
import { createTutorApplicationViaApi } from "@/lib/api/tutor-applications-client";

type SignupFormProps = {
  initialRole: "student" | "tutor";
  selectedTeacher?: string;
};

export function SignupForm({ initialRole, selectedTeacher }: SignupFormProps) {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "tutor">(initialRole);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const heading = useMemo(
    () => (role === "student" ? "Регистрация ученика" : "Регистрация преподавателя"),
    [role]
  );
  const selectedTeacherName = useMemo(
    () => teachers.find((teacher) => teacher.id === selectedTeacher)?.name ?? selectedTeacher,
    [selectedTeacher]
  );

  const toggleRole = (nextRole: "student" | "tutor") => {
    setRole(nextRole);
    const query = selectedTeacher
      ? `/signup?role=${nextRole}&teacher=${encodeURIComponent(selectedTeacher)}`
      : `/signup?role=${nextRole}`;
    router.replace(query);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsSubmitting(true);

    window.setTimeout(() => {
      void (async () => {
        if (role === "tutor") {
          const fullName = String(formData.get("full_name") ?? "").trim();
          const phone = String(formData.get("phone") ?? "").trim();
          const email = String(formData.get("email") ?? "").trim();
          const subjects = String(formData.get("subjects") ?? "").trim();
          const experience = String(formData.get("experience") ?? "").trim();
          const about = String(formData.get("about") ?? "").trim();

          if (fullName && phone && email && subjects && experience) {
            await createTutorApplicationViaApi({
              fullName,
              phone,
              email,
              subjects,
              experience,
              message: about || undefined,
              source: "signup_form"
            });
          }
        }

        setIsSubmitting(false);
        setIsSuccess(true);
        window.setTimeout(() => {
          const nextRole = role === "tutor" ? "teacher" : "student";
          writeDemoRole(nextRole);
          router.push(nextRole === "teacher" ? "/teacher/dashboard?onboarding=pending" : resolveRouteByRole(nextRole));
        }, 700);
      })();
    }, 700);
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl border border-border bg-white p-6 shadow-soft sm:p-8">
      <h1 className="text-2xl font-semibold text-foreground">{heading}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Демо-форма: данные не отправляются на сервер.</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Нужна консультация перед регистрацией?{" "}
        <Link href={role === "student" ? "/lead?role=student" : "/lead?role=tutor"} className="font-semibold text-primary">
          Оставить заявку
        </Link>
      </p>

      <div className="mt-5 grid w-full max-w-sm grid-cols-2 rounded-full border border-border bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => toggleRole("student")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            role === "student" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          Я ученик
        </button>
        <button
          type="button"
          onClick={() => toggleRole("tutor")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            role === "tutor" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          Я преподаватель
        </button>
      </div>

      {selectedTeacher ? (
        <p className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
          Вы выбрали преподавателя: <span className="font-semibold text-foreground">{selectedTeacherName}</span>.
          Завершите регистрацию, чтобы записаться на урок.
        </p>
      ) : null}

      {isSuccess ? (
        <div className="mt-6 rounded-2xl border border-accent/60 bg-accent/30 px-5 py-6">
          <p className="text-lg font-semibold text-slate-900">
            {role === "student" ? "Успешно! Аккаунт создан." : "Заявка преподавателя отправлена на модерацию."}
          </p>
          <p className="mt-1 text-sm text-slate-700">
            {role === "student"
              ? "Перенаправляем в учебный кабинет..."
              : "Перенаправляем в кабинет преподавателя. Статус проверки будет показан на дашборде."}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-foreground">Имя и фамилия</span>
            <input
              name="full_name"
              required
              type="text"
              placeholder="Введите имя"
              className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Электронная почта</span>
            <input
              name="email"
              required
              type="email"
              placeholder="name@example.com"
              className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Телефон</span>
            <input
              name="phone"
              required
              type="tel"
              placeholder="+7 (___) ___-__-__"
              className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
            />
          </label>

          {role === "tutor" ? (
            <>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-foreground">Предметы</span>
                <input
                  name="subjects"
                  required
                  type="text"
                  placeholder="Например: Английский, IELTS"
                  className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">Опыт преподавания</span>
                <select
                  name="experience"
                  required
                  className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
                >
                  <option value="">Выберите</option>
                  <option value="1-2">1–2 года</option>
                  <option value="3-5">3–5 лет</option>
                  <option value="6+">6+ лет</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">Формат уроков</span>
                <select
                  required
                  className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
                >
                  <option value="">Выберите</option>
                  <option value="individual">Индивидуальные</option>
                  <option value="group">Групповые</option>
                  <option value="both">Оба формата</option>
                </select>
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-foreground">Кратко о себе</span>
                <textarea
                  name="about"
                  rows={4}
                  placeholder="Опишите ваш подход к обучению"
                  className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
                />
              </label>
            </>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="sm:col-span-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-70"
          >
            {isSubmitting ? "Создаем аккаунт..." : "Создать аккаунт"}
          </button>
        </form>
      )}

      <p className="mt-5 text-sm text-muted-foreground">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="font-semibold text-primary">
          Войти
        </Link>
      </p>
    </div>
  );
}
