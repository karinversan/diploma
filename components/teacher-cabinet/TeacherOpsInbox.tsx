"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { teacherCabinetProfile } from "@/data/teacher-cabinet";
import { formatBookingSlotLabel, type LessonBookingRequest, readLessonBookings } from "@/lib/lesson-bookings";
import { STORAGE_SYNC_EVENT } from "@/lib/storage-sync";
import { cn } from "@/lib/utils";

type QueueRequest = LessonBookingRequest;

function getStatusMeta(status: LessonBookingRequest["status"]) {
  if (status === "pending") {
    return { label: "Новая", className: "border-amber-300 bg-amber-50 text-amber-800" };
  }
  if (status === "reschedule_proposed") {
    return { label: "Перенос", className: "border-primary/30 bg-primary/10 text-primary" };
  }
  if (status === "awaiting_payment") {
    return { label: "Оплата", className: "border-emerald-300 bg-emerald-50 text-emerald-800" };
  }
  if (status === "paid") {
    return { label: "Оплачено", className: "border-emerald-300 bg-white text-emerald-700" };
  }
  return { label: "Отклонено", className: "border-rose-300 bg-rose-50 text-rose-700" };
}

function pickRequestsForTeacher(bookings: LessonBookingRequest[]) {
  const active = bookings.filter((booking) => booking.status !== "cancelled");
  const personal = active.filter(
    (booking) =>
      booking.teacherId === teacherCabinetProfile.id ||
      (booking.teacherName ?? "").trim().toLowerCase() === teacherCabinetProfile.name.toLowerCase()
  );

  const source = personal.length > 0 ? personal : active;
  return source.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function TeacherOpsInbox() {
  const [requests, setRequests] = useState<QueueRequest[]>([]);

  useEffect(() => {
    const syncRequests = () => setRequests(pickRequestsForTeacher(readLessonBookings()));

    syncRequests();
    window.addEventListener("storage", syncRequests);
    window.addEventListener(STORAGE_SYNC_EVENT, syncRequests);
    return () => {
      window.removeEventListener("storage", syncRequests);
      window.removeEventListener(STORAGE_SYNC_EVENT, syncRequests);
    };
  }, []);

  const pendingCount = requests.filter((request) => request.status === "pending").length;
  const rescheduleCount = requests.filter((request) => request.status === "reschedule_proposed").length;
  const awaitingPaymentCount = requests.filter((request) => request.status === "awaiting_payment").length;

  const queuePreview = useMemo(() => {
    return requests
      .filter((request) => request.status === "pending" || request.status === "reschedule_proposed" || request.status === "awaiting_payment")
      .slice(0, 4);
  }, [requests]);

  return (
    <article className="rounded-3xl border border-primary/20 bg-primary/5 p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Операционная очередь</h3>
          <p className="mt-1 text-sm text-muted-foreground">Подтверждайте заявки и переносы до начала ближайших уроков.</p>
        </div>
        <Link href="/teacher/classroom" className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
          Открыть очередь
        </Link>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-white px-3 py-2 text-xs text-muted-foreground">
          Новые: <span className="font-semibold text-foreground">{pendingCount}</span>
        </div>
        <div className="rounded-xl border border-border bg-white px-3 py-2 text-xs text-muted-foreground">
          Переносы: <span className="font-semibold text-foreground">{rescheduleCount}</span>
        </div>
        <div className="rounded-xl border border-border bg-white px-3 py-2 text-xs text-muted-foreground">
          Ждут оплату: <span className="font-semibold text-foreground">{awaitingPaymentCount}</span>
        </div>
      </div>

      {queuePreview.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-primary/30 bg-white px-3 py-2 text-xs text-muted-foreground">
          Очередь пуста. Новые заявки от учеников появятся здесь автоматически.
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {queuePreview.map((request) => {
            const statusMeta = getStatusMeta(request.status);

            return (
              <article key={request.id} className="rounded-xl border border-primary/20 bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-semibold text-foreground">{request.studentName ?? "Ученик"}</p>
                  <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-semibold", statusMeta.className)}>{statusMeta.label}</span>
                </div>
                <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">{request.subject}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{formatBookingSlotLabel(request.slot)}</p>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-3 text-[11px] text-muted-foreground">В кабинете «Мой класс» доступны массовые действия по заявкам.</p>
    </article>
  );
}
