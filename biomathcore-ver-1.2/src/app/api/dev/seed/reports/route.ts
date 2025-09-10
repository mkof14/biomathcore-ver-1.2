// @ts-nocheck
import { NextResponse } from "next/server";
import { seedReports } from "@/lib/repos/reportRepo";
export const runtime="nodejs";
export async function POST(req: Request){
  const body=await req.json().catch(()=>({}));
  const n=Math.max(1, Math.min(1000, Number(body.n ?? 10)));
  await seedReports(n);
  return NextResponse.json({ ok:true, data:{ seeded:n }});
}
