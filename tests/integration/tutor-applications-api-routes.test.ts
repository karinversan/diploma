import fs from "node:fs/promises";
import path from "node:path";

import { beforeEach, describe, expect, it } from "vitest";

import { PATCH as patchTutorApplication } from "@/app/api/tutor-applications/[id]/route";
import { GET as getTutorApplications, POST as postTutorApplications } from "@/app/api/tutor-applications/route";
import type { TutorApplication } from "@/lib/tutor-applications";

async function asJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

describe("tutor applications api routes", () => {
  beforeEach(async () => {
    const testStorePath = path.join(
      "/tmp",
      `skillzone-tutor-applications-store-test-${Date.now()}-${Math.random().toString(16).slice(2)}.json`
    );
    process.env.SKILLZONE_TUTOR_APPLICATION_STORE_PATH = testStorePath;
    await fs.writeFile(testStorePath, JSON.stringify({ applications: [] }, null, 2), "utf-8");
  });

  it("seeds and creates tutor applications with deduplication", async () => {
    const seedResponse = await postTutorApplications(
      new Request("http://localhost/api/tutor-applications", {
        method: "POST",
        body: JSON.stringify({
          action: "seed",
          seed: [
            {
              id: "seed-1",
              fullName: "Елена Смирнова",
              email: "elena@example.com",
              phone: "+7 (900) 111-11-11",
              subjects: "Английский",
              experience: "5 лет",
              source: "lead_form",
              status: "pending",
              createdAt: "2026-02-01T10:00:00.000Z",
              updatedAt: "2026-02-01T10:00:00.000Z"
            }
          ]
        })
      })
    );
    expect(seedResponse.status).toBe(200);

    const createResponse = await postTutorApplications(
      new Request("http://localhost/api/tutor-applications", {
        method: "POST",
        body: JSON.stringify({
          action: "create",
          payload: {
            fullName: "Марина Котова",
            email: "marina@example.com",
            phone: "+7 (900) 222-22-22",
            subjects: "Экономика",
            experience: "7 лет",
            source: "signup_form"
          }
        })
      })
    );
    expect(createResponse.status).toBe(200);
    const created = await asJson<{ applications: TutorApplication[]; mode: "created" | "updated" }>(createResponse);
    expect(created.mode).toBe("created");
    expect(created.applications.length).toBe(2);

    const dedupeResponse = await postTutorApplications(
      new Request("http://localhost/api/tutor-applications", {
        method: "POST",
        body: JSON.stringify({
          action: "create",
          payload: {
            fullName: "Марина Котова (обновлено)",
            email: "marina@example.com",
            phone: "+7 (900) 333-33-33",
            subjects: "Экономика, финансы",
            experience: "8 лет",
            source: "lead_form"
          }
        })
      })
    );
    const deduped = await asJson<{ applications: TutorApplication[]; mode: "created" | "updated" }>(dedupeResponse);
    expect(deduped.mode).toBe("updated");
    expect(deduped.applications.length).toBe(2);
  });

  it("updates tutor application status", async () => {
    const createResponse = await postTutorApplications(
      new Request("http://localhost/api/tutor-applications", {
        method: "POST",
        body: JSON.stringify({
          action: "create",
          payload: {
            fullName: "Ирина Соколова",
            email: "irina@example.com",
            phone: "+7 (900) 444-44-44",
            subjects: "Математика",
            experience: "4 года",
            source: "lead_form"
          }
        })
      })
    );
    const created = await asJson<{ item: TutorApplication }>(createResponse);
    const id = created.item.id;

    const patchResponse = await patchTutorApplication(
      new Request(`http://localhost/api/tutor-applications/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          update: {
            status: "approved",
            adminNote: "Проверка пройдена"
          }
        })
      }),
      {
        params: {
          id
        }
      }
    );

    expect(patchResponse.status).toBe(200);
    const patched = await asJson<{ applications: TutorApplication[] }>(patchResponse);
    expect(patched.applications[0]?.status).toBe("approved");
    expect(patched.applications[0]?.adminNote).toContain("Проверка");

    const listResponse = await getTutorApplications();
    const listed = await asJson<{ applications: TutorApplication[] }>(listResponse);
    expect(listed.applications[0]?.id).toBe(id);
  });
});
