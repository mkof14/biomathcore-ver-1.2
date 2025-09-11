import { NextResponse } from "next/server";
import { listReports, createReport } from "@/lib/repos/reportRepo";

const ok = (d:any,s=200)=>NextResponse.json({ok:true,data:d},{status:s});
const bad=(m:string,s=400)=>NextResponse.json({ok:false,error:m},{status:s});
export const runtime="nodejs";

export async function GET(req: Request){
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

  const url=new URL(req.url);
  const id=url.searchParams.get("id")||undefined;
  const q=url.searchParams.get("q")||undefined;
  const status=url.searchParams.get("status")||undefined;
  const from=url.searchParams.get("from")||undefined;
  const to=url.searchParams.get("to")||undefined;
  const limit=parseInt(url.searchParams.get("limit")||"20",10);
  const cursor=url.searchParams.get("cursor")||undefined;

  const {data,nextCursor}=await listReports({id,q,status,from,to,limit,cursor});
  return ok({rows:data,nextCursor});
}

export async function POST(req: Request){
/* params preamble */




/* end preamble */

/* params preamble */




/* end preamble */

  const body=await req.json().catch(()=>null);
  if(!body||typeof body!=="object") return bad("invalid_body");
  const row=await createReport(body);
  return ok(row,201);
}

export {};
