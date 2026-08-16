import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Routes that require authentication ──────────────────────────────────────
const PROTECTED_PATHS = [
  "/profile",
  "/settings",
  "/owner",
  "/admin",
  "/booking",
  "/wishlist",
  "/recently-viewed",
  "/saved-searches",
  "/onboarding",
];

// ─── Routes that require admin role (checked via a lightweight RT presence
//     heuristic — full role validation happens server-side on each API call) ──
const ADMIN_PATHS = ["/admin"];

// ─── Public-only routes (redirect logged-in users away) ──────────────────────
const AUTH_ONLY_PATHS = ["/login", "/signup"];

const RT_KEY = "_roc_sid"; // must match TokenManager

function isProtected(pathname: string): boolean {
  return PROTECTED_PATHS.some((p) => pathname.startsWith(p));
}

function isAdminPath(pathname: string): boolean {
  return ADMIN_PATHS.some((p) => pathname.startsWith(p));
}

function isAuthOnlyPath(pathname: string): boolean {
  return AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read RT from cookies (Next.js middleware can't access localStorage)
  // Note: RT is in localStorage client-side. We use a parallel cookie-free
  // approach: middleware only reads a lightweight presence indicator cookie
  // that auth-provider sets on login.
  const hasSession = request.cookies.has("_roc_has_session");

  // ── Redirect unauthenticated users away from protected pages ───────────────
  if (isProtected(pathname) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // ── Redirect authenticated users away from /login and /signup ─────────────
  if (isAuthOnlyPath(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
