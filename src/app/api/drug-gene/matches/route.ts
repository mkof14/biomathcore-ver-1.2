import { NextResponse } from "next/server";
import { listDG, createDG } from "@/lib/repos/dgRepo";
export const runtime = "nodejs"; const ok=(d:any)=>NextResponse.json({ok:true,data:d});
export async function GET(req: Request){
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

  const u=new URL(req.url); const drug=u.searchParams.get("drug")||undefined; const gene=u.searchParams.get("gene")||undefined;
  const limit=parseInt(u.searchParams.get("limit")||"50",10); const cursor=u.searchParams.get("cursor")||undefined;
  return ok(await listDG({drug,gene,limit,cursor}));
}
export async function POST(req: Request){
/* params preamble */




/* end preamble */

/* params preamble */




/* end preamble */

  const b=await req.json().catch(()=> ({})); return ok(await createDG(b));
}

export {};
