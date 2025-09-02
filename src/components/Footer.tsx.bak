"use client";
import Link from "next/link";

/**
 * Footer
 * - Keeps prior structure and styling direction
 * - Adds "Pricing" to Navigation
 * - Legal in the same row level as other sections
 * - Adds: Partner With Us (Business Development, Scientists, Healthcare Professional)
 * - Adds: Help (FAQ, AI Assistant)
 * - Service Categories: 20 items, 2 columns (10 + 10), each linking to Services page with anchor
 * - Title "SERVICE CATEGORIES" centered between the two columns
 * - Subtle divider line between upper sections and categories band
 * - Hover highlight preserved
 * - Social icons: Facebook, YouTube, Instagram, LinkedIn (colored)
 * - Contact: Charlotte, NC and email (lighter weight)
 */

type Cat = { label: string; slug: string };

const CATEGORIES: Cat[] = [
  { label: "Critical Health", slug: "critical-health" },
  { label: "Everyday Wellness", slug: "everyday-wellness" },
  { label: "Longevity & Anti-Aging", slug: "longevity-anti-aging" },
  { label: "Mental Wellness", slug: "mental-wellness" },
  { label: "Fitness & Performance", slug: "fitness-performance" },
  { label: "Women’s Health", slug: "womens-health" },
  { label: "Men’s Health", slug: "mens-health" },
  { label: "Beauty & Skincare", slug: "beauty-skincare" },
  { label: "Nutrition & Diet", slug: "nutrition-diet" },
  { label: "Sleep & Recovery", slug: "sleep-recovery" },
  { label: "Environmental Health", slug: "environmental-health" },
  { label: "Family Health", slug: "family-health" },
  {
    label: "Preventive Medicine & Longevity",
    slug: "preventive-medicine-longevity",
  },
  { label: "Biohacking & Performance", slug: "biohacking-performance" },
  { label: "Senior Care", slug: "senior-care" },
  { label: "Eye-Health Suite", slug: "eye-health-suite" },
  { label: "Digital Therapeutics Store", slug: "digital-therapeutics-store" },
  { label: "General Sexual Longevity", slug: "general-sexual-longevity" },
  { label: "Men's Sexual Health", slug: "mens-sexual-health" },
  { label: "Women's Sexual Health", slug: "womens-sexual-health" },
];

// Split into two equal columns
const LEFT = CATEGORIES.slice(0, 10);
const RIGHT = CATEGORIES.slice(10);

function catHref(slug: string) {
  // Anchor linking: Services page scrolls to category id `cat-<slug>`
  // If the anchor does not exist, it will still open /services safely.
  return `/services#cat-${slug}`;
}

function SocialIcons() {
  return (
    <div className="flex items-center gap-4">
      {/* Facebook */}
      <Link
        href="https://www.facebook.com/"
        aria-label="Facebook"
        className="transition hover:opacity-90"
        target="_blank"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          role="img"
          aria-hidden="true"
        >
          <path
            fill="#1877F2"
            d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.007 1.793-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.49 0-1.953.925-1.953 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
          />
        </svg>
      </Link>
      {/* YouTube */}
      <Link
        href="https://www.youtube.com/"
        aria-label="YouTube"
        className="transition hover:opacity-90"
        target="_blank"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          role="img"
          aria-hidden="true"
        >
          <path
            fill="#FF0000"
            d="M23.498 6.186a2.99 2.99 0 0 0-2.103-2.116C19.498 3.5 12 3.5 12 3.5s-7.498 0-9.395.57A2.99 2.99 0 0 0 .502 6.186C0 8.1 0 12 0 12s0 3.9.502 5.814a2.99 2.99 0 0 0 2.103 2.116C4.502 20.5 12 20.5 12 20.5s7.498 0 9.395-.57a2.99 2.99 0 0 0 2.103-2.116C24 15.9 24 12 24 12s0-3.9-.502-5.814z"
          />
          <path fill="#FFF" d="M9.75 15.5v-7l6 3.5-6 3.5z" />
        </svg>
      </Link>
      {/* Instagram */}
      <Link
        href="https://www.instagram.com/"
        aria-label="Instagram"
        className="transition hover:opacity-90"
        target="_blank"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          role="img"
          aria-hidden="true"
        >
          <linearGradient id="ig" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F58529" />
            <stop offset="50%" stopColor="#DD2A7B" />
            <stop offset="100%" stopColor="#8134AF" />
          </linearGradient>
          <path
            fill="url(#ig)"
            d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z"
          />
          <circle cx="18" cy="6" r="1.3" fill="#fff" />
          <circle
            cx="12"
            cy="12"
            r="4.2"
            fill="none"
            stroke="#fff"
            strokeWidth="1.6"
          />
        </svg>
      </Link>
      {/* LinkedIn */}
      <Link
        href="https://www.linkedin.com/"
        aria-label="LinkedIn"
        className="transition hover:opacity-90"
        target="_blank"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          role="img"
          aria-hidden="true"
        >
          <path
            fill="#0A66C2"
            d="M20.447 20.452H17.21v-5.569c0-1.329-.027-3.04-1.852-3.04-1.853 0-2.136 1.447-2.136 2.943v5.666H9.01V9h3.112v1.561h.045c.434-.82 1.494-1.685 3.073-1.685 3.287 0 3.894 2.164 3.894 4.982v6.594zM5.337 7.433a1.805 1.805 0 1 1 0-3.61 1.805 1.805 0 0 1 0 3.61zM6.79 20.452H3.89V9H6.79v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.225 0z"
          />
        </svg>
      </Link>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#0b0f1a] text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        {/* Top row: brand + contact + socials */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight text-brand-gradient"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-fuchsia-400">
                BioMath Core
              </span>
            </Link>
            <p className="mt-2 text-sm text-gray-400 max-w-prose">
              Charlotte, NC
            </p>
            <p className="text-sm text-gray-400">
              <a
                href="mailto:info@biomathcore.com"
                className="underline decoration-cyan-400/60 hover:text-white"
                style={{ fontWeight: 300 }}
              >
                info@biomathcore.com
              </a>
            </p>
          </div>

          <SocialIcons />
        </div>

        {/* Upper sections grid: Navigation | Company | Legal | Partner With Us | Help */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Navigation */}
          <div>
            <h4 className="text-cyan-300 font-semibold uppercase tracking-wider text-sm">
              Navigation
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/member-zone"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  Member
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/investors"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  Investors
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-cyan-300 font-semibold uppercase tracking-wider text-sm">
              Company
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/investors"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  Investors
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  News
                </Link>
              </li>
              <li>
                <Link
                  href="/refer"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  Refer a Friend
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-cyan-300 font-semibold uppercase tracking-wider text-sm">
              Legal
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/legal/privacy"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/hipaa"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  HIPAA
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/ccpa"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  CCPA
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/data-protection"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  Data Protection
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookie-policy"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/consumer-health-data"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  Consumer Health Data
                </Link>
              </li>
            </ul>
          </div>

          {/* Partner With Us */}
          <div>
            <h4 className="text-cyan-300 font-semibold uppercase tracking-wider text-sm">
              Partner With Us
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/corporate/partners#business-development"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  Business Development
                </Link>
              </li>
              <li>
                <Link
                  href="/corporate/partners#scientists"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  Scientists
                </Link>
              </li>
              <li>
                <Link
                  href="/corporate/partners#hcp"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  Healthcare Professional
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-cyan-300 font-semibold uppercase tracking-wider text-sm">
              Help
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-assistant"
                  className="rounded px-1 hover:bg-white/5 hover:text-white"
                >
                  AI Assistant
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider between levels */}
        <div className="my-8 h-px w-full brand-hairline"></div>

        {/* Service Categories band */}
        <div className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <ul className="space-y-2">
              {LEFT.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={catHref(cat.slug)}
                    className="rounded px-1 hover:bg-white/5 hover:text-white"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Center heading */}
            <div className="flex items-start lg:items-center justify-center">
              <h4 className="text-cyan-300 font-semibold uppercase tracking-wider text-sm text-center">
                SERVICE CATEGORIES
              </h4>
            </div>

            {/* Right column */}
            <ul className="space-y-2">
              {RIGHT.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={catHref(cat.slug)}
                    className="rounded px-1 hover:bg-white/5 hover:text-white"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-gray-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} BioMath Core. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/legal/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/legal/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/legal/cookie-policy" className="hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
