"use client";
import { useMemo, useState } from "react";
import BuyButton from "@/components/BuyButton";

/**
 * Pricing Page
 * - Reads Stripe Price IDs from NEXT_PUBLIC_* envs
 * - Renders three plans: Core / Daily / Max
 * - Uses BuyButton to start Stripe Checkout
 * - No discounts shown; monthly vs yearly toggle supported
 */

// Read Stripe price IDs from public envs (do not hardcode)
const PRICE_IDS = {
  core: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_CORE_MONTHLY || "",
    yearly: process.env.NEXT_PUBLIC_STRIPE_CORE_YEARLY || "",
  },
  daily: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_DAILY_MONTHLY || "",
    yearly: process.env.NEXT_PUBLIC_STRIPE_DAILY_YEARLY || "",
  },
  max: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_MAX_MONTHLY || "",
    yearly: process.env.NEXT_PUBLIC_STRIPE_MAX_YEARLY || "",
  },
} as const;

type PlanKey = keyof typeof PRICE_IDS;

type Plan = {
  key: PlanKey;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  bulletTitle: string;
  bullets: string[];
  // tint classes: subtle tinted gradient on dark backgrounds (match home categories vibe)
  tint: string;
  // button classes: slightly brighter buttons per your request
  buttonClass: string;
};

/** Plans config (copy stays in sync with Stripe price IDs via env) */
const PLANS: Plan[] = [
  {
    key: "core",
    name: "Core",
    tagline: "Essentials to build a daily habit.",
    monthlyPrice: 19, // your chosen price
    yearlyPrice: 190,
    bulletTitle: "What you get",
    bullets: [
      "Biological Age Report (monthly refresh)",
      "Daily habit prompts & check-ins",
      "Foundational insights in key categories",
      "Basic AI guidance, chat history",
      "Weekly summaries & simple goals",
    ],
    tint: "bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 ring-1 ring-inset ring-white/5",
    buttonClass: "bg-cyan-300 hover:bg-cyan-200 text-black",
  },
  {
    key: "daily",
    name: "Daily",
    tagline: "Guided, everyday momentum—get better faster.",
    monthlyPrice: 39,
    yearlyPrice: 390,
    bulletTitle: "Everything in Core, plus",
    bullets: [
      "Daily routines & nudges by category",
      "Personalized nutrition & sleep tips",
      "Priority AI insights & summaries",
      "More granular habit analytics",
      "Device data import (batch)",
    ],
    // Dark maroon subtle tint + border (as requested)
    tint: "bg-gradient-to-br from-rose-900/30 to-rose-950/10 border border-rose-400/20 ring-1 ring-inset ring-rose-300/10",
    buttonClass: "bg-rose-400 hover:bg-rose-300 text-black",
  },
  {
    key: "max",
    name: "Max",
    tagline: "All-in performance with deep personalization.",
    monthlyPrice: 79,
    yearlyPrice: 790,
    bulletTitle: "Everything in Daily, plus",
    bullets: [
      "Advanced AI: multi-step plans, Q&A, context",
      "Wearable + labs + lifestyle unified view",
      "Pro-level recovery & longevity insights",
      "Early-signal detection & alerts",
      "Priority support & roadmap access",
    ],
    // Deep green subtle tint + border (as requested)
    tint: "bg-gradient-to-br from-emerald-900/30 to-emerald-950/10 border border-emerald-400/20 ring-1 ring-inset ring-emerald-300/10",
    buttonClass: "bg-emerald-400 hover:bg-emerald-300 text-black",
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  // Just for sanity check during setup. Comment out later if you want.
  // console.log('PRICE_IDS:', PRICE_IDS);

  const plans = useMemo(() => PLANS, []);

  return (
    <section className="bg-black text-white py-16 px-6">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-purple-400">
          Plans that fit real life
        </h1>
        <p className="text-gray-400 mt-2 text-sm md:text-base">
          Choose a plan you can use every day. Upgrade any time.
        </p>

        {/* Billing period toggle */}
        <div className="mt-6 flex justify-center items-center gap-4">
          <span className="text-sm text-gray-400">Monthly</span>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isYearly}
              onChange={() => setIsYearly(!isYearly)}
              className="sr-only peer"
            />
            <span className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-purple-600 transition-all" />
            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-full transition-transform" />
          </label>
          <span className="text-sm text-gray-400">Yearly</span>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const displayPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
          const priceLabel = isYearly ? `/yr` : `/mo`;
          const priceId = isYearly
            ? PRICE_IDS[plan.key].yearly
            : PRICE_IDS[plan.key].monthly;

          // Hard guard to avoid sending empty priceId to backend
          const disabled = !priceId;

          return (
            <div
              key={plan.key}
              className={`rounded-2xl p-6 ${plan.tint} hover:shadow-xl transition relative`}
            >
              {/* Subtle top accent line */}
              <span className="absolute inset-x-0 top-0 h-[3px] bg-white/10 rounded-t-2xl" />

              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {plan.name}
                </h3>
                <p className="text-gray-300 text-sm mt-1">{plan.tagline}</p>
              </div>

              <div className="text-4xl font-extrabold">
                ${displayPrice}
                <span className="text-base font-medium text-gray-400 ml-1">
                  {priceLabel}
                </span>
              </div>

              <div className="mt-5">
                <div className="text-sm font-semibold text-white/90 mb-2">
                  {plan.bulletTitle}
                </div>
                <ul className="space-y-2 text-sm text-gray-200/90">
                  {plan.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-white/50" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <BuyButton
                  priceId={priceId}
                  className={`w-full ${plan.buttonClass} font-bold py-2 px-4 rounded transition-colors ${
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
                {disabled && (
                  <p className="mt-2 text-xs text-red-400">
                    Missing Stripe priceId. Set NEXT_PUBLIC envs for this plan.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footnote */}
      <div className="max-w-7xl mx-auto mt-10 text-center text-xs text-gray-500">
        Cancel anytime. Test mode uses Stripe test cards only.
      </div>
    </section>
  );
}
