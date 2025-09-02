"use client";
// src/app/member-zone/subscriptions/page.tsx
import React, { useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import SubscriptionCard from "@/components/account/SubscriptionCard";

export default function SubscriptionsPage() {
  const { data, loading, error, refetch } = useSubscription();
  const [busy, setBusy] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  async function openBillingPortal() {
    setBusy(true);
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
      setBusy(false);
    }
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
          Subscriptions
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your plan, invoices and payment methods.
        </p>
      </div>

      {/* Summary card (uses existing component) */}
      <div className="mb-6">
        <SubscriptionCard />
        {loading && (
          <p className="text-sm text-gray-600 mt-2">Loading subscription…</p>
        )}
        {error && (
          <p className="text-sm text-red-600 mt-2">
            Failed to load subscription: {String(error)}
          </p>
        )}
        {!loading && !error && data && (
          <div className="mt-3 text-sm text-gray-700 space-y-1">
            {data.plan && (
              <div>
                <span className="text-gray-500">Plan:&nbsp;</span>
                <span className="font-medium">{data.plan}</span>
              </div>
            )}
            {data.status && (
              <div>
                <span className="text-gray-500">Status:&nbsp;</span>
                <span className="font-medium">{data.status}</span>
              </div>
            )}
            {data.currentPeriodEnd && (
              <div>
                <span className="text-gray-500">Renews on:&nbsp;</span>
                <span className="font-medium">
                  {new Date(data.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={openBillingPortal}
          disabled={busy}
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black/90 disabled:opacity-60"
        >
          {busy ? "Opening…" : "Open Stripe Billing Portal"}
        </button>

        <button
          onClick={() => refetch()}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
        >
          Refresh status
        </button>
      </div>

      {portalError && (
        <p className="text-sm text-red-600 mt-4">{portalError}</p>
      )}

      {/* Help / Hints */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-900">How it works</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>
            Use the <strong>Stripe Billing Portal</strong> to update your card,
            download invoices or change/cancel your plan.
          </li>
          <li>
            The current plan and renewal date are synced from Stripe via
            webhooks.
          </li>
          <li>
            Click <strong>Refresh status</strong> after you make changes in the
            portal to fetch the latest data.
          </li>
        </ul>
      </div>
    </section>
  );
}
