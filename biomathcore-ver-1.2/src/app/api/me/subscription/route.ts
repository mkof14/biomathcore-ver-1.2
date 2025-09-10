// src/app/api/me/subscription/route.ts
import { NextResponse } from "next/server";

/**
 * Temporary stub:
 * In production, read user session → find user in DB → return real planTier.
 * For testing, you can override via header: x-mock-plan: core|daily|max
 */
export async function GET(request: Request) {
  const headers = Object.fromEntries(new Headers(request.headers).entries());
  const mock = (headers["x-mock-plan"] as "core" | "daily" | "max") || "daily";

  return NextResponse.json({
    userId: "mock-user",
    planTier: mock,
  });
}
