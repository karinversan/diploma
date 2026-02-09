import { messageThreads } from "@/data/messages";
import { studentProfile } from "@/data/student";
import { teacherCabinetProfile, teacherMessageThreads } from "@/data/teacher-cabinet";
import { getTeacherById } from "@/data/teachers";

export const CHAT_THREADS_STORAGE_KEY = "skillzone-chat-threads-v1";

export type SharedChatSender = "student" | "teacher";

export type SharedChatMessage = {
  id: string;
  sender: SharedChatSender;
  text: string;
  sentAt: string;
};

export type SharedChatThread = {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherAvatarUrl: string;
  studentId: string;
  studentName: string;
  studentAvatarUrl: string;
  subject: string;
  courseTitle: string;
  lastMessage: string;
  updatedAt: string;
  unreadForStudent: number;
  unreadForTeacher: number;
  messages: SharedChatMessage[];
};

type EnsureThreadPayload = {
  teacherId: string;
  teacherName: string;
  teacherAvatarUrl?: string;
  studentId: string;
  studentName: string;
  studentAvatarUrl?: string;
  subject?: string;
  courseTitle?: string;
};

type SendMessagePayload = EnsureThreadPayload & {
  sender: SharedChatSender;
  text: string;
  threadId?: string;
  sentAt?: string;
};

type UpsertThreadResult = {
  threads: SharedChatThread[];
  thread: SharedChatThread;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function parseJson<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function toIso(value: unknown) {
  return typeof value === "string" && value ? value : new Date().toISOString();
}

function buildThreadId(teacherId: string, studentId: string) {
  return `thread-${teacherId}-${studentId}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

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
    sentAt: toIso(raw.sentAt)
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
        .map((message) => normalizeMessage(message))
        .filter((message): message is SharedChatMessage => Boolean(message))
        .sort((left, right) => new Date(left.sentAt).getTime() - new Date(right.sentAt).getTime())
    : [];

  const lastMessage = typeof raw.lastMessage === "string" ? raw.lastMessage : messages[messages.length - 1]?.text ?? "";
  const updatedAt = toIso(raw.updatedAt ?? messages[messages.length - 1]?.sentAt);

  return {
    id: raw.id,
    teacherId: raw.teacherId,
    teacherName: raw.teacherName,
    teacherAvatarUrl: raw.teacherAvatarUrl,
    studentId: raw.studentId,
    studentName: raw.studentName,
    studentAvatarUrl: raw.studentAvatarUrl,
    subject: typeof raw.subject === "string" ? raw.subject : "Индивидуальные занятия",
    courseTitle: typeof raw.courseTitle === "string" ? raw.courseTitle : (typeof raw.subject === "string" ? raw.subject : "Индивидуальные занятия"),
    lastMessage,
    updatedAt,
    unreadForStudent: typeof raw.unreadForStudent === "number" ? raw.unreadForStudent : 0,
    unreadForTeacher: typeof raw.unreadForTeacher === "number" ? raw.unreadForTeacher : 0,
    messages
  };
}

function seedFromStudentThreads(): SharedChatThread[] {
  return messageThreads.map((thread) => {
    const teacher = getTeacherById(thread.teacherId);
    const teacherAvatarUrl = teacher?.avatarUrl ?? thread.teacherAvatarUrl ?? "/avatars/avatar-1.svg";
    const normalizedMessages = thread.messages
      .map((message) => normalizeMessage(message))
      .filter((message): message is SharedChatMessage => Boolean(message))
      .sort((left, right) => new Date(left.sentAt).getTime() - new Date(right.sentAt).getTime());

    return {
      id: thread.id,
      teacherId: thread.teacherId,
      teacherName: thread.teacherName,
      teacherAvatarUrl,
      studentId: studentProfile.id,
      studentName: studentProfile.name,
      studentAvatarUrl: studentProfile.avatarUrl,
      subject: thread.subject,
      courseTitle: thread.subject,
      lastMessage: thread.lastMessage,
      updatedAt: toIso(thread.updatedAt),
      unreadForStudent: thread.unreadCount,
      unreadForTeacher: 0,
      messages: normalizedMessages
    };
  });
}

function seedFromTeacherThreads(): SharedChatThread[] {
  return teacherMessageThreads.map((thread) => {
    const normalizedMessages = thread.messages
      .map((message) => normalizeMessage(message))
      .filter((message): message is SharedChatMessage => Boolean(message))
      .sort((left, right) => new Date(left.sentAt).getTime() - new Date(right.sentAt).getTime());

    return {
      id: thread.id,
      teacherId: teacherCabinetProfile.id,
      teacherName: teacherCabinetProfile.name,
      teacherAvatarUrl: teacherCabinetProfile.avatarUrl,
      studentId: thread.studentId,
      studentName: thread.studentName,
      studentAvatarUrl: thread.studentAvatarUrl,
      subject: thread.courseTitle,
      courseTitle: thread.courseTitle,
      lastMessage: thread.lastMessage,
      updatedAt: toIso(thread.updatedAt),
      unreadForStudent: 0,
      unreadForTeacher: thread.unreadCount,
      messages: normalizedMessages
    };
  });
}

function mergeSeedThreads(threads: SharedChatThread[]) {
  const merged = new Map<string, SharedChatThread>();

  for (const thread of threads) {
    const key = `${thread.teacherId}::${thread.studentId}`;
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, thread);
      continue;
    }

    const combinedMessages = [...existing.messages, ...thread.messages]
      .sort((left, right) => new Date(left.sentAt).getTime() - new Date(right.sentAt).getTime())
      .filter((message, index, list) => list.findIndex((item) => item.id === message.id) === index);

    const lastMessage = combinedMessages[combinedMessages.length - 1]?.text ?? thread.lastMessage ?? existing.lastMessage;
    const updatedAt = [existing.updatedAt, thread.updatedAt]
      .map((value) => new Date(value).getTime())
      .sort((left, right) => right - left)[0];

    merged.set(key, {
      ...existing,
      teacherName: thread.teacherName || existing.teacherName,
      teacherAvatarUrl: thread.teacherAvatarUrl || existing.teacherAvatarUrl,
      studentName: thread.studentName || existing.studentName,
      studentAvatarUrl: thread.studentAvatarUrl || existing.studentAvatarUrl,
      subject: thread.subject || existing.subject,
      courseTitle: thread.courseTitle || existing.courseTitle,
      unreadForStudent: existing.unreadForStudent + thread.unreadForStudent,
      unreadForTeacher: existing.unreadForTeacher + thread.unreadForTeacher,
      messages: combinedMessages,
      lastMessage,
      updatedAt: Number.isFinite(updatedAt) ? new Date(updatedAt).toISOString() : toIso(existing.updatedAt)
    });
  }

  return sortThreads(Array.from(merged.values()));
}

function createSeedThreads() {
  return mergeSeedThreads([...seedFromStudentThreads(), ...seedFromTeacherThreads()]);
}

function createThread(payload: EnsureThreadPayload): SharedChatThread {
  const teacherFromCatalog = getTeacherById(payload.teacherId);
  const now = new Date().toISOString();

  return {
    id: buildThreadId(payload.teacherId, payload.studentId),
    teacherId: payload.teacherId,
    teacherName: payload.teacherName,
    teacherAvatarUrl: payload.teacherAvatarUrl ?? teacherFromCatalog?.avatarUrl ?? "/avatars/avatar-1.svg",
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
}

function upsertThreadInternal(threads: SharedChatThread[], payload: EnsureThreadPayload & { threadId?: string }): UpsertThreadResult {
  const index = threads.findIndex((thread) => {
    if (payload.threadId && thread.id === payload.threadId) {
      return true;
    }

    return thread.teacherId === payload.teacherId && thread.studentId === payload.studentId;
  });

  if (index < 0) {
    const nextThread = createThread(payload);
    return { thread: nextThread, threads: sortThreads([nextThread, ...threads]) };
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

  const next = [...threads];
  next[index] = nextThread;
  return { thread: nextThread, threads: sortThreads(next) };
}

export function readSharedChatThreads(): SharedChatThread[] {
  if (!canUseStorage()) {
    return createSeedThreads();
  }

  const raw = parseJson<Partial<SharedChatThread>[]>(window.localStorage.getItem(CHAT_THREADS_STORAGE_KEY));
  if (Array.isArray(raw)) {
    const normalized = raw
      .map((thread) => normalizeThread(thread))
      .filter((thread): thread is SharedChatThread => Boolean(thread));

    if (normalized.length > 0) {
      return sortThreads(normalized);
    }
  }

  const seeded = createSeedThreads();
  writeSharedChatThreads(seeded);
  return seeded;
}

export function writeSharedChatThreads(threads: SharedChatThread[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(CHAT_THREADS_STORAGE_KEY, JSON.stringify(threads));
}

export function ensureSharedChatThread(payload: EnsureThreadPayload & { threadId?: string }) {
  const current = readSharedChatThreads();
  const result = upsertThreadInternal(current, payload);
  writeSharedChatThreads(result.threads);
  return result;
}

export function sendMessageToSharedChatThread(payload: SendMessagePayload) {
  const current = readSharedChatThreads();
  const upsertResult = upsertThreadInternal(current, payload);
  const now = payload.sentAt ?? new Date().toISOString();

  const nextMessage: SharedChatMessage = {
    id: `chat-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    sender: payload.sender,
    text: payload.text.trim(),
    sentAt: now
  };

  if (!nextMessage.text) {
    return upsertResult;
  }

  const nextThread: SharedChatThread = {
    ...upsertResult.thread,
    messages: [...upsertResult.thread.messages, nextMessage],
    lastMessage: nextMessage.text,
    updatedAt: nextMessage.sentAt,
    unreadForStudent: payload.sender === "teacher" ? upsertResult.thread.unreadForStudent + 1 : 0,
    unreadForTeacher: payload.sender === "student" ? upsertResult.thread.unreadForTeacher + 1 : 0
  };

  const nextThreads = sortThreads(
    upsertResult.threads.map((thread) => (thread.id === nextThread.id ? nextThread : thread))
  );

  writeSharedChatThreads(nextThreads);
  return { thread: nextThread, threads: nextThreads };
}

export function markSharedChatThreadRead(threadId: string, viewer: SharedChatSender) {
  const current = readSharedChatThreads();
  const next = current.map((thread) => {
    if (thread.id !== threadId) {
      return thread;
    }

    if (viewer === "student") {
      return { ...thread, unreadForStudent: 0 };
    }

    return { ...thread, unreadForTeacher: 0 };
  });

  writeSharedChatThreads(next);
  return next;
}
