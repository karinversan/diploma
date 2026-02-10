"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, RefreshCcw, XCircle } from "lucide-react";

import { syncTutorApplicationsFromApi } from "@/lib/api/tutor-applications-client";
import { readTutorApplications, TutorApplication } from "@/lib/tutor-applications";
import { STORAGE_SYNC_EVENT } from "@/lib/storage-sync";
import { cn } from "@/lib/utils";

function formatDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-");
  return `${day}.${month}.${year}`;
}

export function TeacherOnboardingAlert() {
  const searchParams = useSearchParams();
  const onboardingHint = searchParams.get("onboarding");
  const [applications, setApplications] = useState<TutorApplication[]>([]);

  useEffect(() => {
    let mounted = true;
    setApplications(readTutorApplications());

    const syncApplications = () => setApplications(readTutorApplications());
    void (async () => {
      const next = await syncTutorApplicationsFromApi();
      if (mounted) {
        setApplications(next);
      }
    })();

    window.addEventListener("storage", syncApplications);
    window.addEventListener(STORAGE_SYNC_EVENT, syncApplications);
    return () => {
      mounted = false;
      window.removeEventListener("storage", syncApplications);
      window.removeEventListener(STORAGE_SYNC_EVENT, syncApplications);
    };
  }, []);

  const latestApplication = useMemo(() => applications[0], [applications]);

  if (!latestApplication && onboardingHint !== "pending") {
    return null;
  }

  const status = latestApplication?.status ?? "pending";
  const statusLabel =
    status === "approved"
      ? "Профиль подтверждён"
      : status === "rejected"
        ? "Требуется доработка заявки"
        : "Заявка на проверке";

  const cardClass =
    status === "approved"
      ? "border-emerald-200 bg-emerald-50"
      : status === "rejected"
        ? "border-rose-200 bg-rose-50"
        : "border-primary/20 bg-primary/5";

  const icon =
    status === "approved" ? (
      <CheckCircle2 className="h-4 w-4 text-emerald-700" />
    ) : status === "rejected" ? (
      <XCircle className="h-4 w-4 text-rose-700" />
    ) : (
      <Clock3 className="h-4 w-4 text-primary" />
    );

  return (
    <section className={cn("rounded-3xl border p-4", cardClass)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/80 px-2.5 py-1 text-xs font-semibold text-foreground">
            {icon}
            {statusLabel}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {status === "approved"
              ? "Вы прошли проверку и можете полноценно публиковать курсы и принимать учеников."
              : status === "rejected"
                ? "Администратор вернул заявку на доработку. Исправьте данные и отправьте повторно."
                : "Администратор проверяет документы и профиль. Обычно это занимает до 24 часов."}
          </p>
          {latestApplication ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Последнее обновление: {formatDate(latestApplication.updatedAt)}
              {latestApplication.adminNote ? ` · ${latestApplication.adminNote}` : ""}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {status === "rejected" ? (
            <Link
              href="/lead?role=tutor"
              className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
            >
              Обновить заявку
            </Link>
          ) : null}

          <button
            type="button"
            onClick={() => {
              void (async () => {
                const next = await syncTutorApplicationsFromApi();
                setApplications(next);
              })();
            }}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Обновить статус
          </button>
        </div>
      </div>
    </section>
  );
}
