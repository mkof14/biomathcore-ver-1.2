"use client";
// src/app/sign-in/page.tsx
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState(
    process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "demo@biomath.dev",
  );
  const [password, setPassword] = useState(
    process.env.NEXT_PUBLIC_DEMO_PASS ?? "demo123",
  );
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const callbackUrl = searchParams.get("callbackUrl") || "/member-zone";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);

    if (!res) {
      alert("Unknown error");
      return;
    }
    if (res.error) {
      alert(res.error || "Invalid credentials");
      return;
    }
    // success: redirect to callbackUrl (or /member-zone)
    router.push(res.url || "/member-zone");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-[#0b0f1a] to-black px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-white">
            Sign in to BioMath Core
          </h1>
          <p className="text-white/60 mt-1 text-sm">
            Use your account to access Member Zone and services.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg px-4 py-2 font-semibold transition ${
              loading
                ? "bg-cyan-400/40 text-white/80 cursor-not-allowed"
                : "bg-cyan-300 hover:bg-cyan-200 text-black"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-white/60">
          <span>Need an account? </span>
          <Link href="/pricing" className="text-cyan-300 hover:underline">
            Choose a plan
          </Link>
        </div>

        <div className="mt-4 rounded-lg border border-white/10 p-3 text-xs text-white/60">
          <div className="font-semibold mb-1">Demo credentials</div>
          <div>Email: demo@biomath.dev</div>
          <div>Password: demo123</div>
          <div className="mt-2 opacity-70">
            (You can override via <code>DEMO_USER_EMAIL</code> /{" "}
            <code>DEMO_USER_PASSWORD</code> in <code>.env.local</code>.)
          </div>
        </div>
      </div>
    </div>
  );
}
