#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
mkdir -p \
  "$ROOT/src/app/api/user/subscription" \
  "$ROOT/src/lib" \
  "$ROOT/src/hooks" \
  "$ROOT/src/components/account"

# 1) API: current subscription
cat > "$ROOT/src/app/api/user/subscription/route.ts" <<'TS'
// src/app/api/user/subscription/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authHelper } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";
const prisma = new PrismaClient();

/**
 * Returns the current user's subscription snapshot from DB (if any).
 * Does not change or create anything.
 */
export async function GET() {
  try {
    const session = await authHelper();
    if (!session?.user?.email) {
      return NextResponse.json({ ok: false, error: "UNAUTHENTICATED" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        subscriptions: {
          orderBy: { updatedAt: "desc" },
          take: 1,
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
        },
      },
    });

    if (!user) {
      return NextResponse.json({ ok: true, user: null, subscription: null });
    }

    const latest = user.subscriptions[0] ?? null;
    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name ?? null },
      subscription: latest,
    });
  } catch (err: any) {
    const msg = err?.message || String(err);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", detail: process.env.NODE_ENV !== "production" ? msg : undefined },
      { status: 500 }
    );
  }
}
TS
echo "✓ wrote: src/app/api/user/subscription/route.ts"

# 2) Server helper
cat > "$ROOT/src/lib/subscription.ts" <<'TS'
// src/lib/subscription.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export type SubscriptionSnapshot = {
  id: string;
  stripeSubscriptionId: string;
  stripePriceId: string | null;
  plan: string | null;
  status: string | null;
  currentPeriodEnd: Date | null;
  createdAt: Date;
  updatedAt: Date;
} | null;

export async function getLatestSubscriptionByEmail(email: string): Promise<SubscriptionSnapshot> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      subscriptions: {
        orderBy: { updatedAt: "desc" },
        take: 1,
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
      },
    },
  });
  return user?.subscriptions?.[0] ?? null;
}
TS
echo "✓ wrote: src/lib/subscription.ts"

# 3) Client hook
cat > "$ROOT/src/hooks/useSubscription.ts" <<'TS'
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
  | { loading: false; error: string | null; data: { user: { id: string; email: string; name: string | null } | null; subscription: Subscription } };

export function useSubscription() {
  const [state, setState] = useState<State>({ loading: true, error: null, data: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/user/subscription", { method: "GET" });
        const json = await res.json();
        if (!alive) return;
        if (!res.ok || !json.ok) {
          setState({ loading: false, error: json.error || "REQUEST_FAILED", data: { user: null, subscription: null } });
          return;
        }
        setState({ loading: false, error: null, data: { user: json.user, subscription: json.subscription } });
      } catch (e: any) {
        if (!alive) return;
        setState({ loading: false, error: e?.message || "REQUEST_ERROR", data: { user: null, subscription: null } });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
TS
echo "✓ wrote: src/hooks/useSubscription.ts"

# 4) Optional UI component (not mounted yet)
cat > "$ROOT/src/components/account/SubscriptionCard.tsx" <<'TSX'
// src/components/account/SubscriptionCard.tsx
"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { useState } from "react";

export default function SubscriptionCard() {
  const { loading, error, data } = useSubscription();
  const [busy, setBusy] = useState(false);
  const sub = data?.subscription || null;

  async function openPortal() {
    try {
      setBusy(true);
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const json = await res.json();
      if (json?.ok && json?.url) {
        window.location.href = json.url as string;
        return;
      }
      alert("Failed to open billing portal");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
      <h3 style={{ margin: 0, marginBottom: 8 }}>Subscription</h3>
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "#b91c1c" }}>Error: {error}</p>}
      {!loading && !error && (
        <>
          {sub ? (
            <ul style={{ marginTop: 8, marginBottom: 12 }}>
              <li><strong>Status:</strong> {sub.status ?? "unknown"}</li>
              <li><strong>Plan:</strong> {sub.plan ?? sub.stripePriceId ?? "unknown"}</li>
              <li><strong>Renews at:</strong> {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleString() : "n/a"}</li>
            </ul>
          ) : (
            <p>No active subscription.</p>
          )}
          <button onClick={openPortal} disabled={busy} style={{ padding: "8px 12px", borderRadius: 8 }}>
            {busy ? "Opening…" : "Manage Subscription"}
          </button>
        </>
      )}
    </div>
  );
}
TSX
echo "✓ wrote: src/components/account/SubscriptionCard.tsx"

echo "✅ All files written."
