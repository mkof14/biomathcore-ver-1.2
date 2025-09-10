import { NextResponse } from "next/server";
import { listVoice, createVoice } from "@/lib/repos/voiceRepo";

export const runtime = "nodejs";

function ok(data: any){ return NextResponse.json({ ok:true, data }); }
function bad(msg: string, code=400){ return NextResponse.json({ ok:false, error:msg }, { status: code }); }

export async function GET(req: Request){
  const url = new URL(req.url);
  const id = url.searchParams.get("id") || undefined;
  const q = url.searchParams.get("q") || undefined;
  const status = url.searchParams.get("status") || undefined;
  const from = url.searchParams.get("from") || undefined;
  const to = url.searchParams.get("to") || undefined;
  const limit = parseInt(url.searchParams.get("limit") || "20", 10);
  const cursor = url.searchParams.get("cursor") || undefined;
  const { data, nextCursor } = await listVoice({ id, q, status, from, to, limit, cursor });
  return ok({ rows: data, nextCursor });
}

export async function POST(req: Request){
  const body = await req.json().catch(()=> ({}));
  if (!body || typeof body !== "object") return bad("invalid_body");
  const row = await createVoice(body);
  return ok(row);
}
