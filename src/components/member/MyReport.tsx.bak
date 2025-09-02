"use client";
import Link from "next/link";

/**
 * MyReport — entry points to the reporting system.
 * Legal/quality policies live under /reports/policies.
 */

export default function MyReport() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1320] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/90">My Report</h2>
        <Link
          href="/reports"
          className="text-xs text-cyan-300 hover:text-cyan-200 underline"
        >
          Open Reports
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <Link
          href="/reports/new"
          className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10"
        >
          <p className="text-sm text-white">Create new report</p>
          <p className="text-xs text-gray-400 mt-1">
            Based on your questions, forms and uploaded data.
          </p>
        </Link>

        <Link
          href="/reports/history"
          className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10"
        >
          <p className="text-sm text-white">Report history</p>
          <p className="text-xs text-gray-400 mt-1">
            Browse and export previous reports.
          </p>
        </Link>

        <Link
          href="/reports/policies"
          className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10"
        >
          <p className="text-sm text-white">Policies & compliance</p>
          <p className="text-xs text-gray-400 mt-1">
            USA legal, privacy and quality requirements.
          </p>
        </Link>
      </div>
    </div>
  );
}
