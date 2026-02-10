import { NextResponse } from "next/server";

import type { RefundTicket } from "@/data/admin";
import { patchRefundTicket } from "@/lib/server/refund-store";

export const runtime = "nodejs";

type RefundUpdate = {
  status?: RefundTicket["status"];
  reason?: string;
  invoice?: string;
  amountRubles?: number;
  studentName?: string;
};

type PatchRefundBody = {
  update?: RefundUpdate;
};

type RefundByIdRouteContext = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, context: RefundByIdRouteContext) {
  let body: PatchRefundBody;

  try {
    body = (await request.json()) as PatchRefundBody;
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  const id = context.params?.id;
  if (!id) {
    return NextResponse.json({ error: "Не передан id возврата" }, { status: 400 });
  }

  const update = body.update;
  if (!update || typeof update !== "object") {
    return NextResponse.json({ error: "Не передан update" }, { status: 400 });
  }

  const tickets = await patchRefundTicket(id, update);
  return NextResponse.json({ tickets }, { status: 200 });
}
