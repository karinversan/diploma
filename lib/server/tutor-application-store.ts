import fs from "node:fs/promises";
import path from "node:path";

import type { CreateTutorApplicationPayload, TutorApplication } from "@/lib/tutor-applications";

function resolveStorePath() {
  return process.env.SKILLZONE_TUTOR_APPLICATION_STORE_PATH || path.join("/tmp", "skillzone-tutor-applications-store-v1.json");
}

type TutorApplicationsStore = {
  applications: TutorApplication[];
};

type TutorApplicationUpdate = Partial<Pick<TutorApplication, "status" | "adminNote" | "updatedAt">>;

function sortApplications(applications: TutorApplication[]) {
  return [...applications].sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
}

function fallbackStore(): TutorApplicationsStore {
  return {
    applications: []
  };
}

async function ensureStoreFile() {
  const storePath = resolveStorePath();
  try {
    await fs.access(storePath);
  } catch {
    await fs.writeFile(storePath, JSON.stringify(fallbackStore(), null, 2), "utf-8");
  }
}

async function readStore(): Promise<TutorApplicationsStore> {
  await ensureStoreFile();
  const storePath = resolveStorePath();

  try {
    const raw = await fs.readFile(storePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<TutorApplicationsStore>;
    return {
      applications: Array.isArray(parsed.applications) ? sortApplications(parsed.applications) : []
    };
  } catch {
    return fallbackStore();
  }
}

async function writeStore(store: TutorApplicationsStore) {
  const normalized = {
    applications: sortApplications(store.applications)
  };
  await fs.writeFile(resolveStorePath(), JSON.stringify(normalized, null, 2), "utf-8");
  return normalized;
}

export async function listTutorApplications() {
  const store = await readStore();
  return sortApplications(store.applications);
}

export async function seedTutorApplications(seed: TutorApplication[]) {
  const store = await readStore();
  if (store.applications.length > 0) {
    return sortApplications(store.applications);
  }

  const next = await writeStore({ applications: seed });
  return next.applications;
}

export async function createTutorApplication(
  payload: CreateTutorApplicationPayload,
  options?: { deduplicateByEmail?: boolean }
) {
  const now = new Date().toISOString();
  const deduplicate = options?.deduplicateByEmail ?? true;

  const store = await readStore();
  if (deduplicate) {
    const index = store.applications.findIndex((item) => item.email.toLowerCase() === payload.email.toLowerCase());
    if (index >= 0) {
      const existing = store.applications[index];
      const updated: TutorApplication = {
        ...existing,
        ...payload,
        status: "pending",
        adminNote: undefined,
        updatedAt: now
      };

      const nextApplications = [...store.applications];
      nextApplications[index] = updated;
      const next = await writeStore({ applications: nextApplications });
      return {
        applications: next.applications,
        item: updated,
        mode: "updated" as const
      };
    }
  }

  const item: TutorApplication = {
    id: `ta-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    ...payload,
    status: "pending",
    createdAt: now,
    updatedAt: now
  };

  const next = await writeStore({ applications: [item, ...store.applications] });
  return {
    applications: next.applications,
    item,
    mode: "created" as const
  };
}

export async function patchTutorApplication(applicationId: string, update: TutorApplicationUpdate) {
  const store = await readStore();
  const nextApplications = store.applications.map((item) => {
    if (item.id !== applicationId) {
      return item;
    }

    return {
      ...item,
      ...update,
      updatedAt: update.updatedAt ?? new Date().toISOString()
    };
  });

  const next = await writeStore({ applications: nextApplications });
  return next.applications;
}
