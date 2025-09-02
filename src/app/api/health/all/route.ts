import { NextResponse } from "next/server";

async function ping(url: string) {
  try {
    const r = await fetch(url, { cache: "no-store" });
    const body = await r.text().catch(() => "");
    return { ok: r.ok, status: r.status, body: body.slice(0, 300) };
  } catch (e: any) {
    return { ok: false, status: 0, body: String(e?.message || e) };
  }
}

export async function GET(req: Request) {
  const o = new URL(req.url).origin;
  const urls = [
    "/api/health/version",
    "/api/analytics/summary",
    "/api/analytics/by-day?days=7",
    "/api/dashboard/summary",
    "/api/reports?limit=1",
    "/api/ai?limit=1",
    "/api/voice?limit=1",
    "/api/drug-gene?limit=1",
    "/api/health/stripe",
  ];
  const results = await Promise.all(urls.map(p => ping(o + p)));
  const data = Object.fromEntries(urls.map((p, i) => [p, results[i]]));
  return NextResponse.json({ ok: true, data });
}
