import { NextResponse } from "next/server";

import type { LessonIncident } from "@/data/admin";
import { patchAdminIncident } from "@/lib/server/admin-incident-store";

export const runtime = "nodejs";

type IncidentUpdate = Partial<Pick<LessonIncident, "status">>;

type PatchIncidentBody = {
  update?: IncidentUpdate;
};

type IncidentByIdRouteContext = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, context: IncidentByIdRouteContext) {
  let body: PatchIncidentBody;

  try {
    body = (await request.json()) as PatchIncidentBody;
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  const id = context.params?.id;
  if (!id) {
    return NextResponse.json({ error: "Не передан id инцидента" }, { status: 400 });
  }

  if (!body.update || typeof body.update !== "object") {
    return NextResponse.json({ error: "Не передан update" }, { status: 400 });
  }

  const incidents = await patchAdminIncident(id, body.update);
  return NextResponse.json({ incidents }, { status: 200 });
}
