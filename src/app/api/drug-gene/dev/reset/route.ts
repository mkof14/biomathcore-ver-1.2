import { NextResponse } from "next/server";
export const runtime = "nodejs";

export async function POST() {
  // demo: ничего не делаем, просто подтверждаем
  return NextResponse.json({ ok: true });
}
