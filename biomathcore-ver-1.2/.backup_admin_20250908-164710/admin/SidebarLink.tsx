"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

/** Боковая ссылка с подсветкой активного маршрута и подсказкой (hint). */
export default function SidebarLink({ href, label, hint }: { href: string; label: string; hint?: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      aria-label={`Open ${label}`}
      title={hint || label}
      className="block px-3 py-2 rounded-xl transition border text-sm"
      style={{
        background: active ? "var(--link-active-bg)" : "var(--link-bg)",
        borderColor: active ? "var(--link-active-border)" : "var(--link-border)",
        color: "var(--page-fg)",
      }}
      onMouseOver={(e) => {
        if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "var(--link-bg-hover)";
      }}
      onMouseOut={(e) => {
        if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "var(--link-bg)";
      }}
    >
      <div className="font-medium">{label}</div>
      {hint ? <div className="text-[11px]" style={{ color: "var(--link-fg-muted)" }}>{hint}</div> : null}
    </Link>
  );
}
