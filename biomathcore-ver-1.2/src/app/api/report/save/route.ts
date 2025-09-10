import { NextResponse } from "next/server";
import { ReportJson } from "@/lib/report/schema";
import { saveReport, StoredReport } from "@/lib/report/store";

export const runtime = "nodejs";

function makeId() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(()=> ({}));
    const payload = body?.payload as ReportJson;
    const title = String(body?.title || payload?.topic || "Report").trim();
    const userEmail = String(body?.userEmail || "unknown@local");
    const type = "core";

    if (!payload || !payload.topic || !payload.sections) return new NextResponse("Bad payload", { status: 400 });

    const item: StoredReport = {
      id: makeId(),
      title,
      type,
      createdAt: new Date().toISOString(),
      userEmail,
      payload
    };
    await saveReport(item);
    return NextResponse.json(item, { status: 200 });
  } catch (e:any) {
    return new NextResponse(`Server error: ${e?.message || "unknown"}`, { status: 500 });
  }
}
