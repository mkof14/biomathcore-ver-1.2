"use client";
import React, { useEffect, useState } from "react";
import { SectionCard } from "@/components/admin/AdminShell";

/**  :    */
export default function AdminDashboard() {
  const [env, setEnv] = useState<{present:string[];missing:string[];total:number;checkedAt:string}|null>(null);
  const [secretsCount, setSecretsCount] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        //    env-
        const e = await fetch("/api/admin/health/env").then(r => r.json());
        setEnv(e);
      } catch {}
      try {
        //   (   )
        const s = await fetch("/api/admin/secrets").then(r => r.json());
        setSecretsCount((s.items || []).length);
      } catch {}
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <SectionCard title="Secrets" descr="   ">
          <div className="text-2xl font-semibold">{secretsCount}</div>
          <div className="small mt-1">Total managed keys</div>
        </SectionCard>

        <SectionCard title="Env Present" descr="     ">
          <div className="text-2xl font-semibold">{env ? env.present.length : "—"} / {env ? env.total : "—"}</div>
          <div className="small mt-1">Checked {env ? new Date(env.checkedAt).toLocaleString() : "—"}</div>
        </SectionCard>

        <SectionCard title="Quick Actions" descr="   -">
          <div className="mt-2 text-sm">
            <a href="/admin/secrets" className="underline">Manage Secrets</a> ·{" "}
            <a href="/admin/env" className="underline">Environment Health</a> ·{" "}
            <a href="/admin/integrations" className="underline">Integrations</a>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Notes" descr="  ">
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>         —  Stripe  .</li>
          <li>  .      .</li>
          <li> :  Secrets Manager + WebAuthn / TOTP,   .</li>
        </ul>
      </SectionCard>
    </div>
  );
}
