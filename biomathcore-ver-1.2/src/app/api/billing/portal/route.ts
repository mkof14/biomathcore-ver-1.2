import { NextResponse } from "next/server";
import { isDevMock } from "@/lib/dev";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (isDevMock(req)) {
    return NextResponse.json({ ok: true, url: "http://localhost:3000/member-zone/billing/portal/mock" }, { headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json({ ok: false, error: "not_implemented" }, { status: 501 });
}
