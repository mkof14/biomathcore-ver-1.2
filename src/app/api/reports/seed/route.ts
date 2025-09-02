import { NextResponse } from "next/server";
import { getServerSessionSafe } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST() {
  const session = await getServerSessionSafe();
  const email = session?.user?.email || null;
  if (!email) return NextResponse.json({ ok: false, error: "UNAUTHENTICATED" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ ok: false, error: "USER_NOT_FOUND" }, { status: 404 });

  const sample = {
    title: "Wellness Summary",
    body: JSON.stringify([
      { metric: "BiologicalAge", value: 34, unit: "years" },
      { metric: "VO2Max", value: 42.5, unit: "ml/kg/min" },
      { metric: "SleepScore", value: 82, unit: "points" }
    ]),
    format: "json",
    status: "final",
  };

  const r = await prisma.report.create({
    data: { ...sample, userId: user.id },
    select: { id: true, title: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, report: r });
}
