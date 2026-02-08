"use client";

import Image from "next/image";
import { SendHorizontal } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { messageThreads } from "@/data/messages";
import { cn } from "@/lib/utils";

type MessagesPageClientProps = {
  preselectedThreadId?: string;
  initialDraft?: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(
    new Date(value)
  );
}

export function MessagesPageClient({ preselectedThreadId, initialDraft }: MessagesPageClientProps) {
  const [threads, setThreads] = useState(messageThreads);
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>(preselectedThreadId ?? messageThreads[0]?.id);
  const [composerText, setComposerText] = useState(initialDraft ?? "");

  useEffect(() => {
    if (preselectedThreadId && preselectedThreadId !== activeThreadId) {
      setActiveThreadId(preselectedThreadId);
    }
  }, [activeThreadId, preselectedThreadId]);

  useEffect(() => {
    if (initialDraft) {
      setComposerText(initialDraft);
    }
  }, [initialDraft]);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? threads[0],
    [activeThreadId, threads]
  );

  const sendMessage = () => {
    const text = composerText.trim();

    if (!text || !activeThread) {
      return;
    }

    const now = new Date().toISOString();
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: "student" as const,
      text,
      sentAt: now
    };

    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id !== activeThread.id) {
          return thread;
        }

        return {
          ...thread,
          messages: [...thread.messages, newMessage],
          lastMessage: text,
          updatedAt: now,
          unreadCount: 0
        };
      })
    );

    setComposerText("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <div className="grid min-h-[calc(100vh-11rem)] gap-4 rounded-3xl border border-border bg-white p-4 shadow-card lg:grid-cols-[320px_minmax(0,1fr)] lg:p-5">
      <aside className="rounded-3xl border border-border bg-slate-50 p-3">
        <h1 className="px-2 text-xl font-semibold text-foreground">Сообщения</h1>
        <p className="px-2 pt-1 text-sm text-muted-foreground">Чаты с преподавателями</p>

        <div className="mt-3 space-y-1">
          {threads.map((thread) => {
            const isActive = thread.id === activeThread?.id;

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
                <Image
                  src={thread.teacherAvatarUrl}
                  alt={`Аватар преподавателя ${thread.teacherName}`}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-xl"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold">{thread.teacherName}</span>
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

      <section className="flex min-h-[480px] flex-col rounded-3xl border border-border bg-white">
        {activeThread ? (
          <>
            <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <Image
                  src={activeThread.teacherAvatarUrl}
                  alt={`Аватар ${activeThread.teacherName}`}
                  width={42}
                  height={42}
                  className="h-[42px] w-[42px] rounded-xl"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">{activeThread.teacherName}</p>
                  <p className="text-xs text-muted-foreground">Предмет: {activeThread.subject}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Последнее обновление: {formatDate(activeThread.updatedAt)}</p>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
              {activeThread.messages.map((message) => {
                const fromStudent = message.sender === "student";

                return (
                  <div key={message.id} className={cn("flex", fromStudent ? "justify-end" : "justify-start")}>
                    <article
                      className={cn(
                        "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm",
                        fromStudent ? "bg-primary text-primary-foreground" : "border border-border bg-white text-foreground"
                      )}
                    >
                      <p>{message.text}</p>
                      <p className={cn("mt-1 text-[11px]", fromStudent ? "text-primary-foreground/80" : "text-muted-foreground")}>
                        {formatDate(message.sentAt)}
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
                  value={composerText}
                  onChange={(event) => setComposerText(event.target.value)}
                  placeholder="Напишите сообщение"
                  className="w-full bg-transparent text-sm outline-none"
                  aria-label="Поле ввода сообщения"
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
          <p className="m-auto text-sm text-muted-foreground">Чаты пока отсутствуют.</p>
        )}
      </section>
    </div>
  );
}
