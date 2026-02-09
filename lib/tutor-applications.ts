export const TUTOR_APPLICATIONS_STORAGE_KEY = "tutor-applications-v1";

export type TutorApplicationStatus = "pending" | "approved" | "rejected";

export type TutorApplication = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subjects: string;
  experience: string;
  message?: string;
  source: "lead_form" | "signup_form";
  status: TutorApplicationStatus;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
};

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

function normalizeApplication(raw: Partial<TutorApplication>): TutorApplication | null {
  if (
    typeof raw?.id !== "string" ||
    typeof raw.fullName !== "string" ||
    typeof raw.email !== "string" ||
    typeof raw.phone !== "string" ||
    typeof raw.subjects !== "string" ||
    typeof raw.experience !== "string" ||
    (raw.source !== "lead_form" && raw.source !== "signup_form")
  ) {
    return null;
  }

  const status: TutorApplicationStatus =
    raw.status === "approved" || raw.status === "rejected" || raw.status === "pending" ? raw.status : "pending";

  return {
    id: raw.id,
    fullName: raw.fullName,
    email: raw.email,
    phone: raw.phone,
    subjects: raw.subjects,
    experience: raw.experience,
    message: typeof raw.message === "string" ? raw.message : undefined,
    source: raw.source,
    status,
    adminNote: typeof raw.adminNote === "string" ? raw.adminNote : undefined,
    createdAt: toIso(raw.createdAt),
    updatedAt: toIso(raw.updatedAt)
  };
}

export function readTutorApplications(): TutorApplication[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = parseJson<Partial<TutorApplication>[]>(window.localStorage.getItem(TUTOR_APPLICATIONS_STORAGE_KEY));

  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((item) => normalizeApplication(item))
    .filter((item): item is TutorApplication => Boolean(item))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function writeTutorApplications(applications: TutorApplication[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(TUTOR_APPLICATIONS_STORAGE_KEY, JSON.stringify(applications));
}

export function ensureTutorApplicationsSeed(seed: TutorApplication[]) {
  const current = readTutorApplications();
  if (current.length > 0) {
    return current;
  }

  writeTutorApplications(seed);
  return seed;
}

export function createTutorApplication(
  payload: Omit<TutorApplication, "id" | "status" | "createdAt" | "updatedAt" | "adminNote">,
  options?: { deduplicateByEmail?: boolean }
) {
  const now = new Date().toISOString();
  const current = readTutorApplications();
  const deduplicate = options?.deduplicateByEmail ?? true;

  if (deduplicate) {
    const existingIndex = current.findIndex((item) => item.email.toLowerCase() === payload.email.toLowerCase());

    if (existingIndex >= 0) {
      const existing = current[existingIndex];
      const updated: TutorApplication = {
        ...existing,
        ...payload,
        status: "pending",
        adminNote: undefined,
        updatedAt: now
      };
      const next = [...current];
      next[existingIndex] = updated;
      writeTutorApplications(next);
      return { next, item: updated, mode: "updated" as const };
    }
  }

  const nextItem: TutorApplication = {
    id: `ta-${Date.now()}`,
    ...payload,
    status: "pending",
    createdAt: now,
    updatedAt: now
  };

  const next = [nextItem, ...current];
  writeTutorApplications(next);
  return { next, item: nextItem, mode: "created" as const };
}

export function updateTutorApplication(
  applicationId: string,
  update: Partial<Pick<TutorApplication, "status" | "adminNote" | "updatedAt">>
) {
  const current = readTutorApplications();
  const next = current.map((item) => {
    if (item.id !== applicationId) {
      return item;
    }

    return {
      ...item,
      ...update,
      updatedAt: update.updatedAt ?? new Date().toISOString()
    };
  });

  writeTutorApplications(next);
  return next;
}
