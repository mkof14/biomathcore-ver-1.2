import { NextRequest, NextResponse } from "next/server";
import { requireActive } from "@/lib/guards/subscription";
import { exportReport } from "@/lib/exporters/reportExport";
import { getServerSessionSafe } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { auditLogOptional } from "@/lib/audit/log";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const guard = await requireActive("daily");

  const session = await getServerSessionSafe();
  const email = session?.user?.email || null;
  const user = email ? await prisma.user.findUnique({ where: { email } }) : null;
  const userId = user?.id ?? null;

  const { searchParams } = new URL(req.url);
  const reportId = searchParams.get("reportId") || "";
  const format = (searchParams.get("format") || "json").toLowerCase();

  if (!guard.ok) {
    await auditLogOptional(userId, "report_export_denied", { reportId, format, reason: guard.reason });
    return NextResponse.json({ ok: false, error: guard.reason, tier: guard.tier, status: guard.status }, { status: 403 });
  }

  if (!reportId) {
    return NextResponse.json({ ok: false, error: "MISSING_REPORT_ID" }, { status: 400 });
  }
  if (!["json", "csv"].includes(format)) {
    return NextResponse.json({ ok: false, error: "UNSUPPORTED_FORMAT" }, { status: 400 });
  }

  try {
    const { filename, mime, content } = await exportReport(reportId, format as "json" | "csv");
    await auditLogOptional(userId, "report_export_ok", { reportId, format, filename });
    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    const status = msg === "REPORT_NOT_FOUND" ? 404 : 500;
    await auditLogOptional(userId, "report_export_error", { reportId, format, error: msg });
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
