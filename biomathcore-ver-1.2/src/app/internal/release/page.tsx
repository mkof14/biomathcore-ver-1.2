"use client";
import React, { useEffect, useMemo, useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import { Card, CardHeader, CardTitle, CardBody, Row, Badge, Btn } from "@/components/ui/CardToned";

type EnvMap = Record<string, boolean>;
type HealthItem = { ok: boolean };
type HealthAll = Record<string, HealthItem>;

export default function Page() {
  const [env, setEnv] = useState<{ data?: EnvMap; stripeMode?: string } | null>(null);
  const [health, setHealth] = useState<HealthAll | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      setErr(null);
      const [envR, hR, aR] = await Promise.all([
        fetch("/api/health/env", { cache: "no-store" }),
        fetch("/api/health/all", { cache: "no-store" }),
        fetch("/api/analytics/summary", { cache: "no-store" }),
      ]);
      if (!envR.ok) throw new Error(`env HTTP ${envR.status}`);
      if (!hR.ok) throw new Error(`health HTTP ${hR.status}`);
      if (!aR.ok) throw new Error(`analytics HTTP ${aR.status}`);
      const [envJ, hJ, aJ] = await Promise.all([envR.json(), hR.json(), aR.json()]);
      setEnv(envJ || {});
      setHealth(hJ?.data ?? {});
      setAnalytics(aJ?.data ?? aJ);
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  const checks = useMemo(() => {
    const envMap = env?.data ?? {};
    const stripeLive = env?.stripeMode === "live";
    const endpointsOk = health ? Object.values(health).every(x => x.ok) : false;
    const dbConnected = Boolean(envMap.DATABASE_URL);
    const stripeKeySet = Boolean(envMap.STRIPE_SECRET_KEY);
    const webhookSet = Boolean(envMap.STRIPE_WEBHOOK_SECRET);
    const domainConfigured = Boolean(envMap.NEXT_PUBLIC_APP_URL);

    return [
      { key: "stripeKeySet",     label: "Stripe secret key set",                ok: stripeKeySet },
      { key: "webhookSet",       label: "Stripe webhook secret set",            ok: webhookSet },
      { key: "stripeLive",       label: "Stripe in LIVE mode (optional)",       ok: stripeLive },
      { key: "dbConnected",      label: "Production database URL configured",   ok: dbConnected },
      { key: "endpointsOk",      label: "All health endpoints are OK",          ok: endpointsOk },
      { key: "domainConfigured", label: "Domain configured (NEXT_PUBLIC_APP_URL)", ok: domainConfigured },
    ];
  }, [env, health]);

  const allGreen = checks.every(c => c.ok);

  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Release" desc="Pre-ship checklist. Auto-updates every 30s." />
      {err && <div className="text-sm text-red-400">{err}</div>}

      <Card tone="emerald">
        <CardHeader><CardTitle>Checklist</CardTitle></CardHeader>
        <CardBody className="space-y-2">
          {checks.map(c => (
            <Row
              key={c.key}
              label={c.label}
              value={<Badge tone={c.ok ? "emerald" : "amber"}>{c.ok ? "OK" : "Pending"}</Badge>}
            />
          ))}

          <div className="pt-2">
            <Btn variant={allGreen ? "primary" : "ghost"} disabled={!allGreen}>
              {allGreen ? "Ready to Ship" : "Resolve issues to enable shipping"}
            </Btn>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
