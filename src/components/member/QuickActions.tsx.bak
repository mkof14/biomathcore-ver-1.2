"use client";
import Link from "next/link";

/**
 * QuickActions — frequent entry points to key flows.
 */

const actions = [
  { id: "qa-report", label: "Generate Report", href: "/reports" },
  {
    id: "qa-assistant",
    label: "Ask AI Assistant",
    href: "/ai-health-assistant",
  },
  { id: "qa-device", label: "Connect Device", href: "/member-zone#devices" },
  { id: "qa-profile", label: "Update Profile", href: "/member-zone#profile" },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1320] p-5">
      <h2 className="text-sm font-semibold text-white/90">Quick Actions</h2>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {actions.map((a) => (
          <Link
            key={a.id}
            href={a.href}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-center text-gray-300 hover:bg-white/10"
          >
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
