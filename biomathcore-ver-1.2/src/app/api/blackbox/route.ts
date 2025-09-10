import { NextResponse } from "next/server";
import { listBlackbox, createBlackbox } from "@/lib/repos/blackboxRepo";
export const runtime = "nodejs";

function ok(data: any){ return NextResponse.json({ ok:true, data }); }
function bad(msg: string, code=400){ return NextResponse.json({ ok:false, error: msg }, { status: code }); }

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "20", 10);
  const cursor = url.searchParams.get("cursor") || undefined;
  const { data, nextCursor } = await listBlackbox({ limit, cursor });
  return ok({ rows: data, nextCursor });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (!body || typeof body !== "object") return bad("invalid_body");
  const prompt = String(body.prompt || "");
  if (!prompt.trim()) return bad("empty_prompt");
  const row = await createBlackbox({ prompt, status: "running" });
  return ok(row);
}
