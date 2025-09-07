"use client";

import Link from "next/link";
import { footerNav, social, brand } from "@/config/footer";

export default function FooterClassic() {
  const year = new Date().getFullYear();
  const from = brand.copyrightFrom ?? year;
  const range = from === year ? `${year}` : `${from}–${year}`;

  return (
    <footer className="bg-neutral-950 text-neutral-200">
      <div className="mx-auto max-w-screen-2xl px-6 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-xl font-semibold text-white">{brand.name}</span>
            </Link>
            <p className="mt-2 text-sm text-neutral-400">{brand.tagline}</p>
            <div className="mt-5 flex gap-3">
              {social.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-300 transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-600"
                >
                  <span className="text-sm">{s.label[0]}</span>
                </Link>
              ))}
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-10 md:col-span-3 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Product</h3>
              <ul className="mt-3 space-y-2">
                {footerNav.product.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-neutral-400 hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Company</h3>
              <ul className="mt-3 space-y-2">
                {footerNav.company.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-neutral-400 hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Legal</h3>
              <ul className="mt-3 space-y-2">
                {footerNav.legal.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-neutral-400 hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-10 border-t border-neutral-800 pt-6 text-xs text-neutral-400">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <p>© {range} {brand.name}. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/legal/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/legal/terms" className="hover:text-white">Terms</Link>
              <Link href="/legal/cookies" className="hover:text-white">Cookies</Link>
              <Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
