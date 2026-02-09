"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { SendHorizontal } from "lucide-react";

import { teacherMessageThreads } from "@/data/teacher-cabinet";
import { cn } from "@/lib/utils";

const monthShortNames = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

function formatShortDate(value: string) {
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = monthShortNames[date.getMonth()] ?? "";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month}, ${hours}:${minutes}`;
}

export function TeacherMessagesClient() {
  const [threads, setThreads] = useState(teacherMessageThreads);
  const [activeThreadId, setActiveThreadId] = useState(teacherMessageThreads[0]?.id);
  const [draft, setDraft] = useState("");

  const activeThread = useMemo(() => threads.find((thread) => thread.id === activeThreadId) ?? threads[0], [threads, activeThreadId]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = draft.trim();

    if (!message || !activeThread) {
      return;
    }

    const sentAt = new Date().toISOString();
    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id !== activeThread.id) {
          return thread;
        }
        return {
          ...thread,
          updatedAt: sentAt,
          lastMessage: message,
          messages: [...thread.messages, { id: `teacher-message-${Date.now()}`, sender: "teacher", text: message, sentAt }]
        };
      })
    );
    setDraft("");
  };

  return (
    <div className="grid min-h-[calc(100vh-11rem)] gap-4 rounded-3xl border border-border bg-white p-4 shadow-card lg:grid-cols-[320px_minmax(0,1fr)] lg:p-5">
      <aside className="rounded-3xl border border-border bg-slate-50 p-3">
        <h1 className="px-2 text-xl font-semibold text-foreground">Сообщения с учениками</h1>
        <p className="px-2 pt-1 text-sm text-muted-foreground">Согласование уроков, проверка домашки и обратная связь.</p>

        <div className="mt-3 space-y-1">
          {threads.map((thread) => {
            const isActive = activeThread?.id === thread.id;
            return (
              <button
                key={thread.id}
                type="button"
                onClick={() => setActiveThreadId(thread.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-white"
                )}
              >
                <Image src={thread.studentAvatarUrl} alt={thread.studentName} width={40} height={40} className="h-10 w-10 rounded-xl" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold">{thread.studentName}</span>
                    {thread.unreadCount > 0 ? (
                      <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-slate-900">
                        {thread.unreadCount}
                      </span>
                    ) : null}
                  </span>
                  <span className={cn("mt-1 block truncate text-xs", isActive ? "text-white/85" : "text-muted-foreground")}>
                    {thread.lastMessage}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="flex min-h-[520px] flex-col rounded-3xl border border-border bg-white">
        {activeThread ? (
          <>
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <Image
                  src={activeThread.studentAvatarUrl}
                  alt={activeThread.studentName}
                  width={42}
                  height={42}
                  className="h-[42px] w-[42px] rounded-xl"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">{activeThread.studentName}</p>
                  <p className="text-xs text-muted-foreground">Курс: {activeThread.courseTitle}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Обновлено: {formatShortDate(activeThread.updatedAt)}</p>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
              {activeThread.messages.map((message) => {
                const isTeacher = message.sender === "teacher";

                return (
                  <div key={message.id} className={cn("flex", isTeacher ? "justify-end" : "justify-start")}>
                    <article
                      className={cn(
                        "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm",
                        isTeacher ? "bg-primary text-primary-foreground" : "border border-border bg-white text-foreground"
                      )}
                    >
                      <p>{message.text}</p>
                      <p className={cn("mt-1 text-[11px]", isTeacher ? "text-primary-foreground/80" : "text-muted-foreground")}>
                        {formatShortDate(message.sentAt)}
                      </p>
                    </article>
                  </div>
                );
              })}
            </div>

            <footer className="border-t border-border p-3">
              <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-2xl border border-border bg-slate-50 px-3 py-2">
                <input
                  type="text"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Введите сообщение ученику"
                  className="w-full bg-transparent text-sm outline-none"
                  aria-label="Введите сообщение ученику"
                />
                <button
                  type="submit"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"
                  aria-label="Отправить сообщение"
                >
                  <SendHorizontal className="h-4 w-4" />
                </button>
              </form>
            </footer>
          </>
        ) : (
          <p className="m-auto text-sm text-muted-foreground">Диалоги не найдены.</p>
        )}
      </section>
    </div>
  );
}
