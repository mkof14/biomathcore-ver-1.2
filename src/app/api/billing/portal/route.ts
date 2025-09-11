import { NextResponse } from "next/server";
import { isDevMock } from "@/lib/dev";

export const runtime = "nodejs";

export async function POST(req: Request) {
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

  if (isDevMock(req)) {
    return NextResponse.json({ ok: true, url: "http://localhost:3000/member-zone/billing/portal/mock" }, { headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json({ ok: false, error: "not_implemented" }, { status: 501 });
}

export {};
