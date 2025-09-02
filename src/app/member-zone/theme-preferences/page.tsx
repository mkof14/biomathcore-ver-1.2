"use client";
/**
 * Member Zone — Theme Preferences page
 * Lightweight wrapper around the ThemePreferences component.
 */

import Link from "next/link";
import ThemePreferences from "@/components/member/ThemePreferences";

export default function MemberThemePreferencesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Member: Theme Preferences</h1>
          <p className="mt-1 text-sm text-gray-300">
            Configure how BioMath Core looks across your account.
          </p>
        </div>
        <Link
          href="/member-zone"
          className="rounded-md px-3 py-1.5 text-sm text-gray-200 hover:bg-white/10"
        >
          ← Back to Member Zone
        </Link>
      </div>

      <ThemePreferences />
    </div>
  );
}
