import { NextResponse } from "next/server";

import type { EnsureThreadPayload, SendMessagePayload } from "@/lib/chat-threads";
import { appendChatMessage, ensureChatThread, listChatThreads } from "@/lib/server/chat-store";

export const runtime = "nodejs";

type EnsureBody = {
  action: "ensure";
  payload?: EnsureThreadPayload & { threadId?: string };
};

type MessageBody = {
  action: "message";
  payload?: SendMessagePayload;
};

type ChatThreadsBody = EnsureBody | MessageBody;

export async function GET() {
  const threads = await listChatThreads();
  return NextResponse.json({ threads }, { status: 200 });
}

export async function POST(request: Request) {
  let body: ChatThreadsBody;

  try {
    body = (await request.json()) as ChatThreadsBody;
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  if (body.action === "ensure") {
    const payload = body.payload;
    if (!payload || typeof payload.teacherId !== "string" || typeof payload.studentId !== "string") {
      return NextResponse.json({ error: "Не переданы обязательные поля для ensure" }, { status: 400 });
    }
    const result = await ensureChatThread(payload);
    return NextResponse.json(result, { status: 200 });
  }

  if (body.action === "message") {
    const payload = body.payload;
    if (!payload || typeof payload.teacherId !== "string" || typeof payload.studentId !== "string" || typeof payload.text !== "string") {
      return NextResponse.json({ error: "Не переданы обязательные поля для message" }, { status: 400 });
    }
    if (payload.sender !== "student" && payload.sender !== "teacher") {
      return NextResponse.json({ error: "Некорректный sender" }, { status: 400 });
    }
    const result = await appendChatMessage(payload);
    return NextResponse.json(result, { status: 200 });
  }

  return NextResponse.json({ error: "Неизвестное действие" }, { status: 400 });
}
