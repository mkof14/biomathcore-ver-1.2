"use client";
// src/app/member-zone/checkout-success/page.tsx
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Checkout Success
 * - Light UI, readable on white background.
 * - Does NOT depend on ManageSubscriptionButton or /api/stripe/session.
 * - Optionally reads ?session_id=... (for logs), but works without it.
 * - Offers: Open Billing Portal (POST /api/billing/portal) and Go to Dashboard.
 */
export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [busyPortal, setBusyPortal] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  // Optional auto-redirect after short delay (comment out if not desired)
  useEffect(() => {
    const timer = setTimeout(() => {
      // router.push("/member-zone/dashboard");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  async function openBillingPortal() {
    setBusyPortal(true);
    setPortalError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const json = await res.json();
      if (json?.ok && json?.url) {
        window.location.href = json.url as string;
        return;
      }
      setPortalError(json?.error || "Failed to open billing portal");
    } catch (e: any) {
      setPortalError(e?.message || "Request failed");
    } finally {
      setBusyPortal(false);
    }
  }

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
        Thank you for your purchase!
      </h1>
      <p className="text-gray-700 mt-2">
        Your subscription is now active. You can manage billing, payment
        methods, and invoices in the portal.
      </p>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-900">Next steps</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>
            Open the billing portal to download invoices or update payment
            details.
          </li>
          <li>Go to your dashboard to start using the member features.</li>
        </ul>
        {sessionId && (
          <p className="mt-3 text-xs text-gray-500">
            Session ID: <span className="font-mono">{sessionId}</span>
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={openBillingPortal}
          disabled={busyPortal}
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black/90 disabled:opacity-60"
        >
          {busyPortal ? "Opening…" : "Open Billing Portal"}
        </button>

        <button
          onClick={() => router.push("/member-zone/dashboard")}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
        >
          Go to Dashboard
        </button>
      </div>

      {portalError && (
        <p className="mt-3 text-sm text-red-600">{portalError}</p>
      )}
    </section>
  );
}
