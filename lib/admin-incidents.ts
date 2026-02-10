import { lessonIncidents, type LessonIncident } from "@/data/admin";
import { emitStorageSyncEvent } from "@/lib/storage-sync";

export const ADMIN_INCIDENTS_STORAGE_KEY = "admin-lesson-incidents-v1";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function parseJson<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function toIso(value: unknown) {
  return typeof value === "string" && value ? value : new Date().toISOString();
}

function normalizeIncident(raw: Partial<LessonIncident>): LessonIncident | null {
  if (
    typeof raw?.id !== "string" ||
    typeof raw.lessonTitle !== "string" ||
    typeof raw.teacherName !== "string" ||
    typeof raw.studentName !== "string" ||
    typeof raw.createdAt !== "string"
  ) {
    return null;
  }

  const type = raw.type === "связь" || raw.type === "оплата" || raw.type === "контент" || raw.type === "поведение" ? raw.type : "контент";
  const severity = raw.severity === "высокий" || raw.severity === "средний" || raw.severity === "низкий" ? raw.severity : "низкий";
  const status = raw.status === "open" || raw.status === "in_progress" || raw.status === "resolved" ? raw.status : "open";

  return {
    id: raw.id,
    lessonTitle: raw.lessonTitle,
    teacherName: raw.teacherName,
    studentName: raw.studentName,
    type,
    severity,
    createdAt: toIso(raw.createdAt),
    status
  };
}

function sortIncidents(incidents: LessonIncident[]) {
  return [...incidents].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

export function writeAdminLessonIncidents(incidents: LessonIncident[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(ADMIN_INCIDENTS_STORAGE_KEY, JSON.stringify(incidents));
  emitStorageSyncEvent();
}

export function readAdminLessonIncidents() {
  if (!canUseStorage()) {
    return sortIncidents(lessonIncidents);
  }

  const raw = parseJson<Partial<LessonIncident>[]>(window.localStorage.getItem(ADMIN_INCIDENTS_STORAGE_KEY));
  if (Array.isArray(raw)) {
    const normalized = raw
      .map((item) => normalizeIncident(item))
      .filter((item): item is LessonIncident => Boolean(item));

    if (normalized.length > 0) {
      return sortIncidents(normalized);
    }
  }

  writeAdminLessonIncidents(lessonIncidents);
  return sortIncidents(lessonIncidents);
}

export function updateAdminLessonIncident(
  incidentId: string,
  update: Partial<Pick<LessonIncident, "status">>
) {
  const current = readAdminLessonIncidents();
  const next = current.map((incident) => (incident.id === incidentId ? { ...incident, ...update } : incident));
  writeAdminLessonIncidents(next);
  return next;
}
