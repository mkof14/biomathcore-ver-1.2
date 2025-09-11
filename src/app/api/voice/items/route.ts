import { NextResponse } from "next/server";
import { listVoice, createVoice } from "@/lib/repos/voiceRepo";
export const runtime = "nodejs";
const ok = (data:any) => NextResponse.json({ ok:true, data });

export async function GET(req: Request){
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

  const url = new URL(req.url);
  const q = url.searchParams.get("q") || undefined;
  const biomarker = url.searchParams.get("biomarker") || undefined;
  const limit = parseInt(url.searchParams.get("limit") || "50", 10);
  const cursor = url.searchParams.get("cursor") || undefined;
  return ok(await listVoice({ q, biomarker, limit, cursor }));
}
export async function POST(req: Request){
/* params preamble */




/* end preamble */

/* params preamble */




/* end preamble */

  const body = await req.json().catch(()=> ({}));
  return ok(await createVoice(body));
}

export {};
