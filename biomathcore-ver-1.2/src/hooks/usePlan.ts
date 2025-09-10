"use client";
import { useEffect, useState } from "react";

type PlanResponse = {
  ok: boolean;
  subscription?: {
    tier: string | null;
    status: string | null;
    currentPeriodEnd: string | null;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
  };
};

export function usePlan() {
  const [data, setData] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/subscription/plan", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (mounted) setData(j);
      })
      .catch(() => {
        if (mounted) setData({ ok: false } as any);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading };
}
