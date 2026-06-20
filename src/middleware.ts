import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("rateddocs_access_token")?.value;

  const isProtectedRoute =
    pathname.startsWith("/dentist") ||
    pathname.startsWith("/patient") ||
    pathname.startsWith("/admin");

  if (isProtectedRoute && !token) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
    // For dentists/patients, signin is modal-based on root. Redirect to home.
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sw.js (service worker)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sw.js).*)",
  ],
};
