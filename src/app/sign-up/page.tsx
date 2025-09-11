'use client';

// src/app/sign-up/page.tsx
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const r = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      r.push("/sign-in");
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data?.error ?? "Registration failed");
    }
  }

  return (
    <section className="min-h-[70vh] grid place-items-center bg-black text-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h1 className="text-2xl font-bold mb-1">Create account</h1>
        <p className="text-white/70 text-sm mb-6">
          One account for your plans and services.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name (optional)</label>
            <input
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              className="w-full rounded-lg bg-black border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400/60"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              className="w-full rounded-lg bg-black border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400/60"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              className="w-full rounded-lg bg-black border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400/60"
              placeholder="Min 6 characters"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-cyan-300 hover:bg-cyan-200 text-black font-semibold py-2 transition"
          >
            Create account
          </button>
        </form>
      </div>
    </section>
  );
}
