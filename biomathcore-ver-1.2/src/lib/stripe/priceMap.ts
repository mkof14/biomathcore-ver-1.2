// src/lib/stripe/priceMap.ts



export type PlanTier = "core" | "daily" | "max";

const priceMap: Record<string, PlanTier> = {
  // CORE plan
  [process.env.NEXT_PUBLIC_STRIPE_CORE_MONTHLY!]: "core",
  [process.env.NEXT_PUBLIC_STRIPE_CORE_YEARLY!]: "core",

  // DAILY plan
  [process.env.NEXT_PUBLIC_STRIPE_DAILY_MONTHLY!]: "daily",
  [process.env.NEXT_PUBLIC_STRIPE_DAILY_YEARLY!]: "daily",

  // MAX plan
  [process.env.NEXT_PUBLIC_STRIPE_MAX_MONTHLY!]: "max",
  [process.env.NEXT_PUBLIC_STRIPE_MAX_YEARLY!]: "max",
};

/**
 * Resolve plan tier from Stripe Subscription object
 */
import Stripe from "stripe";

export function resolveTierFromSubscription(
  subscription: Stripe.Subscription,
): PlanTier | null {
  const priceId = subscription.items.data[0]?.price?.id;
  if (!priceId) return null;
  return priceMap[priceId] ?? null;
}
