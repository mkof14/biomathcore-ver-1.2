import { NextResponse } from "next/server";
import { requireActive } from "@/lib/guards/subscription";
import { getServerSessionSafe } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { auditLogOptional } from "@/lib/audit/log";

export async function GET() {
  const guard = await requireActive("daily");

  const session = await getServerSessionSafe();
  const email = session?.user?.email || null;
  const user = email ? await prisma.user.findUnique({ where: { email } }) : null;
  const userId = user?.id ?? null;

  if (!guard.ok) {
    await auditLogOptional(userId, "premium_ping_denied", { reason: guard.reason, tier: guard.tier, status: guard.status });
    return NextResponse.json({ ok: false, error: guard.reason, tier: guard.tier, status: guard.status }, { status: 403 });
  }

  await auditLogOptional(userId, "premium_ping_ok", { tier: guard.tier, status: guard.status });
  return NextResponse.json({ ok: true, tier: guard.tier, status: guard.status });
}

export {};
