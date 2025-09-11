import { NextResponse } from "next/server";
export const runtime = "nodejs";

const ok  = (d:any)=> NextResponse.json({ ok:true,  data:d });
const bad = (m:string,c=400)=> NextResponse.json({ ok:false, error:m }, { status:c });

function extractId(req: Request) {
  const { pathname } = new URL(req.url);
  const parts = pathname.split("/").filter(Boolean); // ["api","voice","<id>"]
  const apiIdx = parts.indexOf("api");
  const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
  const i = base.indexOf("voice");
  return i >= 0 ? base[i + 1] : undefined;
}

export async function GET(req: Request) {
  const id = extractId(req); if(!id) return bad("missing_id");
  return ok({ id, kind: "voice", status: "demo" });
}
export async function PATCH(req: Request) {
  const id = extractId(req); if(!id) return bad("missing_id");
  const body = await req.json().catch(()=> ({}));
  return ok({ id, updated: body });
}
export async function DELETE(req: Request) {
  const id = extractId(req); if(!id) return bad("missing_id");
  return ok({ id, deleted: true });
}
