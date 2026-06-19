import { normalizeRole, type UserRole } from "./roles";

interface JWTPayload {
  type?: string;
  role?: string;
  user_id?: number;
  email?: string;
  exp?: number;
}

function decodeBase64Url(value: string): string {
  try {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    return atob(padded);
  } catch {
    return "";
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    if (!payload) return null;

    const decodedString = decodeBase64Url(payload);
    if (!decodedString) return null;

    return JSON.parse(decodedString) as JWTPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  // exp claim is in seconds, Date.now() is in milliseconds
  return decoded.exp * 1000 < Date.now();
}

export function getRoleFromToken(token: string): UserRole | null {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  const roleString = decoded.type ?? decoded.role;
  if (!roleString) return null;

  return normalizeRole(roleString);
}
