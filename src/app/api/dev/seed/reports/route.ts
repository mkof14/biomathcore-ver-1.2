import { NextResponse } from "next/server";
import { seedReports } from "@/lib/repos/reportRepo";
export const runtime="nodejs";
export async function POST(req: Request){
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

  const body=await req.json().catch(()=>({}));
  const n=Math.max(1, Math.min(1000, Number(body.n ?? 10)));
  await seedReports(n);
  return NextResponse.json({ ok:true, data:{ seeded:n }});
}

export {};
