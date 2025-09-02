"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type SubResp =
  | {
      ok: true;
      planTier: string | null;
      priceId: string | null;
      currentPeriodEnd: string | null;
    }
  | { ok: false };

export default function AccountPage() {
  const { data: session, status } = useSession();
  const loadingSession = status === "loading";

  const [sub, setSub] = useState<SubResp | null>(null);
  const [loadingSub, setLoadingSub] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch("/api/user/subscription", {
          cache: "no-store",
        });
        const json: SubResp = await res.json();
        if (!cancelled) setSub(json);
      } catch {
        if (!cancelled) setSub({ ok: false });
      } finally {
        if (!cancelled) setLoadingSub(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Account
          </h1>
          <p className="text-sm opacity-70 mt-1">
            Profile, auth status and subscription overview.
          </p>
        </div>

        <Link href="/member-zone" className="btn btn-muted">
          Back to Member Zone
        </Link>
      </div>

      {/* Profile card */}
      <div className="card-like">
        <h2 className="text-lg font-semibold mb-3">Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="opacity-70">Auth</div>
            <div className="mt-1">
              {loadingSession
                ? "Loading..."
                : session?.user
                  ? "Signed in"
                  : "Signed out"}
            </div>
          </div>
          <div>
            <div className="opacity-70">Name</div>
            <div className="mt-1">{session?.user?.name ?? "—"}</div>
          </div>
          <div>
            <div className="opacity-70">Email</div>
            <div className="mt-1 break-all">{session?.user?.email ?? "—"}</div>
          </div>
        </div>
      </div>

      {/* Subscription card */}
      <div className="card-like">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Subscription</h2>
          <Link href="/member-zone/subscriptions" className="btn btn-primary">
            Manage
          </Link>
        </div>

        <div className="mt-3 text-sm">
          {loadingSub ? (
            <div className="opacity-70">Loading subscription…</div>
          ) : sub?.ok ? (
            <div className="space-y-1">
              <div>
                <span className="opacity-70">Plan:</span>{" "}
                {sub.planTier ?? "none"}
              </div>
              <div>
                <span className="opacity-70">Price ID:</span>{" "}
                {sub.priceId ?? "—"}
              </div>
              <div>
                <span className="opacity-70">Current period end:</span>{" "}
                {sub.currentPeriodEnd
                  ? new Date(sub.currentPeriodEnd).toLocaleString()
                  : "—"}
              </div>
            </div>
          ) : (
            <div className="text-amber-300">Could not load subscription.</div>
          )}
        </div>
      </div>

      {/* Security/help */}
      <div className="card-like">
        <h2 className="text-lg font-semibold mb-3">Security & Help</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>
            To update email or password, contact support (UI coming later).
          </li>
          <li>
            Billing, invoices and payment methods are available on{" "}
            <Link href="/member-zone/subscriptions" className="underline">
              Subscriptions
            </Link>
            .
          </li>
        </ul>
      </div>
    </section>
  );
}
