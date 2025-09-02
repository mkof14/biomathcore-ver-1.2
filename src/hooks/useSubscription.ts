// src/hooks/useSubscription.ts
"use client";

import { useEffect, useState } from "react";

type Subscription = {
  id: string;
  stripeSubscriptionId: string;
  stripePriceId: string | null;
  plan: string | null;
  status: string | null;
  currentPeriodEnd: string | null; // serialized from API
  createdAt: string;
  updatedAt: string;
} | null;

type State =
  | { loading: true; error: null; data: null }
  | {
      loading: false;
      error: string | null;
      data: {
        user: { id: string; email: string; name: string | null } | null;
        subscription: Subscription;
      };
    };

export function useSubscription() {
  const [state, setState] = useState<State>({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/user/subscription", { method: "GET" });
        const json = await res.json();
        if (!alive) return;
        if (!res.ok || !json.ok) {
          setState({
            loading: false,
            error: json.error || "REQUEST_FAILED",
            data: { user: null, subscription: null },
          });
          return;
        }
        setState({
          loading: false,
          error: null,
          data: { user: json.user, subscription: json.subscription },
        });
      } catch (e: any) {
        if (!alive) return;
        setState({
          loading: false,
          error: e?.message || "REQUEST_ERROR",
          data: { user: null, subscription: null },
        });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
