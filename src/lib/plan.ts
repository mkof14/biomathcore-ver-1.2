// src/lib/plan.ts
/**
 * Plan tier helpers (client-safe).
 * We use a simple order and a couple of helpers for gating.
 */

export type PlanTier = "core" | "daily" | "max";

export const PLAN_ORDER: Record<PlanTier, number> = {
  core: 0,
  daily: 1,
  max: 2,
};

export function hasAccess(userTier: PlanTier, required: PlanTier) {
  return PLAN_ORDER[userTier] >= PLAN_ORDER[required];
}

/**
 * Category → min plan mapping.
 * Adjust slugs to your actual category slugs in DB/UI.
 */
export const CATEGORY_MIN_PLAN: Record<string, PlanTier> = {
  "everyday-wellness": "core",
  "sleep-recovery": "core",
  "nutrition-diet": "core",

  "mental-wellness": "daily",
  "fitness-performance": "daily",
  "preventive-medicine": "daily",
  "environmental-health": "daily",
  "family-health": "daily",
  "beauty-skincare": "daily",

  "longevity-anti-aging": "max",
  "biohacking-performance": "max",
  "critical-health": "max",
  "senior-care": "max",
  "eye-health-suite": "max",
  "general-sexual-longevity": "max",
  "mens-health": "max",
  "mens-sexual-health": "max",
  "womens-health": "max",
  "womens-sexual-health": "max",
  "digital-therapeutics": "max",
};
