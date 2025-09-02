// @ts-nocheck
import { NextResponse } from "next/server";
import { getReport, updateReport, deleteReport } from "@/lib/repos/reportRepo";
function ok(d:any){return NextResponse.json({ok:true, data:d});}
function nf(){return NextResponse.json({ok:false, error:"not_found"},{status:404});}
function bad(m:string,c=400){return NextResponse.json({ok:false,error:m},{status:c});}
export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { id: string }}) {
  const r = await getReport(params.id);
  if (!r) return nf();
  return ok(r);
}
export async function PATCH(req: Request, { params }: { params: { id: string }}) {
  const body = await req.json().catch(()=>null);
  if (!body || typeof body !== "object") return bad("invalid_body");
  try { const r = await updateReport(params.id, body); return ok(r); } catch { return nf(); }
}
export async function DELETE(_req: Request, { params }: { params: { id: string }}) {
  try { const r = await deleteReport(params.id); return ok({ id:r.id, deleted:true }); } catch { return nf(); }
}
