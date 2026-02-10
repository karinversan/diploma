import { NextResponse } from "next/server";

import type { CreateTutorApplicationPayload, TutorApplication } from "@/lib/tutor-applications";
import { createTutorApplication, listTutorApplications, seedTutorApplications } from "@/lib/server/tutor-application-store";

export const runtime = "nodejs";

type CreateBody = {
  action: "create";
  payload?: CreateTutorApplicationPayload;
  deduplicateByEmail?: boolean;
};

type SeedBody = {
  action: "seed";
  seed?: TutorApplication[];
};

type TutorApplicationsBody = CreateBody | SeedBody;

export async function GET() {
  const applications = await listTutorApplications();
  return NextResponse.json({ applications }, { status: 200 });
}

export async function POST(request: Request) {
  let body: TutorApplicationsBody;

  try {
    body = (await request.json()) as TutorApplicationsBody;
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  if (body.action === "seed") {
    const seed = Array.isArray(body.seed) ? body.seed : [];
    const applications = await seedTutorApplications(seed);
    return NextResponse.json({ applications }, { status: 200 });
  }

  if (body.action === "create") {
    const payload = body.payload;
    if (
      !payload ||
      typeof payload.fullName !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.phone !== "string" ||
      typeof payload.subjects !== "string" ||
      typeof payload.experience !== "string" ||
      (payload.source !== "lead_form" && payload.source !== "signup_form")
    ) {
      return NextResponse.json({ error: "Не переданы обязательные поля заявки" }, { status: 400 });
    }

    const created = await createTutorApplication(payload, { deduplicateByEmail: body.deduplicateByEmail ?? true });
    return NextResponse.json(created, { status: 200 });
  }

  return NextResponse.json({ error: "Неизвестное действие" }, { status: 400 });
}
