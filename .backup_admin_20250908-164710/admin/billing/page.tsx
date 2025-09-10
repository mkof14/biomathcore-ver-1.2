"use client";
import React from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card, CardHeader, CardTitle, CardBody, Btn } from "@/components/ui/CardToned";

async function openPortal() {
  const r = await fetch("/api/stripe/portal", { method: "POST" });
  if (!r.ok) { alert("Portal unavailable"); return; }
  const j = await r.json();
  if (j?.url) window.location.href = j.url;
  else alert("Portal unavailable");
}

export default function Page() {
  return (
    <div className="space-y-6">
      <AdminHeader title="Billing" desc="Manage subscriptions and invoices." />
      <Card tone="violet">
        <CardHeader><CardTitle>Customer Portal</CardTitle></CardHeader>
        <CardBody className="space-y-2">
          <div className="text-sm text-neutral-300">Open Stripe portal to manage plan, payment method, invoices.</div>
          <div className="flex gap-2">
            <Btn variant="primary" onClick={openPortal}>Open Portal</Btn>
            <Btn href="/pricing">Plans</Btn>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
