import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const body = await req.json().catch(()=> ({}));
  return NextResponse.json({ ok: true, reportId: "demo-report", input: body });
}
