import { NextResponse } from "next/server";

export async function GET() {
  // Replace with real health checks if needed
  const checks = [
    { name: "database", status: "ok", latencyMs: 38 },
    { name: "storage", status: "ok", latencyMs: 64 },
    { name: "stripe", status: "ok", latencyMs: 201 },
    { name: "ai_services", status: "ok", latencyMs: 412 },
  ];
  return NextResponse.json({ checks });
}

export {};
