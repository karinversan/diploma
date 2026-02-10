import { NextResponse } from "next/server";

import { markChatThreadRead } from "@/lib/server/chat-store";
import type { SharedChatSender } from "@/lib/chat-threads";

export const runtime = "nodejs";

type MarkReadBody = {
  viewer?: SharedChatSender;
};

type ChatReadRouteContext = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, context: ChatReadRouteContext) {
  let body: MarkReadBody;

  try {
    body = (await request.json()) as MarkReadBody;
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  const threadId = context.params?.id;
  if (!threadId) {
    return NextResponse.json({ error: "Не передан id треда" }, { status: 400 });
  }

  const viewer = body.viewer;
  if (viewer !== "student" && viewer !== "teacher") {
    return NextResponse.json({ error: "viewer должен быть student или teacher" }, { status: 400 });
  }

  const threads = await markChatThreadRead({ threadId, viewer });
  return NextResponse.json({ threads }, { status: 200 });
}
