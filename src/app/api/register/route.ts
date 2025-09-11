import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function POST() {
  return NextResponse.json({ ok: false, error: "register_disabled_for_demo" }, { status: 501 });
}
