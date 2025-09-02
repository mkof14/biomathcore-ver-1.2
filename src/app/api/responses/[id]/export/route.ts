import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "json";

  const s = await prisma.responseSession.findUnique({
    where: { id },
    include: { answers: true },
  });
  if (!s) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  if (format === "csv") {
    const rows = (s.answers ?? []).map(a => {
      const payload = JSON.stringify(a.payloadJson ?? null).replaceAll('"', '""');
      return `${a.questionId},"${payload}",${a.isSensitive ? 1 : 0},${a.updatedAt ? a.updatedAt.toISOString() : ""}`;
    });
    const header = "questionId,payloadJson,isSensitive,updatedAt";
    const csv = [header, ...rows].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="response-${id}.csv"`,
      },
    });
  }

  return NextResponse.json({
    ok: true,
    session: {
      id: s.id,
      questionnaireId: s.questionnaireId,
      status: s.status,
      visibility: s.visibility,
      progress: s.progress,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      anonymizedAt: s.anonymizedAt ? s.anonymizedAt.toISOString() : null,
      answers: (s.answers ?? []).map(a => ({
        questionId: a.questionId,
        isSensitive: a.isSensitive,
        payloadJson: a.payloadJson,
        updatedAt: a.updatedAt ? a.updatedAt.toISOString() : null,
      })),
    }
  });
}
