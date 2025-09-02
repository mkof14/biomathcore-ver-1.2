"use client";
// src/components/account/SubscriptionCard.tsx
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
              <li>
                <strong>Status:</strong> {sub.status ?? "unknown"}
              </li>
              <li>
                <strong>Plan:</strong>{" "}
                {sub.plan ?? sub.stripePriceId ?? "unknown"}
              </li>
              <li>
                <strong>Renews at:</strong>{" "}
                {sub.currentPeriodEnd
                  ? new Date(sub.currentPeriodEnd).toLocaleString()
                  : "n/a"}
              </li>
            </ul>
          ) : (
            <p>No active subscription.</p>
          )}
          <button
            onClick={openPortal}
            disabled={busy}
            style={{ padding: "8px 12px", borderRadius: 8 }}
          >
            {busy ? "Opening…" : "Manage Subscription"}
          </button>
        </>
      )}
    </div>
  );
}
