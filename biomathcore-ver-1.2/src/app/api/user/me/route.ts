// src/app/api/user/me/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSessionSafe } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getServerSessionSafe();
    if (!session?.user?.email) {
      return NextResponse.json(
        { ok: false, error: "UNAUTHENTICATED" },
        { status: 401 },
      );
    }

    const email = session.user.email.toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        // planTier removed
        // keep stripeCustomerId ONLY if it exists in your schema
        // @ts-ignore
        stripeCustomerId: true,
        createdAt: true,
      } as any,
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "USER_NOT_FOUND" },
        { status: 404 },
      );
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        stripeSubscriptionId: true,
        stripePriceId: true,
        plan: true,
        status: true,
        currentPeriodEnd: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ ok: true, user, subscription });
  } catch (err) {
    console.error("GET /api/user/me error:", err);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
