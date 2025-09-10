// src/app/auth/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In / Up • BioMath Core",
  description: "Authenticate to access your BioMath Core account.",
};

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-md mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Sign In / Sign Up
        </h1>
        <p className="mt-2 text-gray-600">
          Demo UI — connect to your auth later.
        </p>

        <form className="mt-6 grid gap-3">
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Email"
            type="email"
          />
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Password"
            type="password"
          />
          <button
            type="button"
            className="mt-2 inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-white text-sm hover:bg-indigo-700"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
