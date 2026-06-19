import { describe, it, expect, vi } from "vitest";
import { decodeToken, isTokenExpired, getRoleFromToken } from "./session-decoder";

// Helper to create mock JWT token (header.payload.signature)
function createMockJWT(payload: object): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const payloadStr = btoa(JSON.stringify(payload))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${header}.${payloadStr}.mocksignature`;
}

describe("session-decoder", () => {
  describe("decodeToken", () => {
    it("should return null for malformed tokens", () => {
      expect(decodeToken("invalid-token")).toBeNull();
      expect(decodeToken("header.payload")).toBeNull();
    });

    it("should decode a valid mock token payload correctly", () => {
      const mockPayload = { user_id: 123, email: "doc@example.com", type: "DENTIST" };
      const token = createMockJWT(mockPayload);
      const decoded = decodeToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.user_id).toBe(123);
      expect(decoded?.email).toBe("doc@example.com");
      expect(decoded?.type).toBe("DENTIST");
    });
  });

  describe("isTokenExpired", () => {
    it("should return true if token has no exp claim", () => {
      const token = createMockJWT({ user_id: 123 });
      expect(isTokenExpired(token)).toBe(true);
    });

    it("should return true if token is expired", () => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const token = createMockJWT({ exp: pastTime });
      expect(isTokenExpired(token)).toBe(true);
    });

    it("should return false if token is not expired", () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour in future
      const token = createMockJWT({ exp: futureTime });
      expect(isTokenExpired(token)).toBe(false);
    });
  });

  describe("getRoleFromToken", () => {
    it("should return parsed role matching normalizeRole output", () => {
      const token = createMockJWT({ type: "dentist" });
      expect(getRoleFromToken(token)).toBe("DENTIST");
    });

    it("should support role claim as fallback", () => {
      const token = createMockJWT({ role: "admin" });
      expect(getRoleFromToken(token)).toBe("ADMIN");
    });

    it("should return null if no role type found", () => {
      const token = createMockJWT({ user_id: 123 });
      expect(getRoleFromToken(token)).toBeNull();
    });
  });
});
