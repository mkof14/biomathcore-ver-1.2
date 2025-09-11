'use client';

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

type Provider = {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
};

export default function AuthPage() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/auth/providers", { cache: "no-store" });
        const data = await r.json();
        setProviders(data && typeof data === "object" ? data : {});
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center">Loading…</main>;
  }

  const entries = Object.entries(providers ?? {});
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4 border rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-center">Sign In / Sign Up</h1>
        <div className="space-y-3">
          {entries.map(([id, p]) => (
            <button
              key={id}
              onClick={() => signIn(p.id, { callbackUrl: "/" })}
              className="w-full border rounded-lg py-2 px-4 hover:bg-gray-50"
            >
              Continue with {p.name}
            </button>
          ))}
          {entries.length === 0 && (
            <div className="text-sm text-red-600 text-center">No OAuth providers configured</div>
          )}
        </div>
      </div>
    </main>
  );
}
