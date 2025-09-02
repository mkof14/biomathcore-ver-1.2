#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"

echo ">> Creating (member) app structure…"
mkdir -p "$ROOT/src/app/(member)/dashboard"
mkdir -p "$ROOT/src/app/(member)/account/billing"
mkdir -p "$ROOT/src/app/(member)/blackbox"
mkdir -p "$ROOT/src/components/member"

# 1) (member)/layout.tsx — shared shell for member routes (no auth redirect here)
cat > "$ROOT/src/app/(member)/layout.tsx" <<'TSX'
// src/app/(member)/layout.tsx
import React from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateRows: "auto 1fr", background: "#fafafa" }}>
      <header style={{ borderBottom: "1px solid #eee", background: "#fff" }}>
        <nav style={{ display: "flex", gap: 16, padding: "12px 16px", alignItems: "center" }}>
          <strong>Member</strong>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/account/billing">Billing</Link>
          <Link href="/blackbox">Health Black Box</Link>
          <span style={{ marginLeft: "auto" }} />
          <Link href="/">Back to site</Link>
        </nav>
      </header>
      <main style={{ padding: 16 }}>{children}</main>
    </div>
  );
}
TSX
echo "✓ wrote: src/app/(member)/layout.tsx"

# 2) (member)/dashboard/page.tsx — reads subscription via API and shows quick status
cat > "$ROOT/src/app/(member)/dashboard/page.tsx" <<'TSX'
// src/app/(member)/dashboard/page.tsx
"use client";

import React from "react";
import SubscriptionCard from "@/components/account/SubscriptionCard";

export default function DashboardPage() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Dashboard</h1>
      <p>Welcome to your member area.</p>
      <SubscriptionCard />
    </div>
  );
}
TSX
echo "✓ wrote: src/app/(member)/dashboard/page.tsx"

# 3) (member)/account/billing/page.tsx — opens Stripe Billing Portal
cat > "$ROOT/src/app/(member)/account/billing/page.tsx" <<'TSX'
// src/app/(member)/account/billing/page.tsx
"use client";

import React, { useState } from "react";

export default function BillingPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const json = await res.json();
      if (json?.ok && json?.url) {
        window.location.href = json.url as string;
        return;
      }
      setError(json?.error || "Failed to open portal");
    } catch (e: any) {
      setError(e?.message || "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Billing</h1>
      <p>Manage your subscription, payment methods, and invoices.</p>
      <button
        onClick={openPortal}
        disabled={busy}
        style={{ width: "fit-content", padding: "10px 14px", borderRadius: 8 }}
      >
        {busy ? "Opening…" : "Open Billing Portal"}
      </button>
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
    </div>
  );
}
TSX
echo "✓ wrote: src/app/(member)/account/billing/page.tsx"

# 4) (member)/blackbox/page.tsx — scaffold for Health Black Box (no external calls yet)
cat > "$ROOT/src/app/(member)/blackbox/page.tsx" <<'TSX'
// src/app/(member)/blackbox/page.tsx
"use client";

import React, { useState } from "react";

type Job = { id: string; status: "queued" | "running" | "done" | "error"; createdAt: string };

export default function HealthBlackBoxPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [busy, setBusy] = useState(false);

  async function createJob() {
    setBusy(true);
    try {
      // Placeholder: local-only mock. Replace with real API when ready.
      const job: Job = {
        id: "job_" + Math.random().toString(36).slice(2),
        status: "queued",
        createdAt: new Date().toISOString(),
      };
      setJobs((x) => [job, ...x]);
      // Simulate progress
      setTimeout(() => setJobs((x) => x.map(j => j.id === job.id ? { ...j, status: "running" } : j)), 800);
      setTimeout(() => setJobs((x) => x.map(j => j.id === job.id ? { ...j, status: "done" } : j)), 1600);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Health Black Box</h1>
      <p>Run analyses and see results here. (Backend wiring to come.)</p>
      <button onClick={createJob} disabled={busy} style={{ width: "fit-content", padding: "10px 14px", borderRadius: 8 }}>
        {busy ? "Starting…" : "Start new analysis"}
      </button>
      <div style={{ display: "grid", gap: 8 }}>
        {jobs.map((j) => (
          <div key={j.id} style={{ border: "1px solid #eee", background: "#fff", borderRadius: 10, padding: 12 }}>
            <div><strong>ID:</strong> {j.id}</div>
            <div><strong>Status:</strong> {j.status}</div>
            <div><strong>Created:</strong> {new Date(j.createdAt).toLocaleString()}</div>
          </div>
        ))}
        {jobs.length === 0 && <p>No jobs yet.</p>}
      </div>
    </div>
  );
}
TSX
echo "✓ wrote: src/app/(member)/blackbox/page.tsx"

# 5) Optional: lightweight ProtectedGate (not wired by default)
cat > "$ROOT/src/components/member/ProtectedGate.tsx" <<'TSX'
// src/components/member/ProtectedGate.tsx
"use client";

import React, { useEffect, useState } from "react";

export default function ProtectedGate({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<null | boolean>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Very naive check: if subscription endpoint is accessible while logged in,
        // consider user "member". Replace with your own logic (NextAuth session + role/tier).
        const res = await fetch("/api/user/subscription");
        setOk(alive ? res.status !== 401 : null);
      } catch {
        setOk(alive ? false : null);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (ok === null) return <p>Loading…</p>;
  if (!ok) return <p>Access denied. Please sign in and subscribe.</p>;
  return <>{children}</>;
}
TSX
echo "✓ wrote: src/components/member/ProtectedGate.tsx"

# 6) Git protection: husky pre-commit guard for public pages (adjust list to your final pages)
if [ ! -d "$ROOT/.husky" ]; then
  npm i -D husky >/dev/null 2>&1 || true
  npx husky init >/dev/null 2>&1 || true
fi

cat > "$ROOT/.husky/pre-commit" <<'HOOK'
#!/usr/bin/env bash
set -euo pipefail

# Protect known final public pages (edit this list as needed).
PROTECTED=(
  "src/app/page.tsx"
  "src/app/pricing/page.tsx"
  "src/app/(public)"
)

CHANGED="$(git diff --cached --name-only || true)"

for P in "${PROTECTED[@]}"; do
  if echo "$CHANGED" | grep -qE "^${P}(/|$)"; then
    echo "⛔ Protected path changed: ${P}"
    echo "Ask owner for explicit approval before committing changes."
    exit 1
  fi
done

echo "✅ pre-commit: OK"
HOOK
chmod +x "$ROOT/.husky/pre-commit"
echo "✓ wrote: .husky/pre-commit"

echo "✅ Public/Member split initialized (member routes only, no public files touched)."
