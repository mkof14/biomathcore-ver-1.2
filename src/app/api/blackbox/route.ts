import { NextResponse } from "next/server";
import { listBlackbox, createBlackbox } from "@/lib/repos/blackboxRepo";
export const runtime = "nodejs";

function ok(data: any){ return NextResponse.json({ ok:true, data }); }
function bad(msg: string, code=400){ return NextResponse.json({ ok:false, error: msg }, { status: code }); }

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
  const limit = parseInt(url.searchParams.get("limit") || "20", 10);
  const cursor = url.searchParams.get("cursor") || undefined;
  const { data, nextCursor } = await listBlackbox({ limit, cursor });
  return ok({ rows: data, nextCursor });
}

export async function POST(req: Request) {
/* params preamble */




/* end preamble */

/* params preamble */




/* end preamble */

  const body = await req.json().catch(() => ({}));
  if (!body || typeof body !== "object") return bad("invalid_body");
  const prompt = String(body.prompt || "");
  if (!prompt.trim()) return bad("empty_prompt");
  const row = await createBlackbox({ prompt, status: "running" });
  return ok(row);
}

export {};
