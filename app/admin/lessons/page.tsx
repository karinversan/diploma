"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { type LessonIncident } from "@/data/admin";
import { readAdminLessonIncidents, updateAdminLessonIncident } from "@/lib/admin-incidents";
import { STORAGE_SYNC_EVENT } from "@/lib/storage-sync";
import { cn } from "@/lib/utils";

function formatDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-");
  return `${day}.${month}.${year}`;
}

export default function AdminLessonsPage() {
  const [incidents, setIncidents] = useState<LessonIncident[]>([]);
  const [severityFilter, setSeverityFilter] = useState<"all" | LessonIncident["severity"]>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | LessonIncident["status"]>("all");

  useEffect(() => {
    const syncIncidents = () => setIncidents(readAdminLessonIncidents());

    syncIncidents();
    window.addEventListener("storage", syncIncidents);
    window.addEventListener(STORAGE_SYNC_EVENT, syncIncidents);

    return () => {
      window.removeEventListener("storage", syncIncidents);
      window.removeEventListener(STORAGE_SYNC_EVENT, syncIncidents);
    };
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((item) => {
      const bySeverity = severityFilter === "all" ? true : item.severity === severityFilter;
      const byStatus = statusFilter === "all" ? true : item.status === statusFilter;
      return bySeverity && byStatus;
    });
  }, [incidents, severityFilter, statusFilter]);

  const updateIncident = (incidentId: string, status: LessonIncident["status"]) => {
    setIncidents(updateAdminLessonIncident(incidentId, { status }));
  };

  const openCount = incidents.filter((item) => item.status !== "resolved").length;

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Занятия и инциденты</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Контролируйте спорные уроки, инциденты по связи и жалобы на контент. Открытых кейсов: {openCount}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={severityFilter}
              onChange={(event) => setSeverityFilter(event.target.value as typeof severityFilter)}
              className="rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="all">Любая критичность</option>
              <option value="низкий">Низкий</option>
              <option value="средний">Средний</option>
              <option value="высокий">Высокий</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
              className="rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="all">Любой статус</option>
              <option value="open">Открыт</option>
              <option value="in_progress">В работе</option>
              <option value="resolved">Решен</option>
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        {filteredIncidents.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-slate-50 px-4 py-6 text-sm text-muted-foreground">
            По выбранным фильтрам инциденты не найдены.
          </p>
        ) : (
          filteredIncidents.map((incident) => (
            <article key={incident.id} className="rounded-2xl border border-border bg-white p-4 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-foreground">{incident.lessonTitle}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Преподаватель: {incident.teacherName} · Ученик: {incident.studentName} · Дата: {formatDate(incident.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      incident.severity === "высокий"
                        ? "bg-rose-100 text-rose-700"
                        : incident.severity === "средний"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                    )}
                  >
                    {incident.severity}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      incident.status === "resolved"
                        ? "bg-emerald-100 text-emerald-700"
                        : incident.status === "in_progress"
                          ? "bg-primary/15 text-primary"
                          : "bg-slate-100 text-slate-700"
                    )}
                  >
                    {incident.status === "open" ? "Открыт" : incident.status === "in_progress" ? "В работе" : "Решен"}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {incident.status !== "in_progress" ? (
                  <button
                    type="button"
                    onClick={() => updateIncident(incident.id, "in_progress")}
                    className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                  >
                    Взять в работу
                  </button>
                ) : null}

                {incident.status !== "resolved" ? (
                  <button
                    type="button"
                    onClick={() => updateIncident(incident.id, "resolved")}
                    className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    Отметить как решенный
                  </button>
                ) : null}

                <Link
                  href="/admin/users"
                  className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  Открыть профиль участника
                </Link>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
