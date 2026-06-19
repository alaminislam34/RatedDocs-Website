import { getCookie, setCookie, deleteCookie } from "cookies-next";

type GetCookieOptions = Parameters<typeof getCookie>[1];
type SetCookieOptions = Parameters<typeof setCookie>[2];
type DeleteCookieOptions = Parameters<typeof deleteCookie>[1];

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  user?: unknown;
}

const ACCESS_TOKEN_KEY = "rateddocs_access_token";
const REFRESH_TOKEN_KEY = "rateddocs_refresh_token";
const USER_KEY = "rateddocs_user";

const isSecureCookieContext = () => {
  if (typeof window === "undefined") {
    return process.env.NODE_ENV === "production";
  }

  return window.location.protocol === "https:";
};

const getCookieOptions = () => ({
  maxAge: 30 * 24 * 60 * 60,
  path: "/",
  secure: isSecureCookieContext(),
  sameSite: "lax" as const,
});

export function getAccessToken(options?: GetCookieOptions) {
  return (getCookie(ACCESS_TOKEN_KEY, options) as string) || null;
}

export function getRefreshToken(options?: GetCookieOptions) {
  return (getCookie(REFRESH_TOKEN_KEY, options) as string) || null;
}

export function getSessionUser<TUser = unknown>(options?: GetCookieOptions) {
  const user = getCookie(USER_KEY, options) as string;
  if (!user) return null;

  try {
    return JSON.parse(decodeURIComponent(user)) as TUser;
  } catch {
    return null;
  }
}

export function setAuthSession(session: AuthSession, options?: SetCookieOptions) {
  const mergedOptions = { ...getCookieOptions(), ...options };

  setCookie(ACCESS_TOKEN_KEY, session.accessToken, mergedOptions);

  if (session.refreshToken) {
    setCookie(REFRESH_TOKEN_KEY, session.refreshToken, mergedOptions);
  }

  if (session.user) {
    const userString = encodeURIComponent(JSON.stringify(session.user));
    setCookie(USER_KEY, userString, mergedOptions);
  }
}

export function clearAuthSession(options?: DeleteCookieOptions) {
  const mergedOptions = { ...getCookieOptions(), ...options };
  deleteCookie(ACCESS_TOKEN_KEY, mergedOptions);
  deleteCookie(REFRESH_TOKEN_KEY, mergedOptions);
  deleteCookie(USER_KEY, mergedOptions);
}

export const authStorageKeys = {
  accessToken: ACCESS_TOKEN_KEY,
  refreshToken: REFRESH_TOKEN_KEY,
  user: USER_KEY,
} as const;
