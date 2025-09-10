import { NextResponse } from "next/server";
import { getAIRun, updateAIRun, deleteAIRun } from "@/lib/repos/aiRepo";
export const runtime = "nodejs";
const ok = (data:any) => NextResponse.json({ ok:true, data });
const nf = () => NextResponse.json({ ok:false, error:"not_found" }, { status:404 });

export async function GET(_req: Request, { params }: { params: { id: string }}) {
  const row = await getAIRun(params.id);
  return row ? ok(row) : nf();
}
export async function PATCH(req: Request, { params }: { params: { id: string }}) {
  const body = await req.json().catch(()=> ({}));
  try { return ok(await updateAIRun(params.id, body)); } catch { return nf(); }
}
export async function DELETE(_req: Request, { params }: { params: { id: string }}) {
  try { const row = await deleteAIRun(params.id); return ok({ id: row.id, deleted:true }); } catch { return nf(); }
}
