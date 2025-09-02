import prisma from "@/lib/prisma";
import { getServerSessionSafe } from "@/lib/auth";
import Stripe from "stripe";
import { resolveTierFromSubscription } from "@/lib/stripe/priceMap";

export type GuardResult = {
  ok: boolean;
  reason?: string;
  tier?: "core" | "daily" | "max" | string | null;
  status?: string | null;
};

async function readLatestLocal(userId: string) {
  const sub = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return sub;
}

async function refreshFromStripe(subId: string) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  const stripe = new Stripe(key, { apiVersion: "2024-06-20" });
  const s = await stripe.subscriptions.retrieve(subId);
  return s;
}

export async function requireActive(minTier: "core" | "daily" | "max" = "core"): Promise<GuardResult> {
  const session = await getServerSessionSafe();
  if (!session?.user?.email) return { ok: false, reason: "UNAUTHENTICATED" };

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { ok: false, reason: "USER_NOT_FOUND" };

  const local = await readLatestLocal(user.id);
  if (!local) return { ok: false, reason: "NO_SUBSCRIPTION" };

  let tier = local.plan as any as "core" | "daily" | "max" | null;
  let status = local.status ?? null;

  try {
    if (local.stripeSubscriptionId && process.env.STRIPE_SECRET_KEY) {
      const s = await refreshFromStripe(local.stripeSubscriptionId);
      if (s) {
        tier = resolveTierFromSubscription(s) ?? tier;
        status = s.status ?? status;
        await prisma.subscription.update({
          where: { stripeSubscriptionId: local.stripeSubscriptionId },
          data: {
            stripePriceId: s.items.data[0]?.price?.id || null,
            plan: tier ?? null,
            status,
            currentPeriodEnd: s.current_period_end ? new Date(s.current_period_end * 1000) : null,
          },
        });
      }
    }
  } catch {
    // soft fail: keep local snapshot
  }

  const order = ["core", "daily", "max"];
  const needIdx = order.indexOf(minTier);
  const haveIdx = tier ? order.indexOf(String(tier) as any) : -1;
  const active = status === "active" || status === "trialing";

  if (!active) return { ok: false, reason: "INACTIVE", tier, status };
  if (haveIdx < needIdx) return { ok: false, reason: "INSUFFICIENT_TIER", tier, status };

  return { ok: true, tier, status };
}
