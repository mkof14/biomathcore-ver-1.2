import type { ReactNode } from "react";
import AdminNav from "@/components/nav/AdminNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-[1600px] flex">
        <AdminNav />
        <main className="flex-1 min-w-0 p-6">{children}</main>
      </div>
    </div>
  );
}
