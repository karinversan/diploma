"use client";

import {
  createTutorApplication,
  type CreateTutorApplicationPayload,
  ensureTutorApplicationsSeed,
  readTutorApplications,
  type TutorApplication,
  updateTutorApplication,
  writeTutorApplications
} from "@/lib/tutor-applications";

type ApplicationsResponse = {
  applications: TutorApplication[];
};

type CreateResponse = ApplicationsResponse & {
  item: TutorApplication;
  mode: "created" | "updated";
};

async function requestJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      },
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function hydrateApplicationsLocal(applications: TutorApplication[]) {
  writeTutorApplications(applications);
  return applications;
}

export async function syncTutorApplicationsFromApi() {
  const remote = await requestJson<ApplicationsResponse>("/api/tutor-applications");
  if (remote?.applications) {
    return hydrateApplicationsLocal(remote.applications);
  }

  return readTutorApplications();
}

export async function ensureTutorApplicationsSeedViaApi(seed: TutorApplication[]) {
  const remote = await requestJson<ApplicationsResponse>("/api/tutor-applications", {
    method: "POST",
    body: JSON.stringify({
      action: "seed",
      seed
    })
  });

  if (remote?.applications) {
    return hydrateApplicationsLocal(remote.applications);
  }

  return ensureTutorApplicationsSeed(seed);
}

export async function createTutorApplicationViaApi(
  payload: CreateTutorApplicationPayload,
  options?: { deduplicateByEmail?: boolean }
) {
  const remote = await requestJson<CreateResponse>("/api/tutor-applications", {
    method: "POST",
    body: JSON.stringify({
      action: "create",
      payload,
      deduplicateByEmail: options?.deduplicateByEmail ?? true
    })
  });

  if (remote?.applications && remote.item) {
    hydrateApplicationsLocal(remote.applications);
    return {
      next: remote.applications,
      item: remote.item,
      mode: remote.mode
    };
  }

  return createTutorApplication(payload, options);
}

export async function updateTutorApplicationViaApi(
  applicationId: string,
  update: Partial<Pick<TutorApplication, "status" | "adminNote" | "updatedAt">>
) {
  const remote = await requestJson<ApplicationsResponse>(`/api/tutor-applications/${encodeURIComponent(applicationId)}`, {
    method: "PATCH",
    body: JSON.stringify({ update })
  });

  if (remote?.applications) {
    return hydrateApplicationsLocal(remote.applications);
  }

  return updateTutorApplication(applicationId, update);
}
