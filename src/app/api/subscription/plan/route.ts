import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSessionSafe } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { resolveTierFromSubscription } from "@/lib/stripe/priceMap";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSessionSafe();
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ ok: false, error: "USER_NOT_FOUND" }, { status: 404 });
  }

  const sub = await prisma.subscription.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  let tier: string | null = null;
  let status: string | null = sub?.status ?? null;
  let currentPeriodEnd: Date | null = sub?.currentPeriodEnd ?? null;

  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (secret && sub?.stripeSubscriptionId) {
      const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
      const s = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
      tier = resolveTierFromSubscription(s) ?? sub?.plan ?? null;
      status = s.status ?? status;
      currentPeriodEnd = s.current_period_end ? new Date(s.current_period_end * 1000) : currentPeriodEnd;

      await prisma.subscription.update({
        where: { stripeSubscriptionId: sub.stripeSubscriptionId },
        data: {
          stripePriceId: s.items.data[0]?.price?.id || null,
          plan: tier,
          status,
          currentPeriodEnd,
        },
      });
    } else {
      tier = sub?.plan ?? null;
    }
  } catch {
    tier = sub?.plan ?? null;
  }

  return NextResponse.json({
    ok: true,
    subscription: {
      tier,
      status,
      currentPeriodEnd: currentPeriodEnd ? currentPeriodEnd.toISOString() : null,
      stripeCustomerId: user.stripeCustomerId ?? null,
      stripeSubscriptionId: sub?.stripeSubscriptionId ?? null,
    },
  });
}
