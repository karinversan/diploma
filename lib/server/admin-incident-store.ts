import fs from "node:fs/promises";
import path from "node:path";

import { lessonIncidents, type LessonIncident } from "@/data/admin";

function resolveStorePath() {
  return process.env.SKILLZONE_ADMIN_INCIDENT_STORE_PATH || path.join("/tmp", "skillzone-admin-incidents-store-v1.json");
}

type AdminIncidentsStore = {
  incidents: LessonIncident[];
};

type IncidentUpdate = Partial<Pick<LessonIncident, "status">>;

function sortIncidents(incidents: LessonIncident[]) {
  return [...incidents].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

function fallbackStore(): AdminIncidentsStore {
  return {
    incidents: sortIncidents(lessonIncidents.map((incident) => ({ ...incident })))
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

async function readStore(): Promise<AdminIncidentsStore> {
  await ensureStoreFile();
  const storePath = resolveStorePath();

  try {
    const raw = await fs.readFile(storePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<AdminIncidentsStore>;
    return {
      incidents: Array.isArray(parsed.incidents) ? sortIncidents(parsed.incidents) : fallbackStore().incidents
    };
  } catch {
    return fallbackStore();
  }
}

async function writeStore(store: AdminIncidentsStore) {
  const normalized = {
    incidents: sortIncidents(store.incidents)
  };
  await fs.writeFile(resolveStorePath(), JSON.stringify(normalized, null, 2), "utf-8");
  return normalized;
}

export async function listAdminIncidents() {
  const store = await readStore();
  return sortIncidents(store.incidents);
}

export async function patchAdminIncident(incidentId: string, update: IncidentUpdate) {
  const store = await readStore();
  const nextIncidents = store.incidents.map((incident) => (incident.id === incidentId ? { ...incident, ...update } : incident));
  const next = await writeStore({ incidents: nextIncidents });
  return next.incidents;
}
