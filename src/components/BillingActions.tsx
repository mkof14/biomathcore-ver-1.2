"use client";
import { useState } from "react";

export default function BillingActions() {
  const [loading, setLoading] = useState<null | "buy" | "portal">(null);

  async function buy() {
    try {
      setLoading("buy");
      const r = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "subscription",
          quantity: 1,
          success_url: `${location.origin}/member-zone/checkout-success`,
          cancel_url: `${location.origin}/pricing`,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "checkout_failed");
      location.href = j.data.url; // Stripe Checkout
    } finally {
      setLoading(null);
    }
  }

  async function portal() {
    try {
      setLoading("portal");
      const r = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ return_url: `${location.origin}/member-zone/billing` }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "portal_failed");
      location.href = j.data.url; // Stripe Billing Portal
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={buy}
        disabled={loading !== null}
        className="border rounded px-4 py-2"
      >
        {loading === "buy" ? "Redirecting…" : "Buy / Subscribe"}
      </button>
      <button
        onClick={portal}
        disabled={loading !== null}
        className="border rounded px-4 py-2"
      >
        {loading === "portal" ? "Opening…" : "Manage Subscription"}
      </button>
    </div>
  );
}
