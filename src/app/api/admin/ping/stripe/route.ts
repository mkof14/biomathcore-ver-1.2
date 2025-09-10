import { NextResponse } from "next/server";
export const runtime = "nodejs";
/** POST /api/admin/ping/stripe — лёгкая проверка наличия ключа STRIPE_SECRET_KEY. */
export async function POST() {
  const hasKey = !!process.env.STRIPE_SECRET_KEY;
  return NextResponse.json(
    { ok: hasKey, detail: hasKey ? "STRIPE_SECRET_KEY present" : "missing STRIPE_SECRET_KEY" },
    { status: hasKey ? 200 : 500 }
  );
}
