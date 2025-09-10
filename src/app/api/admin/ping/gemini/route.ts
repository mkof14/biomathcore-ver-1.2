import { NextResponse } from "next/server";
export const runtime = "nodejs";
/** POST /api/admin/ping/gemini — лёгкая проверка наличия ключа GEMINI_API_KEY. */
export async function POST() {
  const hasKey = !!process.env.GEMINI_API_KEY;
  return NextResponse.json(
    { ok: hasKey, detail: hasKey ? "GEMINI_API_KEY present" : "missing GEMINI_API_KEY" },
    { status: hasKey ? 200 : 500 }
  );
}
