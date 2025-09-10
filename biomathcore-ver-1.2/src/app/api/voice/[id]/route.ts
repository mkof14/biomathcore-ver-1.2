import { NextResponse } from "next/server";
import { getVoice, updateVoice, deleteVoice } from "@/lib/repos/voiceRepo";
export const runtime = "nodejs";
function ok(data:any){ return NextResponse.json({ok:true, data}); }
function nf(){ return NextResponse.json({ok:false, error:"not_found"},{status:404}); }
function bad(msg:string, code=400){ return NextResponse.json({ok:false, error:msg},{status:code}); }
export async function GET(_req: Request, { params }: { params: { id: string }}) {
  const row = await getVoice(params.id); if(!row) return nf(); return ok(row);
}
export async function PATCH(req: Request, { params }: { params: { id: string }}) {
  const body = await req.json().catch(()=> ({})); if(!body || typeof body !== "object") return bad("invalid_body");
  try { const row = await updateVoice(params.id, body); return ok(row); } catch { return nf(); }
}
export async function DELETE(_req: Request, { params }: { params: { id: string }}) {
  try { const row = await deleteVoice(params.id); return ok({ id: row.id, deleted: true }); } catch { return nf(); }
}
