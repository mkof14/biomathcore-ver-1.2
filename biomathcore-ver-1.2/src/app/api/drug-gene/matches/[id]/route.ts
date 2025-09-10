import { NextResponse } from "next/server";
import { getDG, updateDG, deleteDG } from "@/lib/repos/dgRepo";
export const runtime="nodejs"; const ok=(d:any)=>NextResponse.json({ok:true,data:d}); const nf=()=>NextResponse.json({ok:false,error:"not_found"},{status:404});
export async function GET(_r:Request,{params}:{params:{id:string}}){ const x=await getDG(params.id); return x?ok(x):nf(); }
export async function PATCH(r:Request,{params}:{params:{id:string}}){ const b=await r.json().catch(()=> ({})); try{ return ok(await updateDG(params.id,b)); }catch{ return nf(); } }
export async function DELETE(_r:Request,{params}:{params:{id:string}}){ try{ const x=await deleteDG(params.id); return ok({id:x.id,deleted:true}); }catch{ return nf(); } }
