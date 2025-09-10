"use client";
// src/components/BuyButton.tsx
import { useState } from "react";

type CheckoutMode = "subscription" | "payment";

export interface BuyButtonProps {
  /** Required Stripe Price ID (recurring for subscriptions, one-time for payments) */
  priceId: string;

  /** Optional: app user id to link checkout -> user in webhook via client_reference_id */
  clientReferenceId?: string;

  /** Optional: Stripe Customer ID if you already have it for the user (improves UX on repeat purchases) */
  customerId?: string;

  /** Optional: override success redirect path (defaults to /member-zone/checkout-success) */
  successPath?: string;

  /** Optional: override cancel redirect path (defaults to /pricing) */
  cancelPath?: string;

  /** Optional: 'subscription' (default) or 'payment' */
  mode?: CheckoutMode;

  /** Optional: extra classes for styling the button */
  className?: string;

  /** Optional: button label override */
  label?: string;
}

/**
 * BuyButton
 * - Calls our API route /api/stripe/checkout (server-side Stripe SDK)
 * - Redirects the browser to Stripe Checkout if a session URL is returned
 */
export default function BuyButton({
  priceId,
  clientReferenceId,
  customerId,
  successPath,
  cancelPath,
  mode = "subscription",
  className = "",
  label,
}: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!priceId) {
      alert("Missing priceId");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Only send optional fields if provided to keep payload clean
        body: JSON.stringify({
          priceId,
          mode,
          ...(clientReferenceId ? { clientReferenceId } : {}),
          ...(customerId ? { customerId } : {}),
          ...(successPath ? { successPath } : {}),
          ...(cancelPath ? { cancelPath } : {}),
        }),
      });

      const data: { sessionUrl?: string; error?: string } = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.sessionUrl) {
        // Stripe Checkout redirect
        window.location.href = data.sessionUrl;
        return;
      }

      throw new Error("No session URL was returned by the server");
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert(`Error: ${err?.message || "Unknown error"}`);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className={[
        // Base styling
        "inline-flex items-center justify-center rounded-md px-4 py-2",
        "bg-green-500 hover:bg-green-600 text-white font-semibold",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400",
        // Disabled state
        isLoading ? "opacity-60 cursor-not-allowed" : "",
        // Custom classes
        className,
      ].join(" ")}
      aria-busy={isLoading}
    >
      {isLoading ? "Processing…" : label || "Buy Now"}
    </button>
  );
}
