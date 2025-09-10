"use client";
import React from "react";
import SidebarLink from "./SidebarLink";
import ThemeToggle from "./ThemeToggle";
import "./theme.css";

export function SectionCard({ title, descr, children }: { title: string; descr?: string; children: React.ReactNode }) {
  return (
    <section className="admin-card p-4 md:p-5">
      <h2 className="text-base md:text-lg font-semibold">{title}</h2>
      {descr ? <div className="kicker mt-1">{descr}</div> : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const groups = [
    {
      title: "Core",
      items: [
        { href: "/admin", label: "Dashboard", hint: "Обзор и быстрые действия" },
        { href: "/admin/env", label: "Env Health", hint: "Проверка обязательных ключей" },
        { href: "/admin/secrets", label: "Secrets", hint: "Управление API-ключами и токенами" },
      ],
    },
    {
      title: "Integrations",
      items: [
        { href: "/admin/integrations", label: "Integrations", hint: "Пинги Stripe, Gemini и др." },
        { href: "/admin/providers", label: "OAuth Providers", hint: "Apple / Google / Microsoft / Facebook" },
        { href: "/admin/email", label: "Email / Magic Link", hint: "SMTP и Magic Link" },
        { href: "/admin/payments", label: "Payments", hint: "Stripe настройки" },
      ],
    },
    {
      title: "Ops",
      items: [
        { href: "/admin/flags", label: "Feature Flags", hint: "Флаги и эксперименты" },
        { href: "/admin/logs", label: "Audit Logs", hint: "История изменений" },
        { href: "/admin/backups", label: "Backups", hint: "Экспорт .env и secrets" },
        { href: "/admin/status", label: "System Status", hint: "Аптайм и здоровье" },
      ],
    },
  ];

  return (
    <div className="admin-theme min-h-screen" style={{ background: "var(--page-bg)", color: "var(--page-fg)" }}>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 md:gap-6">
          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="admin-card p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="text-base md:text-lg font-semibold">BioMatn Core Admin</div>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <form action="/api/admin/logout" method="post">
                    <button className="btn btn-ghost" type="submit" aria-label="Sign out from Admin" title="Sign out">
                      <span>Logout</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {groups.map((g) => (
              <div key={g.title} className="admin-card p-3 space-y-2">
                <div className="text-xs uppercase tracking-wide" style={{ color: "var(--muted-strong)" }}>{g.title}</div>
                <div className="space-y-1.5">
                  {g.items.map((it) => (
                    <SidebarLink key={it.href} href={it.href} label={it.label} hint={it.hint} />
                  ))}
                </div>
              </div>
            ))}
          </aside>

          {/* Content */}
          <main className="min-h-[70vh] space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
