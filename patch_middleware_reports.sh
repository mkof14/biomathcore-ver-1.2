#!/usr/bin/env bash
set -euo pipefail
ROOT="$(pwd)"

MW="$ROOT/src/middleware.ts"

cat > "$MW" <<'TS'
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Route protection:
 * - Protect /member-zone/** and /services/**
 * - Require auth for all protected routes
 * - Require active plan (core|daily|max) for most, except a small allowlist
 *
 * Allowlist (auth required, plan NOT required):
 * - /member-zone/devices
 * - /member-zone/blackbox/notes
 * - /member-zone/reports
 */

const PROTECTED_PATHS = [
  /^\/member-zone(\/.*)?$/i,
  /^\/services(\/.*)?$/i,
];

const ALLOW_NO_PLAN = [
  /^\/member-zone\/devices(\/.*)?$/i,
  /^\/member-zone\/blackbox\/notes(\/.*)?$/i,
  /^\/member-zone\/reports(\/.*)?$/i,
  // add more safe internal pages here if needed
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PATHS.some((re) => re.test(pathname));
  if (!isProtected) {
    return NextResponse.next();
  }

  // Require auth for all protected paths
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Pages allowed without plan (but with auth)
  const allowedNoPlan = ALLOW_NO_PLAN.some((re) => re.test(pathname));
  if (allowedNoPlan) {
    return NextResponse.next();
  }

  // For other protected pages, require active plan
  const plan = (token as any).planTier as string | null | undefined;
  if (!plan || !["core", "daily", "max"].includes(plan)) {
    const url = req.nextUrl.clone();
    url.pathname = "/pricing";
    url.searchParams.set("reason", "no-plan");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Match only app routes, not assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images/|icons/).*)",
  ],
};
TS

echo "✓ updated: src/middleware.ts"

# Clear Next.js cache to avoid stale middleware code
rm -rf "$ROOT/.next" || true

echo
echo "✅ Middleware patched."
echo "Run: npm run dev"
echo "Then open: http://localhost:3000/member-zone/reports"
echo
