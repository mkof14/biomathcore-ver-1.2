import { NextResponse } from "next/server";
import { resetReports } from "@/lib/repos/reportRepo";
export const runtime="nodejs";
export async function POST(){
  await resetReports();
  return NextResponse.json({ ok:true, data:{ cleared:true }});
}

export {};
