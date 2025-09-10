import { NextResponse } from "next/server";
import { listDG, createDG } from "@/lib/repos/dgRepo";
export const runtime = "nodejs"; const ok=(d:any)=>NextResponse.json({ok:true,data:d});
export async function GET(req: Request){
  const u=new URL(req.url); const drug=u.searchParams.get("drug")||undefined; const gene=u.searchParams.get("gene")||undefined;
  const limit=parseInt(u.searchParams.get("limit")||"50",10); const cursor=u.searchParams.get("cursor")||undefined;
  return ok(await listDG({drug,gene,limit,cursor}));
}
export async function POST(req: Request){
  const b=await req.json().catch(()=> ({})); return ok(await createDG(b));
}
