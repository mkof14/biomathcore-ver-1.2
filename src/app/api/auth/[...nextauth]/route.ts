import { NextResponse } from "next/server";
export const runtime = "nodejs";

// Stubbed auth route for build/demo
export async function GET() {
  return NextResponse.json({ ok: false, error: "auth_disabled_for_demo" }, { status: 501 });
}
export async function POST() {
  return NextResponse.json({ ok: false, error: "auth_disabled_for_demo" }, { status: 501 });
}
