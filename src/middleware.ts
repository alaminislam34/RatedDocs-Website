import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  LOGIN_PATH_BY_ROLE,
  normalizeRole,
  ROLE_HOME,
  type UserRole,
} from "@/lib/auth/roles";
import { getRoleFromToken, isTokenExpired } from "@/lib/auth/session-decoder";

const ACCESS_TOKEN_COOKIE = "rateddocs_access_token";
const USER_COOKIE = "rateddocs_user";

const ROUTE_ROLE: Array<{ prefix: string; role: UserRole }> = [
  { prefix: "/admin", role: "ADMIN" },
  { prefix: "/dentist", role: "DENTIST" },
  { prefix: "/patient", role: "PATIENT" },
];

const PUBLIC_AUTH_PATHS = new Set([
  "/admin-login",
  "/doctor-login",
  "/register-doctor",
]);

function getRequiredRole(pathname: string) {
  return ROUTE_ROLE.find(({ prefix }) => pathname.startsWith(prefix))?.role;
}

function redirectTo(request: NextRequest, pathname: string) {
  return NextResponse.redirect(new URL(pathname, request.url));
}

function getRoleFromUserCookie(request: NextRequest) {
  const userCookie = request.cookies.get(USER_COOKIE)?.value;
  if (!userCookie) return null;

  try {
    const user = JSON.parse(decodeURIComponent(userCookie)) as {
      type: string;
      email: string;
      user_id: number;
    };

    return normalizeRole(user.type);
  } catch {
    return null;
  }
}

function resolveRoleAccess(
  request: NextRequest,
  role: UserRole,
  requiredRole?: UserRole,
) {
  if (PUBLIC_AUTH_PATHS.has(request.nextUrl.pathname)) {
    return redirectTo(request, ROLE_HOME[role]);
  }

  if (requiredRole && role !== requiredRole) {
    return redirectTo(request, ROLE_HOME[role]);
  }

  return NextResponse.next();
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const isPublicAuthRoute = PUBLIC_AUTH_PATHS.has(pathname);
  const requiredRole = isPublicAuthRoute
    ? undefined
    : getRequiredRole(pathname);

  // If the route doesn't require a specific role, and it's not a public auth route, allow it
  if (!requiredRole && !isPublicAuthRoute) {
    return NextResponse.next();
  }

  // If there is no token:
  // - If it requires a role, redirect to login page for that role.
  // - If it's a public auth route, let the user load the login page.
  if (!token) {
    if (requiredRole) {
      return redirectTo(request, LOGIN_PATH_BY_ROLE[requiredRole]);
    }
    return NextResponse.next();
  }

  // If token is expired, treat as no token
  if (isTokenExpired(token)) {
    const redirectResponse = requiredRole
      ? redirectTo(request, LOGIN_PATH_BY_ROLE[requiredRole])
      : NextResponse.next();
    
    // Clear cookies on redirect
    redirectResponse.cookies.delete(ACCESS_TOKEN_COOKIE);
    redirectResponse.cookies.delete(USER_COOKIE);
    return redirectResponse;
  }

  // Determine user's role from JWT or fallback cookie
  const role = getRoleFromToken(token) ?? getRoleFromUserCookie(request);

  if (!role) {
    const redirectResponse = requiredRole
      ? redirectTo(request, LOGIN_PATH_BY_ROLE[requiredRole])
      : NextResponse.next();
    redirectResponse.cookies.delete(ACCESS_TOKEN_COOKIE);
    redirectResponse.cookies.delete(USER_COOKIE);
    return redirectResponse;
  }

  // Resolve access based on user role and the route requirements
  return resolveRoleAccess(request, role, requiredRole);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sw.js).*)"],
};
