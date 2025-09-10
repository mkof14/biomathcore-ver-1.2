import { NextResponse } from "next/server";
import { getAIRun, updateAIRun, deleteAIRun } from "@/lib/repos/aiRepo";

export const runtime = "nodejs";
const ok = (d:any)=> NextResponse.json({ ok:true, data:d });
const nf = ()=> NextResponse.json({ ok:false, error:"not_found" }, { status:404 });
const bad = (m:string,c=400)=> NextResponse.json({ ok:false, error:m }, { status:c });

export async function GET(_req: Request, { params }: { params: { id: string }}) {
  const row = await getAIRun(params.id);
  if (!row) return nf();
  return ok(row);
}
export async function PATCH(req: Request, { params }: { params: { id: string }}) {
  const body = await req.json().catch(()=> ({}));
  if (!body || typeof body !== "object") return bad("invalid_body");
  try { return ok(await updateAIRun(params.id, body)); } catch { return nf(); }
}
export async function DELETE(_req: Request, { params }: { params: { id: string }}) {
  try { const r = await deleteAIRun(params.id); return ok({ id:r.id, deleted:true }); } catch { return nf(); }
}
