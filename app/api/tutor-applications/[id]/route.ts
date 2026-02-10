import { NextResponse } from "next/server";

import type { TutorApplication } from "@/lib/tutor-applications";
import { patchTutorApplication } from "@/lib/server/tutor-application-store";

export const runtime = "nodejs";

type TutorApplicationUpdate = Partial<Pick<TutorApplication, "status" | "adminNote" | "updatedAt">>;

type PatchTutorApplicationBody = {
  update?: TutorApplicationUpdate;
};

type TutorApplicationByIdContext = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, context: TutorApplicationByIdContext) {
  let body: PatchTutorApplicationBody;

  try {
    body = (await request.json()) as PatchTutorApplicationBody;
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  const id = context.params?.id;
  if (!id) {
    return NextResponse.json({ error: "Не передан id заявки" }, { status: 400 });
  }

  if (!body.update || typeof body.update !== "object") {
    return NextResponse.json({ error: "Не передан update" }, { status: 400 });
  }

  const applications = await patchTutorApplication(id, body.update);
  return NextResponse.json({ applications }, { status: 200 });
}
