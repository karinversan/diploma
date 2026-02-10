import fs from "node:fs/promises";
import path from "node:path";

import { beforeEach, describe, expect, it } from "vitest";

import { PATCH as patchAdminIncident } from "@/app/api/admin-incidents/[id]/route";
import { GET as getAdminIncidents } from "@/app/api/admin-incidents/route";
import type { LessonIncident } from "@/data/admin";

async function asJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

describe("admin incidents api routes", () => {
  beforeEach(async () => {
    const testStorePath = path.join(
      "/tmp",
      `skillzone-admin-incidents-store-test-${Date.now()}-${Math.random().toString(16).slice(2)}.json`
    );
    process.env.SKILLZONE_ADMIN_INCIDENT_STORE_PATH = testStorePath;
    await fs.writeFile(
      testStorePath,
      JSON.stringify(
        {
          incidents: [
            {
              id: "inc-test-1",
              lessonTitle: "Тестовый урок",
              teacherName: "Анна Петрова",
              studentName: "Ирина Соколова",
              type: "связь",
              severity: "средний",
              createdAt: "2026-02-10T09:00:00.000Z",
              status: "open"
            }
          ]
        },
        null,
        2
      ),
      "utf-8"
    );
  });

  it("returns incidents list", async () => {
    const response = await getAdminIncidents();
    expect(response.status).toBe(200);
    const listed = await asJson<{ incidents: LessonIncident[] }>(response);
    expect(listed.incidents).toHaveLength(1);
    expect(listed.incidents[0]?.id).toBe("inc-test-1");
  });

  it("updates incident status", async () => {
    const patchResponse = await patchAdminIncident(
      new Request("http://localhost/api/admin-incidents/inc-test-1", {
        method: "PATCH",
        body: JSON.stringify({
          update: {
            status: "resolved"
          }
        })
      }),
      {
        params: {
          id: "inc-test-1"
        }
      }
    );

    expect(patchResponse.status).toBe(200);
    const patched = await asJson<{ incidents: LessonIncident[] }>(patchResponse);
    expect(patched.incidents[0]?.status).toBe("resolved");
  });
});
