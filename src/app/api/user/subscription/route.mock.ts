import { NextResponse } from "next/server";

export async function GET() {
  // ⚡ временный мок
  return NextResponse.json({
    ok: true,
    plan: "PRO",
    renewsAt: "2025-12-31T23:59:59Z",
    features: ["reports", "blackbox", "devices"],
  });
}
