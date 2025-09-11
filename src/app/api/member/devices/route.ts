import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
type Device = { id: string; type: string; connectedAt: string };
const g = global as unknown as { __DEVICES__?: Device[] };
function bag() { if (!g.__DEVICES__) g.__DEVICES__ = []; return g.__DEVICES__!; }
export const runtime = "nodejs";
export async function GET() { return NextResponse.json({ ok: true, data: bag() }); }
export async function POST(req: Request) {
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

  const b = await req.json().catch(()=>({} as any));
  if (!b?.type) return NextResponse.json({ ok:false, error:"type_required" }, { status:400 });
  const d: Device = { id: randomUUID(), type: String(b.type), connectedAt: new Date().toISOString() };
  bag().unshift(d);
  return NextResponse.json({ ok: true, data: d });
}

export {};
