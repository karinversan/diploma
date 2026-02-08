"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { assessmentSubjects } from "@/data/assessment";
import { teachers } from "@/data/teachers";

type LeadRole = "student" | "tutor";
type ContactMethod = "call" | "messenger" | "email";

type LeadFormProps = {
  initialRole: LeadRole;
  selectedTeacher?: string;
  subjectHint?: string;
  levelHint?: string;
};

const contactOptions: Array<{ value: ContactMethod; title: string; description: string }> = [
  {
    value: "call",
    title: "Звонок",
    description: "Методист свяжется и поможет с подбором формата"
  },
  {
    value: "messenger",
    title: "Мессенджер",
    description: "Напишем в удобный канал и согласуем детали"
  },
  {
    value: "email",
    title: "Эл. почта",
    description: "Пришлем варианты и план следующего шага"
  }
];

const studentGoals = [
  "Подготовка к экзамену",
  "Повышение успеваемости",
  "Язык для работы или общения",
  "Поступление в вуз",
  "Другое"
];

function safeDecode(value?: string) {
  if (!value) {
    return undefined;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function LeadForm({ initialRole, selectedTeacher, subjectHint, levelHint }: LeadFormProps) {
  const router = useRouter();
  const decodedSubjectHint = safeDecode(subjectHint);
  const decodedLevelHint = safeDecode(levelHint);

  const [role, setRole] = useState<LeadRole>(initialRole);
  const [contactMethod, setContactMethod] = useState<ContactMethod>("call");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>(
    decodedSubjectHint && assessmentSubjects.includes(decodedSubjectHint as (typeof assessmentSubjects)[number])
      ? decodedSubjectHint
      : assessmentSubjects[0]
  );
  const [wantsAssessment, setWantsAssessment] = useState(!decodedLevelHint);

  const selectedTeacherName = useMemo(
    () => teachers.find((teacher) => teacher.id === selectedTeacher)?.name ?? selectedTeacher,
    [selectedTeacher]
  );

  const toggleRole = (nextRole: LeadRole) => {
    setRole(nextRole);
    setIsSubmitted(false);
    const query = new URLSearchParams();
    query.set("role", nextRole);

    if (selectedTeacher && nextRole === "student") {
      query.set("teacher", selectedTeacher);
    }

    if (decodedSubjectHint && nextRole === "student") {
      query.set("subject", decodedSubjectHint);
    }

    if (decodedLevelHint && nextRole === "student") {
      query.set("level", decodedLevelHint);
    }

    router.replace(`/lead?${query.toString()}`);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  const studentTeachersLink = `/teachers?subject=${encodeURIComponent(selectedSubject)}`;
  const assessmentLink = `/assessment?subject=${encodeURIComponent(selectedSubject)}`;
  const signupLink = selectedTeacher
    ? `/signup?role=student&teacher=${encodeURIComponent(selectedTeacher)}`
    : "/signup?role=student";

  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl border border-border bg-white p-6 shadow-soft sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">Оставить заявку</p>
      <h1 className="mt-3 text-3xl font-semibold text-foreground">Сначала консультация и подбор, регистрация потом</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Выберите удобный формат связи: звонок, мессенджер или email. Команда поможет выбрать следующий шаг.
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

      {selectedTeacherName && role === "student" ? (
        <p className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
          Вы выбрали преподавателя: <span className="font-semibold text-foreground">{selectedTeacherName}</span>. Оставьте
          заявку, и мы согласуем ближайший слот.
        </p>
      ) : null}

      {decodedLevelHint && role === "student" ? (
        <p className="mt-4 rounded-2xl border border-accent/60 bg-accent/30 px-4 py-3 text-sm text-slate-800">
          У вас уже есть результат предварительного теста: <span className="font-semibold">уровень {decodedLevelHint}</span>.
        </p>
      ) : null}

      {isSubmitted ? (
        <div className="mt-6 rounded-2xl border border-accent/60 bg-accent/20 p-5">
          <p className="text-lg font-semibold text-foreground">Заявка отправлена</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {role === "student"
              ? "Свяжемся с вами в выбранном формате и предложим 2–3 релевантных варианта обучения."
              : "Свяжемся с вами и расскажем, как пройти верификацию и быстро выйти на первых учеников."}
          </p>

          {role === "student" ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {wantsAssessment ? (
                <Link
                  href={assessmentLink}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Пройти предварительное тестирование
                </Link>
              ) : null}
              <Link
                href={studentTeachersLink}
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground"
              >
                Смотреть преподавателей
              </Link>
              <Link
                href={signupLink}
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground"
              >
                Перейти к регистрации
              </Link>
            </div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link
                href="/for-tutors"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                Посмотреть условия еще раз
              </Link>
              <Link
                href="/signup?role=tutor"
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground"
              >
                Перейти к регистрации
              </Link>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-foreground">Имя и фамилия</span>
            <input
              required
              type="text"
              placeholder="Как к вам обращаться"
              className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Телефон</span>
            <input
              required={contactMethod !== "email"}
              type="tel"
              placeholder="+7 (___) ___-__-__"
              className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Электронная почта</span>
            <input
              required={contactMethod === "email"}
              type="email"
              placeholder="name@example.com"
              className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
            />
          </label>

          <fieldset className="sm:col-span-2">
            <legend className="mb-2 text-sm font-medium text-foreground">Как удобнее связаться?</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {contactOptions.map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-2xl border p-3 transition ${
                    contactMethod === option.value ? "border-primary/40 bg-primary/5" : "border-border bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="contact"
                    value={option.value}
                    checked={contactMethod === option.value}
                    onChange={() => setContactMethod(option.value)}
                    className="sr-only"
                  />
                  <p className="text-sm font-semibold text-foreground">{option.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{option.description}</p>
                </label>
              ))}
            </div>
          </fieldset>

          {contactMethod === "call" ? (
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-foreground">Удобное время для звонка</span>
              <select
                required
                className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
              >
                <option value="">Выберите слот</option>
                <option value="today-evening">Сегодня 18:00–21:00</option>
                <option value="tomorrow-morning">Завтра 09:00–12:00</option>
                <option value="tomorrow-evening">Завтра 18:00–21:00</option>
              </select>
            </label>
          ) : null}

          {role === "student" ? (
            <>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">Предмет</span>
                <select
                  value={selectedSubject}
                  onChange={(event) => setSelectedSubject(event.target.value)}
                  className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
                >
                  {assessmentSubjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">Цель обучения</span>
                <select
                  required
                  className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
                >
                  <option value="">Выберите цель</option>
                  {studentGoals.map((goal) => (
                    <option key={goal} value={goal}>
                      {goal}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-border bg-slate-50 p-3 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={wantsAssessment}
                  onChange={(event) => setWantsAssessment(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">
                  Хочу пройти предварительное тестирование для определения уровня знаний перед подбором преподавателя.
                </span>
              </label>
            </>
          ) : (
            <>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-foreground">Предметы и специализация</span>
                <input
                  required
                  type="text"
                  placeholder="Например: Английский, IELTS, бизнес-английский"
                  className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">Опыт преподавания</span>
                <select
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
                <span className="mb-2 block text-sm font-medium text-foreground">Формат работы</span>
                <select
                  required
                  className="w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
                >
                  <option value="">Выберите</option>
                  <option value="part-time">Частичная занятость</option>
                  <option value="full-time">Полная занятость</option>
                  <option value="both">Гибкий график</option>
                </select>
              </label>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="sm:col-span-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-70"
          >
            {isSubmitting ? "Отправляем..." : "Оставить заявку"}
          </button>
        </form>
      )}

      <p className="mt-5 text-sm text-muted-foreground">
        Готовы перейти сразу к аккаунту?{" "}
        <Link href={role === "student" ? signupLink : "/signup?role=tutor"} className="font-semibold text-primary">
          Регистрация
        </Link>
      </p>
    </div>
  );
}
