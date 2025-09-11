import { NextResponse } from "next/server";
import { listDevices, connectDevice } from "@/lib/repos/deviceRepo";
export const runtime = "nodejs";

function ok(data:any){ return NextResponse.json({ ok:true, data }); }
function bad(msg:string, code=400){ return NextResponse.json({ ok:false, error: msg }, { status: code }); }

export async function GET(req: Request) {
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "50", 10);
  const cursor = url.searchParams.get("cursor") || undefined;
  const { data, nextCursor } = await listDevices({ limit, cursor });
  return ok({ rows: data, nextCursor });
}

export async function POST(req: Request) {
/* params preamble */




/* end preamble */

/* params preamble */




/* end preamble */

  const body = await req.json().catch(() => ({}));
  const provider = String(body?.provider || "");
  if (!provider) return bad("provider_required");
  const row = await connectDevice(provider as any, body?.label);
  return ok(row);
}

export {};
