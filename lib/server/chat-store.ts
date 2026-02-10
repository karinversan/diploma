import fs from "node:fs/promises";
import path from "node:path";

import {
  createSeedSharedChatThreads,
  type EnsureThreadPayload,
  type SendMessagePayload,
  type SharedChatMessage,
  type SharedChatSender,
  type SharedChatThread
} from "@/lib/chat-threads";

function resolveStorePath() {
  return process.env.SKILLZONE_CHAT_STORE_PATH || path.join("/tmp", "skillzone-chat-store-v1.json");
}

type ChatStore = {
  threads: SharedChatThread[];
};

type MarkReadPayload = {
  threadId: string;
  viewer: SharedChatSender;
};

function sortThreads(threads: SharedChatThread[]) {
  return [...threads].sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
}

function normalizeMessage(raw: Partial<SharedChatMessage>): SharedChatMessage | null {
  if (typeof raw?.id !== "string" || typeof raw.text !== "string") {
    return null;
  }
  if (raw.sender !== "student" && raw.sender !== "teacher") {
    return null;
  }

  return {
    id: raw.id,
    sender: raw.sender,
    text: raw.text,
    sentAt: typeof raw.sentAt === "string" && raw.sentAt ? raw.sentAt : new Date().toISOString()
  };
}

function normalizeThread(raw: Partial<SharedChatThread>): SharedChatThread | null {
  if (
    typeof raw?.id !== "string" ||
    typeof raw.teacherId !== "string" ||
    typeof raw.teacherName !== "string" ||
    typeof raw.teacherAvatarUrl !== "string" ||
    typeof raw.studentId !== "string" ||
    typeof raw.studentName !== "string" ||
    typeof raw.studentAvatarUrl !== "string"
  ) {
    return null;
  }

  const messages = Array.isArray(raw.messages)
    ? raw.messages
        .map((item) => normalizeMessage(item))
        .filter((item): item is SharedChatMessage => Boolean(item))
        .sort((left, right) => new Date(left.sentAt).getTime() - new Date(right.sentAt).getTime())
    : [];

  const updatedAt = typeof raw.updatedAt === "string" && raw.updatedAt ? raw.updatedAt : messages[messages.length - 1]?.sentAt ?? new Date().toISOString();
  const lastMessage = typeof raw.lastMessage === "string" ? raw.lastMessage : messages[messages.length - 1]?.text ?? "";

  return {
    id: raw.id,
    teacherId: raw.teacherId,
    teacherName: raw.teacherName,
    teacherAvatarUrl: raw.teacherAvatarUrl,
    studentId: raw.studentId,
    studentName: raw.studentName,
    studentAvatarUrl: raw.studentAvatarUrl,
    subject: typeof raw.subject === "string" ? raw.subject : "Индивидуальные занятия",
    courseTitle:
      typeof raw.courseTitle === "string"
        ? raw.courseTitle
        : typeof raw.subject === "string"
          ? raw.subject
          : "Индивидуальные занятия",
    lastMessage,
    updatedAt,
    unreadForStudent: typeof raw.unreadForStudent === "number" ? raw.unreadForStudent : 0,
    unreadForTeacher: typeof raw.unreadForTeacher === "number" ? raw.unreadForTeacher : 0,
    messages
  };
}

function fallbackStore(): ChatStore {
  return {
    threads: createSeedSharedChatThreads()
  };
}

async function ensureStoreFile() {
  const storePath = resolveStorePath();
  try {
    await fs.access(storePath);
  } catch {
    await fs.writeFile(storePath, JSON.stringify(fallbackStore(), null, 2), "utf-8");
  }
}

async function readStore(): Promise<ChatStore> {
  await ensureStoreFile();
  const storePath = resolveStorePath();

  try {
    const raw = await fs.readFile(storePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<ChatStore>;
    const hasThreadsArray = Array.isArray(parsed.threads);
    const sourceThreads = hasThreadsArray ? (parsed.threads as Partial<SharedChatThread>[]) : [];
    const normalized = sourceThreads
      .map((thread) => normalizeThread(thread))
      .filter((thread): thread is SharedChatThread => Boolean(thread));

    return {
      threads: hasThreadsArray ? sortThreads(normalized) : fallbackStore().threads
    };
  } catch {
    return fallbackStore();
  }
}

async function writeStore(store: ChatStore) {
  const normalized = {
    threads: sortThreads(store.threads)
  };
  await fs.writeFile(resolveStorePath(), JSON.stringify(normalized, null, 2), "utf-8");
  return normalized;
}

function buildThreadId(teacherId: string, studentId: string) {
  return `thread-${teacherId}-${studentId}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function upsertThreadInternal(threads: SharedChatThread[], payload: EnsureThreadPayload & { threadId?: string }) {
  const index = threads.findIndex((thread) => {
    if (payload.threadId && thread.id === payload.threadId) {
      return true;
    }

    return thread.teacherId === payload.teacherId && thread.studentId === payload.studentId;
  });

  if (index < 0) {
    const now = new Date().toISOString();
    const thread: SharedChatThread = {
      id: payload.threadId ?? buildThreadId(payload.teacherId, payload.studentId),
      teacherId: payload.teacherId,
      teacherName: payload.teacherName,
      teacherAvatarUrl: payload.teacherAvatarUrl ?? "/avatars/avatar-1.svg",
      studentId: payload.studentId,
      studentName: payload.studentName,
      studentAvatarUrl: payload.studentAvatarUrl ?? "/avatars/avatar-3.svg",
      subject: payload.subject ?? "Индивидуальные занятия",
      courseTitle: payload.courseTitle ?? payload.subject ?? "Индивидуальные занятия",
      lastMessage: "",
      updatedAt: now,
      unreadForStudent: 0,
      unreadForTeacher: 0,
      messages: []
    };

    return {
      thread,
      threads: sortThreads([thread, ...threads])
    };
  }

  const current = threads[index];
  const nextThread: SharedChatThread = {
    ...current,
    teacherName: payload.teacherName || current.teacherName,
    teacherAvatarUrl: payload.teacherAvatarUrl || current.teacherAvatarUrl,
    studentName: payload.studentName || current.studentName,
    studentAvatarUrl: payload.studentAvatarUrl || current.studentAvatarUrl,
    subject: payload.subject || current.subject,
    courseTitle: payload.courseTitle || current.courseTitle
  };

  const nextThreads = [...threads];
  nextThreads[index] = nextThread;

  return {
    thread: nextThread,
    threads: sortThreads(nextThreads)
  };
}

export async function listChatThreads() {
  const store = await readStore();
  return sortThreads(store.threads);
}

export async function ensureChatThread(payload: EnsureThreadPayload & { threadId?: string }) {
  const store = await readStore();
  const next = upsertThreadInternal(store.threads, payload);
  const written = await writeStore({ threads: next.threads });
  return {
    threads: written.threads,
    thread: written.threads.find((item) => item.id === next.thread.id) ?? next.thread
  };
}

export async function appendChatMessage(payload: SendMessagePayload) {
  const store = await readStore();
  const ensured = upsertThreadInternal(store.threads, payload);
  const text = payload.text.trim();

  if (!text) {
    const written = await writeStore({ threads: ensured.threads });
    return {
      threads: written.threads,
      thread: written.threads.find((item) => item.id === ensured.thread.id) ?? ensured.thread
    };
  }

  const message: SharedChatMessage = {
    id: `chat-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    sender: payload.sender,
    text,
    sentAt: payload.sentAt ?? new Date().toISOString()
  };

  const nextThread: SharedChatThread = {
    ...ensured.thread,
    messages: [...ensured.thread.messages, message],
    lastMessage: message.text,
    updatedAt: message.sentAt,
    unreadForStudent: payload.sender === "teacher" ? ensured.thread.unreadForStudent + 1 : 0,
    unreadForTeacher: payload.sender === "student" ? ensured.thread.unreadForTeacher + 1 : 0
  };

  const nextThreads = sortThreads(ensured.threads.map((thread) => (thread.id === nextThread.id ? nextThread : thread)));
  const written = await writeStore({ threads: nextThreads });
  return {
    threads: written.threads,
    thread: written.threads.find((item) => item.id === nextThread.id) ?? nextThread
  };
}

export async function markChatThreadRead(payload: MarkReadPayload) {
  const store = await readStore();
  const nextThreads = store.threads.map((thread) => {
    if (thread.id !== payload.threadId) {
      return thread;
    }

    if (payload.viewer === "student") {
      return { ...thread, unreadForStudent: 0 };
    }

    return { ...thread, unreadForTeacher: 0 };
  });

  const written = await writeStore({ threads: nextThreads });
  return written.threads;
}
