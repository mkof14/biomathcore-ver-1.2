import { NextResponse } from "next/server";
import { getServerSessionSafe } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSessionSafe();
  const email = session?.user?.email || null;
  if (!email) return NextResponse.json({ ok: false, error: "UNAUTHENTICATED" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ ok: false, error: "USER_NOT_FOUND" }, { status: 404 });

  const reports = await prisma.report.findMany({
    where: { userId: user.id },
    select: { id: true, title: true, createdAt: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ ok: true, items: reports });
}
