"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ShieldAlert, Sparkles, XCircle } from "lucide-react";

import { platformKpis, tutorVerificationQueue, type LessonIncident, type RefundTicket } from "@/data/admin";
import { readAdminLessonIncidents, updateAdminLessonIncident } from "@/lib/admin-incidents";
import { readLessonBookings } from "@/lib/lesson-bookings";
import { readRefundTickets, updateRefundTicket } from "@/lib/refund-tickets";
import { STORAGE_SYNC_EVENT } from "@/lib/storage-sync";
import {
  ensureTutorApplicationsSeed,
  readTutorApplications,
  type TutorApplication,
  updateTutorApplication
} from "@/lib/tutor-applications";
import { cn } from "@/lib/utils";

function formatDate(value: string) {
  const datePart = value.slice(0, 10);
  const [year, month, day] = datePart.split("-");
  return `${day}.${month}.${year}`;
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(amount);
}

export default function AdminDashboardPage() {
  const [verificationQueue, setVerificationQueue] = useState<TutorApplication[]>([]);
  const [bookingOps, setBookingOps] = useState({ pending: 0, awaitingPayment: 0, paid: 0, declined: 0 });
  const [pendingRefunds, setPendingRefunds] = useState(0);
  const [refundQueue, setRefundQueue] = useState<RefundTicket[]>([]);
  const [incidentQueue, setIncidentQueue] = useState<LessonIncident[]>([]);

  useEffect(() => {
    const seedFromData: TutorApplication[] = tutorVerificationQueue.map((request, index) => ({
      id: request.id,
      fullName: request.tutorName,
      email: `tutor${index + 1}@example.com`,
      phone: "+7 (900) 000-00-00",
      subjects: request.subjects.join(", "),
      experience: `${request.experienceYears} лет`,
      source: "lead_form",
      status: request.status,
      adminNote: request.note,
      createdAt: request.submittedAt,
      updatedAt: request.submittedAt
    }));

    ensureTutorApplicationsSeed(seedFromData);

    const syncData = () => {
      setVerificationQueue(readTutorApplications());

      const bookings = readLessonBookings();
      setBookingOps({
        pending: bookings.filter((item) => item.status === "pending").length,
        awaitingPayment: bookings.filter((item) => item.status === "awaiting_payment").length,
        paid: bookings.filter((item) => item.status === "paid").length,
        declined: bookings.filter((item) => item.status === "declined").length
      });

      const refunds = readRefundTickets();
      setRefundQueue(refunds);
      setPendingRefunds(refunds.filter((ticket) => ticket.status === "pending").length);
      setIncidentQueue(readAdminLessonIncidents());
    };

    syncData();
    window.addEventListener("storage", syncData);
    window.addEventListener(STORAGE_SYNC_EVENT, syncData);

    return () => {
      window.removeEventListener("storage", syncData);
      window.removeEventListener(STORAGE_SYNC_EVENT, syncData);
    };
  }, []);

  const pendingCount = useMemo(
    () => verificationQueue.filter((item) => item.status === "pending").length,
    [verificationQueue]
  );

  const pendingRefundTickets = useMemo(
    () => refundQueue.filter((ticket) => ticket.status === "pending").slice(0, 2),
    [refundQueue]
  );

  const unresolvedIncidentsCount = useMemo(
    () => incidentQueue.filter((incident) => incident.status !== "resolved").length,
    [incidentQueue]
  );

  const highPriorityIncidents = useMemo(() => {
    const severityOrder: Record<LessonIncident["severity"], number> = {
      высокий: 3,
      средний: 2,
      низкий: 1
    };

    return incidentQueue
      .filter((incident) => incident.status !== "resolved")
      .sort((left, right) => {
        const bySeverity = severityOrder[right.severity] - severityOrder[left.severity];
        if (bySeverity !== 0) {
          return bySeverity;
        }
        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      })
      .slice(0, 2);
  }, [incidentQueue]);

  const updateVerification = (requestId: string, status: TutorApplication["status"], note: string) => {
    setVerificationQueue(updateTutorApplication(requestId, { status, adminNote: note }));
  };

  const moderateRefund = (ticketId: string, status: RefundTicket["status"]) => {
    const next = updateRefundTicket(ticketId, status);
    setRefundQueue(next);
    setPendingRefunds(next.filter((ticket) => ticket.status === "pending").length);
  };

  const changeIncidentStatus = (incidentId: string, status: LessonIncident["status"]) => {
    setIncidentQueue(updateAdminLessonIncident(incidentId, { status }));
  };

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <h1 className="text-3xl font-semibold text-foreground">Операционный обзор платформы</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Центр контроля ролей, качества и ключевых пользовательских сценариев по плану дипломного проекта.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {platformKpis.map((kpi) => (
            <article key={kpi.id} className="rounded-2xl border border-border bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{kpi.value}</p>
              <p
                className={cn(
                  "mt-1 text-xs font-medium",
                  kpi.trend === "up"
                    ? "text-emerald-700"
                    : kpi.trend === "down"
                      ? "text-rose-700"
                      : "text-slate-600"
                )}
              >
                {kpi.delta}
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
        <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Верификация преподавателей</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ожидают решения: <span className="font-semibold text-foreground">{pendingCount}</span>
              </p>
            </div>
            <Link href="/admin/users" className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">
              Все пользователи
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {verificationQueue.map((request) => (
              <article key={request.id} className="rounded-2xl border border-border bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-foreground">{request.fullName}</p>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      request.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : request.status === "rejected"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                    )}
                  >
                    {request.status === "pending"
                      ? "На проверке"
                      : request.status === "approved"
                        ? "Одобрен"
                        : "Отклонен"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Предметы: {request.subjects} · Опыт: {request.experience} · Заявка от {formatDate(request.createdAt)}
                </p>
                {request.adminNote ? <p className="mt-1 text-xs text-muted-foreground">Комментарий: {request.adminNote}</p> : null}

                {request.status === "pending" ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => updateVerification(request.id, "approved", "Профиль прошел модерацию")}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Одобрить
                    </button>
                    <button
                      type="button"
                      onClick={() => updateVerification(request.id, "rejected", "Требуется доработка документов")}
                      className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Отклонить
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <article className="rounded-3xl border border-primary/20 bg-primary/5 p-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              ИИ и качество
            </p>
            <h2 className="mt-3 text-xl font-semibold text-foreground">Контроль точности ИИ-модулей</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Проверяйте качество распознавания речи, конспектов, рекомендаций и переводов в одном разделе.
            </p>
            <Link href="/admin/quality" className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Открыть качество и тесты
            </Link>
          </article>

          <article className="rounded-3xl border border-border bg-white p-5 shadow-card">
            <p className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              <ShieldAlert className="h-3.5 w-3.5" />
              Центр операционных очередей
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Быстрые действия по заявкам, возвратам и инцидентам без переходов между разделами.</p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
                Заявки на слот: <span className="font-semibold text-foreground">{bookingOps.pending}</span>
              </div>
              <div className="rounded-xl border border-border bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
                Ожидают оплату: <span className="font-semibold text-foreground">{bookingOps.awaitingPayment}</span>
              </div>
              <div className="rounded-xl border border-border bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
                Возвраты в обработке: <span className="font-semibold text-foreground">{pendingRefunds}</span>
              </div>
              <div className="rounded-xl border border-border bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
                Нерешенные инциденты: <span className="font-semibold text-foreground">{unresolvedIncidentsCount}</span>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Возвраты (приоритет)</p>
                {pendingRefundTickets.length === 0 ? (
                  <p className="mt-2 rounded-xl border border-dashed border-border bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
                    Срочных возвратов нет.
                  </p>
                ) : (
                  <div className="mt-2 space-y-2">
                    {pendingRefundTickets.map((ticket) => (
                      <article key={ticket.id} className="rounded-xl border border-amber-300 bg-amber-50 p-3">
                        <p className="text-xs font-semibold text-foreground">{ticket.invoice} · {ticket.studentName}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{ticket.reason}</p>
                        <p className="mt-1 text-xs font-semibold text-foreground">Сумма: {formatAmount(ticket.amountRubles)}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => moderateRefund(ticket.id, "approved")}
                            className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                          >
                            Одобрить
                          </button>
                          <button
                            type="button"
                            onClick={() => moderateRefund(ticket.id, "declined")}
                            className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
                          >
                            Отклонить
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Инциденты уроков</p>
                {highPriorityIncidents.length === 0 ? (
                  <p className="mt-2 rounded-xl border border-dashed border-border bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
                    Все инциденты закрыты.
                  </p>
                ) : (
                  <div className="mt-2 space-y-2">
                    {highPriorityIncidents.map((incident) => (
                      <article key={incident.id} className="rounded-xl border border-border bg-slate-50 p-3">
                        <p className="text-xs font-semibold text-foreground">{incident.lessonTitle}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{incident.teacherName} · {incident.studentName}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                              incident.severity === "высокий"
                                ? "bg-rose-100 text-rose-700"
                                : incident.severity === "средний"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-emerald-100 text-emerald-700"
                            )}
                          >
                            {incident.severity}
                          </span>
                          {incident.status !== "in_progress" ? (
                            <button
                              type="button"
                              onClick={() => changeIncidentStatus(incident.id, "in_progress")}
                              className="rounded-full border border-border bg-white px-2.5 py-1 text-[11px] font-semibold text-foreground"
                            >
                              В работу
                            </button>
                          ) : null}
                          {incident.status !== "resolved" ? (
                            <button
                              type="button"
                              onClick={() => changeIncidentStatus(incident.id, "resolved")}
                              className="rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white"
                            >
                              Закрыть
                            </button>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Link href="/admin/payments" className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground">
                  Все возвраты
                </Link>
                <Link href="/admin/lessons" className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground">
                  Все инциденты
                </Link>
                <Link href="/admin/users" className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground">
                  Все заявки преподавателей
                </Link>
              </div>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
