'use client';

import React from "react";
import SectionHeader from "@/components/SectionHeader";
import { Card, CardHeader, CardTitle, CardBody, Btn } from "@/components/ui/CardToned";

export default function BillingPage() {
  async function openPortal() {
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ return_url: window.location.origin + "/member-zone/billing" }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.error || "Portal error");
      window.location.href = data.url;
    } catch (e) {
      console.error(e);
      alert("Unable to open Stripe Customer Portal. Please try again.");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Billing" desc="Manage your subscription and invoices." />

      <Card tone="violet">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="text-sm text-neutral-300 mb-3">
            Open the Stripe Customer Portal to update payment method, view invoices, change plan, or cancel.
          </div>
          <div className="flex gap-2">
            <Btn variant="primary" onClick={openPortal}>Open Customer Portal</Btn>
            <Btn href="/pricing">Plans</Btn>
          </div>
        </CardBody>
      </Card>

      <Card tone="slate">
        <CardHeader>
          <CardTitle>Export</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="text-sm text-neutral-300 mb-3">
            Need records for accounting? Download your recent invoices in Stripe.
          </div>
          <Btn onClick={openPortal}>Go to invoices</Btn>
        </CardBody>
      </Card>
    </div>
  );
}
