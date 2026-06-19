export type UserRole = "ADMIN" | "DENTIST" | "PATIENT";

export const ROLE_HOME: Record<UserRole, string> = {
  ADMIN: "/admin",
  DENTIST: "/dentist",
  PATIENT: "/patient",
};

export const LOGIN_PATH_BY_ROLE: Record<UserRole, string> = {
  ADMIN: "/admin-login",
  DENTIST: "/doctor-login",
  PATIENT: "/",
};

export function normalizeRole(role: string | undefined | null): UserRole | null {
  const normalized = role?.toUpperCase();

  if (normalized === "ADMIN") return "ADMIN";
  if (normalized === "DENTIST" || normalized === "DOCTOR") return "DENTIST";
  if (normalized === "PATIENT" || normalized === "USER") return "PATIENT";

  return null;
}

export function getRoleHome(role: string | undefined | null) {
  const normalized = normalizeRole(role);
  return normalized ? ROLE_HOME[normalized] : "/";
}
