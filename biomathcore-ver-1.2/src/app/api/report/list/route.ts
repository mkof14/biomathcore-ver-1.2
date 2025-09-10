import { NextResponse } from "next/server";
import { listReports } from "@/lib/report/store";
export const runtime = "nodejs";
export async function GET() {
  const items = await listReports();
  return NextResponse.json(items.map(i => ({ id: i.id, title: i.title, type: i.type, createdAt: i.createdAt })));
}
