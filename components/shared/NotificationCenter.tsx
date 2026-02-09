"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CalendarClock, CheckCheck, CircleAlert, CreditCard, MessageSquareText } from "lucide-react";

import {
  NotificationItem,
  NotificationRole,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  readNotificationsForRole,
  readSeenNotificationIds
} from "@/lib/notifications";
import { cn } from "@/lib/utils";

type NotificationCenterProps = {
  role: NotificationRole;
};

function formatNotificationDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "только что";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}.${month} ${hours}:${minutes}`;
}

function NotificationIcon({ kind }: { kind: NotificationItem["kind"] }) {
  if (kind === "message") {
    return <MessageSquareText className="h-4 w-4 text-blue-600" />;
  }
  if (kind === "payment") {
    return <CreditCard className="h-4 w-4 text-primary" />;
  }
  if (kind === "refund") {
    return <CircleAlert className="h-4 w-4 text-rose-600" />;
  }
  return <CalendarClock className="h-4 w-4 text-emerald-600" />;
}

export function NotificationCenter({ role }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [seenNotificationIds, setSeenNotificationIds] = useState<string[]>([]);
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  useEffect(() => {
    setNotifications(readNotificationsForRole(role));
    setSeenNotificationIds(readSeenNotificationIds(role));

    const sync = () => {
      setNotifications(readNotificationsForRole(role));
      setSeenNotificationIds(readSeenNotificationIds(role));
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [role]);

  const unseenIds = useMemo(() => {
    const seenSet = new Set(seenNotificationIds);
    return notifications.filter((notification) => !seenSet.has(notification.id)).map((notification) => notification.id);
  }, [notifications, seenNotificationIds]);

  const unseenCount = unseenIds.length;

  const handleMarkAllRead = () => {
    const next = markAllNotificationsAsRead(role, notifications);
    setSeenNotificationIds(next);
  };

  const handleOpenNotification = (id: string) => {
    const next = markNotificationAsRead(role, id);
    setSeenNotificationIds(next);
    setOpen(false);
    if (detailsRef.current) {
      detailsRef.current.removeAttribute("open");
    }
  };

  return (
    <details
      ref={detailsRef}
      className="relative"
    >
      <summary className="list-none [&::-webkit-details-marker]:hidden">
        <span className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-border bg-white text-foreground transition hover:border-primary">
          <Bell className="h-4 w-4" />
          {unseenCount > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex min-w-[19px] items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
              {unseenCount > 99 ? "99+" : unseenCount}
            </span>
          ) : null}
        </span>
      </summary>

      <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-white p-3 shadow-card">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">Уведомления</p>
          <button
            type="button"
            onClick={handleMarkAllRead}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition",
              unseenCount > 0
                ? "border-primary/25 bg-primary/10 text-primary"
                : "cursor-default border-border bg-slate-50 text-muted-foreground"
            )}
            disabled={unseenCount === 0}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Прочитано
          </button>
        </div>

        {notifications.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-border bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
            Пока нет новых событий.
          </p>
        ) : (
          <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto pr-1">
            {notifications.slice(0, 14).map((notification) => {
              const isUnread = unseenIds.includes(notification.id);

              return (
                <Link
                  key={notification.id}
                  href={notification.href}
                  onClick={() => handleOpenNotification(notification.id)}
                  className={cn(
                    "block rounded-xl border p-2.5 transition",
                    isUnread ? "border-primary/30 bg-primary/5" : "border-border bg-slate-50 hover:bg-slate-100"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white">
                      <NotificationIcon kind={notification.kind} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="line-clamp-1 text-sm font-semibold text-foreground">{notification.title}</span>
                        {isUnread ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
                      </span>
                      <span className="mt-1 block line-clamp-2 text-xs text-muted-foreground">{notification.description}</span>
                      <span className="mt-1 block text-[11px] text-muted-foreground">{formatNotificationDate(notification.createdAt)}</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </details>
  );
}
