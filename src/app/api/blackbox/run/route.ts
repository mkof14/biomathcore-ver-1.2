import { NextResponse } from "next/server";
import { runBlackbox } from "@/lib/repos/blackboxRepo";
export const runtime = "nodejs";

function ok(data:any){ return NextResponse.json({ ok:true, data }); }
function bad(msg:string, code=400){ return NextResponse.json({ ok:false, error:msg }, { status:code }); }

export async function POST(req: Request) {
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

  const body = await req.json().catch(() => ({}));
  const prompt = String(body?.prompt || "");
  if (!prompt.trim()) return bad("empty_prompt");
  const row = await runBlackbox(prompt);
  return ok(row);
}

export {};
