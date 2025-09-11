import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, service: "biomath-core", ts: new Date().toISOString() });
}

export {};
