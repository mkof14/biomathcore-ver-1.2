export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import type { ReactNode } from "react";
import MemberNav from "@/components/nav/MemberNav";

export default function MemberZoneLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-7xl member-shell">
        <aside className="member-aside">
          <div className="px-2 pb-3">
            <div className="text-sm text-neutral-400">Biomath Core</div>
            <div className="text-[13px] text-neutral-500">Member Area</div>
          </div>
          <MemberNav />
        </aside>

        <main className="member-main">
          <header className="mb-6">
            <h1 className="member-h1">Member Zone</h1>
            <p className="member-sub mt-1">Your workspace with tools, data and billing.</p>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
