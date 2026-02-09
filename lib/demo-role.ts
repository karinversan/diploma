export type DemoRole = "student" | "teacher" | "admin";

export const DEMO_ROLE_STORAGE_KEY = "skillzone-demo-role";

export function resolveRouteByRole(role: DemoRole) {
  if (role === "teacher") {
    return "/teacher";
  }

  if (role === "admin") {
    return "/admin";
  }

  return "/app";
}

export function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readDemoRole(): DemoRole {
  if (!canUseStorage()) {
    return "student";
  }

  const raw = window.localStorage.getItem(DEMO_ROLE_STORAGE_KEY);
  if (raw === "teacher" || raw === "admin" || raw === "student") {
    return raw;
  }

  return "student";
}

export function writeDemoRole(role: DemoRole) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(DEMO_ROLE_STORAGE_KEY, role);
}
