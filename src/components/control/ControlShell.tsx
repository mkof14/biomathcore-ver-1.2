"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function ControlShell({
  title = "Control Center",
  subtitle = "Monitoring & Control",
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");

  const nav = [
    { label: "Overview", href: "/control-center" },
    { label: "Finance", href: "/control-center/finance" },
    { label: "Users", href: "/control-center/users" },
    { label: "Ops", href: "/control-center/ops" },
    { label: "System", href: "/control-center/system" },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/control-center" && pathname?.startsWith(href));

  return (
    <div
      className={
        theme === "dark"
          ? "min-h-screen bg-neutral-900 text-neutral-100"
          : "min-h-screen bg-neutral-50 text-neutral-900"
      }
    >
      <header
        className={
          theme === "dark"
            ? "border-b border-white/10 bg-neutral-950/60 backdrop-blur"
            : "border-b border-neutral-300/60 bg-white/80 backdrop-blur"
        }
      >
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-white/20">
              <Image
                src="/images/bm-core-chip.png"
                alt="BioMath Core Chip"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-wide">{title}</h1>
              <p
                className={
                  theme === "dark" ? "text-xs text-neutral-300" : "text-xs text-neutral-600"
                }
              >
                {subtitle}
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              className={
                theme === "dark"
                  ? "rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
                  : "rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm hover:bg-neutral-50"
              }
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <Link
              href="/"
              className={
                theme === "dark"
                  ? "rounded-lg border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10"
                  : "rounded-lg border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50"
              }
            >
              Back to Site
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl grid grid-cols-12 gap-4 px-4 py-6">
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <div
            className={
              theme === "dark"
                ? "rounded-2xl border border-white/20 bg-white/10 p-3"
                : "rounded-2xl border border-neutral-300 bg-white p-3"
            }
          >
            <div className="text-xs uppercase tracking-wider opacity-70 px-2 pb-2">
              Sections
            </div>
            <nav className="flex flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "rounded-xl px-3 py-2 text-sm border",
                    theme === "dark"
                      ? "border-white/20 hover:bg-white/10"
                      : "border-neutral-300 hover:bg-neutral-50",
                    isActive(item.href)
                      ? theme === "dark"
                        ? "bg-white/15"
                        : "bg-neutral-100"
                      : "",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          <div
            className={
              theme === "dark"
                ? "rounded-2xl border border-white/20 bg-white/10 p-4"
                : "rounded-2xl border border-neutral-300 bg-white p-4"
            }
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
