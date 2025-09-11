import { NextResponse } from "next/server";
export const runtime = "nodejs";

function extractId(req: Request) {
  const { pathname } = new URL(req.url);
  const parts = pathname.split("/").filter(Boolean); // ["api","ai","runs","<id>"]
  const apiIdx = parts.findIndex((p) => p === "api");
  const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts; // ["ai","runs","<id>"]
  const runsIdx = base.findIndex((p) => p === "runs");
  return runsIdx >= 0 ? base[runsIdx + 1] : undefined;
}

export async function GET(req: Request) {
  const id = extractId(req);
  return NextResponse.json({ ok: true, id });
}
