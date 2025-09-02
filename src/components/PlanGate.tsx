"use client";
// src/components/PlanGate.tsx
import { useEffect, useState } from "react";
import { PlanTier, hasAccess, PLAN_ORDER } from "@/lib/plan";

interface PlanGateProps {
  required: PlanTier;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Client-side gate that fetches the current user's plan.
 * - If access → render children
 * - Else → render fallback (locked UI / upsell)
 */
export default function PlanGate({
  required,
  children,
  fallback,
}: PlanGateProps) {
  const [tier, setTier] = useState<PlanTier | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/me/subscription", { cache: "no-store" });
        const data = await res.json();
        if (!ignore) setTier(data.planTier as PlanTier);
      } catch {
        if (!ignore) setTier("core"); // conservative default
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  if (!tier) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-white/70">
        Loading access…
      </div>
    );
  }

  if (hasAccess(tier, required)) {
    return <>{children}</>;
  }

  return (
    <>
      {fallback ?? (
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-center">
          <div className="text-amber-200 font-semibold">Locked</div>
          <div className="text-amber-200/80 text-sm mt-1">
            This requires <b className="text-white">{required.toUpperCase()}</b>{" "}
            plan.
          </div>
        </div>
      )}
    </>
  );
}

/** Optional helper — compare tiers as text if needed elsewhere */
export function compareTiers(a: PlanTier, b: PlanTier) {
  return PLAN_ORDER[a] - PLAN_ORDER[b];
}
