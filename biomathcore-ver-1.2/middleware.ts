import { NextResponse } from "next/server";
import { Ratelimit } from "next/dist/server/web/spec-extension/rate-limit"; // fallback type
import { nanoid } from "nanoid";

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
const maxReq = Number(process.env.RATE_LIMIT_MAX || 120);

const buckets = new Map<string,{ reset:number; count:number }>();

function rlOk(ip:string) {
  const now = Date.now();
  const b = buckets.get(ip) || { reset: now + windowMs, count: 0 };
  if (now > b.reset) { b.reset = now + windowMs; b.count = 0; }
  b.count++;
  buckets.set(ip, b);
  return b.count <= maxReq;
}

export function middleware(req: Request) {
  const url = new URL(req.url);
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    (req as any).ip ||
    "0.0.0.0";

  // Security headers
  const res = NextResponse.next();
  res.headers.set("X-Frame-Options","DENY");
  res.headers.set("X-Content-Type-Options","nosniff");
  res.headers.set("Referrer-Policy","no-referrer-when-downgrade");
  res.headers.set("Permissions-Policy","geolocation=(), microphone=(), camera=()");

  // Rate limit (skip static/_next)
  if (!url.pathname.startsWith("/_next") && !url.pathname.startsWith("/public")) {
    if (!rlOk(ip)) {
      return new NextResponse(JSON.stringify({ ok:false, error:"rate_limited" }), {
        status: 429,
        headers: { "Content-Type":"application/json" }
      });
    }
  }

  // DEV gate: блокируем демо-страницы если DEV_FEATURES!=1
  if (!process.env.DEV_FEATURES && url.pathname.startsWith("/dev/")) {
    return NextResponse.redirect(new URL("/", url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.txt).*)"]
};
