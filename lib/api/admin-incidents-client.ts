"use client";

import type { LessonIncident } from "@/data/admin";
import { readAdminLessonIncidents, updateAdminLessonIncident, writeAdminLessonIncidents } from "@/lib/admin-incidents";

type IncidentsResponse = {
  incidents: LessonIncident[];
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

function hydrateIncidentsLocal(incidents: LessonIncident[]) {
  writeAdminLessonIncidents(incidents);
  return incidents;
}

export async function syncAdminIncidentsFromApi() {
  const remote = await requestJson<IncidentsResponse>("/api/admin-incidents");
  if (remote?.incidents) {
    return hydrateIncidentsLocal(remote.incidents);
  }

  return readAdminLessonIncidents();
}

export async function updateAdminIncidentViaApi(incidentId: string, update: Partial<Pick<LessonIncident, "status">>) {
  const remote = await requestJson<IncidentsResponse>(`/api/admin-incidents/${encodeURIComponent(incidentId)}`, {
    method: "PATCH",
    body: JSON.stringify({ update })
  });

  if (remote?.incidents) {
    return hydrateIncidentsLocal(remote.incidents);
  }

  return updateAdminLessonIncident(incidentId, update);
}
