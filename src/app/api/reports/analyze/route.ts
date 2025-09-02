import { NextResponse } from "next/server";
import { getReport } from "@/lib/repos/reportRepo";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({} as any));
  const id = (body && typeof body.id === "string") ? body.id : undefined;
  if (!id) return NextResponse.json({ ok:false, error:"id_required" }, { status:400 });

  const row = await getReport(id);
  if (!row) return NextResponse.json({ ok:false, error:"not_found" }, { status:404 });

  const summary = `Summary for "${row.title}" (status: ${row.status}). This is a mocked analysis.`;
  const recommendations = [
    "Add more data sources",
    "Validate metrics before publishing",
    "Schedule next review in 7 days"
  ];
  return NextResponse.json({ ok:true, data: { id, summary, recommendations } });
}
