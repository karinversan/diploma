import fs from "node:fs/promises";
import path from "node:path";

import { beforeEach, describe, expect, it } from "vitest";

import { PATCH as patchChatRead } from "@/app/api/chat-threads/[id]/read/route";
import { GET as getChatThreads, POST as postChatThreads } from "@/app/api/chat-threads/route";
import type { SharedChatThread } from "@/lib/chat-threads";

async function asJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

describe("chat threads api routes", () => {
  beforeEach(async () => {
    const testStorePath = path.join("/tmp", `skillzone-chat-store-test-${Date.now()}-${Math.random().toString(16).slice(2)}.json`);
    process.env.SKILLZONE_CHAT_STORE_PATH = testStorePath;
    await fs.writeFile(testStorePath, JSON.stringify({ threads: [] }, null, 2), "utf-8");
  });

  it("creates thread and sends message via unified route", async () => {
    const ensureResponse = await postChatThreads(
      new Request("http://localhost/api/chat-threads", {
        method: "POST",
        body: JSON.stringify({
          action: "ensure",
          payload: {
            teacherId: "teacher-chat-1",
            teacherName: "Анна Петрова",
            studentId: "student-chat-1",
            studentName: "Ирина Соколова",
            subject: "Английский"
          }
        })
      })
    );

    expect(ensureResponse.status).toBe(200);
    const ensured = await asJson<{ threads: SharedChatThread[]; thread: SharedChatThread }>(ensureResponse);
    expect(ensured.threads).toHaveLength(1);
    expect(ensured.thread.teacherName).toBe("Анна Петрова");

    const messageResponse = await postChatThreads(
      new Request("http://localhost/api/chat-threads", {
        method: "POST",
        body: JSON.stringify({
          action: "message",
          payload: {
            threadId: ensured.thread.id,
            teacherId: "teacher-chat-1",
            teacherName: "Анна Петрова",
            studentId: "student-chat-1",
            studentName: "Ирина Соколова",
            sender: "student",
            text: "Здравствуйте! Подскажите, как подготовиться к уроку?"
          }
        })
      })
    );

    expect(messageResponse.status).toBe(200);
    const messaged = await asJson<{ threads: SharedChatThread[]; thread: SharedChatThread }>(messageResponse);
    expect(messaged.thread.messages).toHaveLength(1);
    expect(messaged.thread.unreadForTeacher).toBe(1);
    expect(messaged.thread.unreadForStudent).toBe(0);

    const listResponse = await getChatThreads();
    const listed = await asJson<{ threads: SharedChatThread[] }>(listResponse);
    expect(listed.threads).toHaveLength(1);
    expect(listed.threads[0]?.messages[0]?.text).toContain("подготовиться");
  });

  it("marks thread as read for selected viewer", async () => {
    const messageResponse = await postChatThreads(
      new Request("http://localhost/api/chat-threads", {
        method: "POST",
        body: JSON.stringify({
          action: "message",
          payload: {
            teacherId: "teacher-chat-2",
            teacherName: "Евгений Смирнов",
            studentId: "student-chat-2",
            studentName: "Марина Белова",
            sender: "teacher",
            text: "Проверьте домашнее задание до 20:00."
          }
        })
      })
    );
    const messaged = await asJson<{ thread: SharedChatThread }>(messageResponse);

    const patchResponse = await patchChatRead(
      new Request(`http://localhost/api/chat-threads/${messaged.thread.id}/read`, {
        method: "PATCH",
        body: JSON.stringify({
          viewer: "student"
        })
      }),
      {
        params: {
          id: messaged.thread.id
        }
      }
    );

    expect(patchResponse.status).toBe(200);
    const patched = await asJson<{ threads: SharedChatThread[] }>(patchResponse);
    expect(patched.threads[0]?.unreadForStudent).toBe(0);
  });
});
