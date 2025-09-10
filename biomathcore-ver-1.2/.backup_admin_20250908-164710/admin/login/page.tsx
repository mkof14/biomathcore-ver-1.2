"use client";
import React, { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      const next = new URLSearchParams(window.location.search).get("next") || "/admin";
      window.location.href = next;
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
      <form onSubmit={onSubmit} className="p-6 rounded-2xl bg-white/5 border border-white/10 w-full max-w-sm space-y-3">
        <h1 className="text-lg font-semibold">Admin Login</h1>
        <input
          className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 outline-none"
          type="password" placeholder="Admin password"
          value={password} onChange={e => setPassword(e.target.value)} />
        {err ? <div className="text-sm text-red-400">{err}</div> : null}
        <button disabled={loading} className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/10">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
