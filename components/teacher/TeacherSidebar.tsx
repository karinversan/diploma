"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { Clock3, MessageSquare, PlayCircle, ShieldCheck, Video, X } from "lucide-react";

import { Teacher } from "@/data/teachers";

import { SelectedScheduleSlot } from "@/components/teacher/SchedulePicker";

type TeacherSidebarProps = {
  teacher: Teacher;
  selectedSlot: SelectedScheduleSlot | null;
  bookingHrefBase?: string;
  messageHref?: string;
  bookingButtonLabel?: string;
};

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00`);

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short"
  }).format(date);
}

function resolveBookingLink(teacher: Teacher, selectedSlot: SelectedScheduleSlot | null, bookingHrefBase?: string) {
  const defaultBookingQuery = new URLSearchParams({ role: "student", teacher: teacher.id });
  const defaultHref = `/signup?${defaultBookingQuery.toString()}`;
  const targetHref = bookingHrefBase ?? defaultHref;

  if (!selectedSlot) {
    return targetHref;
  }

  const [pathname, rawQuery = ""] = targetHref.split("?");
  const params = new URLSearchParams(rawQuery);
  params.set("slot", `${selectedSlot.date} ${selectedSlot.time}`);

  return `${pathname}?${params.toString()}`;
}

function resolveMessageLink(teacher: Teacher, selectedSlot: SelectedScheduleSlot | null, messageHref?: string) {
  const targetHref = messageHref ?? "/login";

  if (!selectedSlot || !messageHref) {
    return targetHref;
  }

  const [pathname, rawQuery = ""] = targetHref.split("?");
  const params = new URLSearchParams(rawQuery);
  const draftMessage = `Здравствуйте! Хочу записаться на урок ${formatDate(selectedSlot.date)} в ${selectedSlot.time}.`;
  params.set("draft", draftMessage);

  return `${pathname}?${params.toString()}`;
}

export function TeacherSidebar({
  teacher,
  selectedSlot,
  bookingHrefBase,
  messageHref,
  bookingButtonLabel
}: TeacherSidebarProps) {
  const bookingLink = resolveBookingLink(teacher, selectedSlot, bookingHrefBase);
  const chatLink = resolveMessageLink(teacher, selectedSlot, messageHref);
  const primaryLabel = bookingButtonLabel ?? "Записаться на пробный урок";

  return (
    <aside className="space-y-4 xl:sticky xl:top-28 xl:self-start">
      <Dialog.Root>
        <section className="rounded-[1.6rem] border border-border bg-white p-5 shadow-card">
          <p className="text-sm font-semibold text-foreground">Видео-превью урока</p>

          <Dialog.Trigger asChild>
            <button
              type="button"
              aria-label="Открыть видео-превью"
              className="group relative mt-3 block w-full overflow-hidden rounded-2xl border border-border"
            >
              <Image
                src={teacher.videoPreviewUrl ?? "/classroom-preview.svg"}
                alt="Превью онлайн-урока"
                width={900}
                height={560}
                className="h-44 w-full object-cover"
              />
              <span className="absolute inset-0 bg-slate-950/25 transition group-hover:bg-slate-950/35" aria-hidden="true" />
              <span className="absolute inset-0 grid place-items-center" aria-hidden="true">
                <PlayCircle className="h-12 w-12 text-white" />
              </span>
            </button>
          </Dialog.Trigger>

          <div className="mt-4 rounded-2xl border border-border bg-slate-50 p-4">
            <p className="text-xs text-muted-foreground">Стоимость урока</p>
            <p className="mt-1 text-3xl font-semibold text-foreground">{teacher.pricePerHour.toLocaleString("ru-RU")} ₽/час</p>

            {selectedSlot ? (
              <p className="mt-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-medium text-primary">
                Выбрано время: {formatDate(selectedSlot.date)}, {selectedSlot.time}
              </p>
            ) : null}

            <div className="mt-4 grid gap-2">
              <Link
                href={bookingLink}
                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                {primaryLabel}
              </Link>
              <Link
                href={chatLink}
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground"
              >
                Написать сообщение
              </Link>
            </div>
          </div>

          <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
            <li className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              {teacher.bookedLast48h} бронирований за 48 часов
            </li>
            <li className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-primary" aria-hidden="true" />
              Среднее время ответа: {teacher.responseTimeHours} ч
            </li>
          </ul>
        </section>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-slate-950/70" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[71] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-white p-4 shadow-soft sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <Dialog.Title className="inline-flex items-center gap-2 text-base font-semibold text-foreground">
                <Video className="h-4 w-4 text-primary" aria-hidden="true" />
                Превью онлайн-урока
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Закрыть окно"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="rounded-2xl border border-border bg-slate-50 p-3">
              <Image
                src={teacher.videoPreviewUrl ?? "/classroom-preview.svg"}
                alt="Демонстрация урока"
                width={1200}
                height={760}
                className="h-auto w-full rounded-xl"
              />
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              В демо показан интерфейс урока: видеосвязь, чат, интерактивная доска и учебные материалы в одном окне.
            </p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Link
                href={bookingLink}
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                {primaryLabel}
              </Link>
              <Link
                href={chatLink}
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground"
              >
                <MessageSquare className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                Написать сообщение
              </Link>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </aside>
  );
}
