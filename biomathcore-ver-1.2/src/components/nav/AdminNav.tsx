"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const items = [
  { href: "/admin/overview", title: "Overview" },
  { href: "/admin/users", title: "Users" },
  { href: "/admin/finance", title: "Finance" },
  { href: "/admin/tech", title: "Tech Health" },
  { href: "/admin/ai-insights", title: "AI Insights" },
  { href: "/admin/alerts", title: "Alerts" },
  { href: "/admin/big-screen", title: "Big Screen" },
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <aside className="w-64 shrink-0 border-r border-neutral-800/60 bg-neutral-950/40">
      <div className="px-5 py-5">
        <div className="text-2xl font-semibold tracking-tight">Admin</div>
        <div className="text-xs text-neutral-400">Mission Control</div>
      </div>
      <nav className="px-2 pb-6 space-y-1">
        {items.map((it) => {
          const active = path?.startsWith(it.href);
          return (
            <Link key={it.href} href={it.href}
              className={clsx(
                "block rounded-md px-3 py-2 text-sm transition",
                active
                  ? "bg-neutral-800/60 text-white"
                  : "text-neutral-300 hover:bg-neutral-900/60 hover:text-white"
              )}
            >
              {it.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
