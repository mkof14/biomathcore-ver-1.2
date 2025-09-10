import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function GET() {
  const k = process.env.ELEVENLABS_API_KEY || "";
  return NextResponse.json({ hasKey: !!k, len: k.length }, { status: 200 });
}
