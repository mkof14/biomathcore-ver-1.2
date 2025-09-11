import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    hint: "This is Admin API root. Use specific endpoints.",
    endpoints: [
      "/api/admin/secrets",
      "/api/admin/secrets/[key]",
      "/api/admin/secrets/export?filename=.env.local",
      "/api/admin/health/env",
      "/api/admin/backup/secrets",
      "/api/admin/logs",
      "/api/admin/ping/stripe",
      "/api/admin/ping/gemini",
    ],
  });
}

export {};
