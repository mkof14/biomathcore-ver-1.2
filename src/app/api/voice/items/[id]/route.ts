import { NextResponse } from "next/server";
import { getVoice, updateVoice, deleteVoice } from "@/lib/repos/voiceRepo";
export const runtime = "nodejs"; const ok=(d:any)=>NextResponse.json({ok:true,data:d}); const nf=()=>NextResponse.json({ok:false,error:"not_found"},{status:404});
export async function GET(_r:Request,{params}:{params:{id:string}}){ const x=await getVoice(id); return x?ok(x):nf(); }
export async function PATCH(r:Request,{params}:{params:{id:string}}){ const b=await r.json().catch(()=> ({})); try{ return ok(await updateVoice(id,b)); }catch{ return nf(); } }
export async function DELETE(_r:Request,{params}:{params:{id:string}}){ try{ const x=await deleteVoice(id); return ok({id:x.id,deleted:true}); }catch{ return nf(); } }

export {};
