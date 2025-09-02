"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { useState } from "react";



const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/member-zone", label: "Member" },
  { href: "/about", label: "About" },
  { href: "/investors", label: "Investors" },
  { href: "/contact", label: "Contact" },
 
];

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <nav
      className={cx(
        "fixed top-0 z-40 w-full",
        "backdrop-blur supports-[backdrop-filter]:bg-[#0b0f1a]/70",
        "border-b border-white/10",
      )}
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            aria-label="BioMath Core Home"
          >
            <Logo className="text-[20px] md:text-[22px]" />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cx(
                      "text-sm px-2 py-1.5 rounded-md transition",
                      active
                        ? "text-white bg-white/10"
                        : "text-gray-300 hover:text-white hover:bg-white/5",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right: auth */}
          <div className="hidden md:flex items-center">
            <Link
              href="/sign-in"
              className="text-sm text-black bg-cyan-300 hover:bg-cyan-200 px-3 py-1.5 rounded-md"
            >
              Sign In/Up
            </Link>
          </div>

          {/* Mobile button */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
            className="md:hidden p-2 rounded-md text-gray-200 hover:bg-white/10"
          >
            {mobileOpen ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 6h18M3 12h18M3 18h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-white/10 bg-[#0b0f1a]/95 backdrop-blur px-4 py-3"
        >
          <ul className="space-y-1" role="list">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cx(
                      "block rounded-md px-3 py-2 text-sm outline-none",
                      active
                        ? "text-white bg-white/10"
                        : "text-gray-300 hover:text-white hover:bg-white/5",
                      "focus-visible:ring-2 focus-visible:ring-cyan-300/60",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-1">
              <Link
                href="/sign-in"
                className="block rounded-md px-3 py-2 text-sm text-black bg-cyan-300 hover:bg-cyan-200 outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
              >
                Sign In/Up
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
