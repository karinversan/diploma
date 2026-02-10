"use client";

import {
  type EnsureThreadPayload,
  ensureSharedChatThread,
  markSharedChatThreadRead,
  readSharedChatThreads,
  type SendMessagePayload,
  sendMessageToSharedChatThread,
  type SharedChatSender,
  type SharedChatThread,
  writeSharedChatThreads
} from "@/lib/chat-threads";

type ThreadsResponse = {
  threads: SharedChatThread[];
};

type UpsertResponse = ThreadsResponse & {
  thread: SharedChatThread;
};

async function requestJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      },
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function hydrateThreadsLocal(threads: SharedChatThread[]) {
  writeSharedChatThreads(threads);
  return threads;
}

function findThreadById(threads: SharedChatThread[], threadId: string) {
  return threads.find((thread) => thread.id === threadId);
}

export async function syncChatThreadsFromApi() {
  const remote = await requestJson<ThreadsResponse>("/api/chat-threads");
  if (remote?.threads) {
    return hydrateThreadsLocal(remote.threads);
  }
  return readSharedChatThreads();
}

export async function ensureSharedChatThreadViaApi(payload: EnsureThreadPayload & { threadId?: string }) {
  const remote = await requestJson<UpsertResponse>("/api/chat-threads", {
    method: "POST",
    body: JSON.stringify({
      action: "ensure",
      payload
    })
  });

  if (remote?.threads && remote.thread) {
    hydrateThreadsLocal(remote.threads);
    return {
      threads: remote.threads,
      thread: remote.thread
    };
  }

  return ensureSharedChatThread(payload);
}

export async function sendMessageToSharedChatThreadViaApi(payload: SendMessagePayload) {
  const remote = await requestJson<UpsertResponse>("/api/chat-threads", {
    method: "POST",
    body: JSON.stringify({
      action: "message",
      payload
    })
  });

  if (remote?.threads && remote.thread) {
    hydrateThreadsLocal(remote.threads);
    return {
      threads: remote.threads,
      thread: remote.thread
    };
  }

  return sendMessageToSharedChatThread(payload);
}

export async function markSharedChatThreadReadViaApi(threadId: string, viewer: SharedChatSender) {
  const remote = await requestJson<ThreadsResponse>(`/api/chat-threads/${encodeURIComponent(threadId)}/read`, {
    method: "PATCH",
    body: JSON.stringify({ viewer })
  });

  if (remote?.threads) {
    const threads = hydrateThreadsLocal(remote.threads);
    return threads;
  }

  return markSharedChatThreadRead(threadId, viewer);
}

export function getThreadFromCurrentStorage(threadId: string) {
  const threads = readSharedChatThreads();
  return findThreadById(threads, threadId);
}
