import { NextResponse } from "next/server";
export const runtime = "nodejs";
const startedAt = process.env.__STARTED_AT || (process.env.__STARTED_AT = new Date().toISOString());
export async function GET() {
  return NextResponse.json({
    ok: true,
    data: {
      name: "biomath-core",
      version: process.env.npm_package_version || "0.0.0",
      commit: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT || null,
      startedAt,
      uptimeSec: Math.floor((Date.now() - Date.parse(startedAt)) / 1000),
      node: process.version
    }
  });
}

export {};
