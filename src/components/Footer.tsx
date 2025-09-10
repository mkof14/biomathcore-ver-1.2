"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* 5 equal columns on md+ so sections are on one line */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand column: stacked vertically to avoid any overlap with Navigation */}
          <div>
            <div className="flex flex-col items-start gap-3">
              <Image
                src="/images/BMCore-Logo-33.png"
                alt="BM Core Logo"
                width={120}
                height={120}
                className="object-contain"
              />
              <div className="text-3xl font-bold">
                <span className="text-sky-400">BioMath</span>{" "}
                <span className="text-white">Core</span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-neutral-400">
              Advanced wellness management platform integrating analytics, AI, and connected services.
            </p>

            <div className="mt-4 flex gap-5">
              <a href="https://facebook.com/biomathcore" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition-opacity hover:opacity-80">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#1877F2"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0 0 22 12z"/></svg>
              </a>
              <a href="https://youtube.com/@biomathcore" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="transition-opacity hover:opacity-80">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.5 6.2a2.8 2.8 0 0 0-2-2C19.2 4 12 4 12 4s-7.2 0-9.5.2a2.8 2.8 0 0 0-2 2A29 29 0 0 0 .5 12a29 29 0 0 0 .1 5.8 2.8 2.8 0 0 0 2 2C4.8 20 12 20 12 20s7.2 0 9.5-.2a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .1-5.8 29 29 0 0 0-.1-5.8zM9.8 15.5V8.5l6.4 3.5-6.4 3.5z"/></svg>
              </a>
              <a href="https://instagram.com/biomathcore" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-opacity hover:opacity-80">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#E4405F"><path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.6 0 3 1.4 3 3v10c0 1.6-1.4 3-3 3H7c-1.6 0-3-1.4-3-3V7c0-1.6 1.4-3 3-3h10zm-5 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4.8-.9a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2z"/></svg>
              </a>
              <a href="https://linkedin.com/company/biomathcore" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-opacity hover:opacity-80">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#0A66C2"><path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 8.98h3.96V21H3V8.98zm7.03 0h3.8v1.63h.05c.53-1 1.83-2.05 3.76-2.05 4.02 0 4.76 2.65 4.76 6.1V21h-3.95v-5.61c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-3.95V8.98z"/></svg>
              </a>
              <a href="https://x.com/biomathcore" target="_blank" rel="noopener noreferrer" aria-label="X" className="transition-opacity hover:opacity-80">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#000000"><path d="M22 4.01c-.8.36-1.7.6-2.6.7a4.5 4.5 0 0 0 2-2.5 9.1 9.1 0 0 1-2.9 1.1 4.5 4.5 0 0 0-7.8 3v.9A12.9 12.9 0 0 1 3 3.6a4.5 4.5 0 0 0 1.4 6 4.5 4.5 0 0 1-2-.5v.1a4.5 4.5 0 0 0 3.6 4.4 4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 2 19.6a12.8 12.8 0 0 0 7 2c8.4 0 13-7 13-13v-.6a9.1 9.1 0 0 0 2-2.3z"/></svg>
              </a>
            </div>
          </div>

          {/* NAVIGATION */}
          <div>
            <h3 className="mb-3 font-semibold text-sky-400">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/">Home</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w/full" href="/services">Service Categories</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/member">Member Zone</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/auth">Sign In / Up</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/faq">FAQ</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/connect-devices">Connect Devices</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/assistant">AI Assistant</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/blog">Blog</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/news">News</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/refer">Refer a Friend</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/careers">Careers</Link></li>
            </ul>
          </div>

          {/* CORPORATE */}
          <div>
            <h3 className="mb-3 font-semibold text-sky-400">Corporate</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/news">News</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/blog">Blog</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/careers">Careers</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/refer">Refer a Friend</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="mb-3 font-semibold text-sky-400">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/legal/privacy">Privacy Policy</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/legal/terms">Terms of Service</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/legal/hipaa">HIPAA Notice</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/legal/security">Security</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/legal/disclaimer">Disclaimer</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/legal/data-protection">Data Protection</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/legal/cookies">Cookies</Link></li>
              <li><Link className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full" href="/legal/gdpr">GDPR Compliance</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="mb-3 font-semibold text-sky-400">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Charlotte, NC 28202, USA</li>
              <li>
                <a
                  href="mailto:info@biomathcore.com"
                  className="hover:text-white relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-sky-400 after:transition-all hover:after:w-full"
                >
                  info@biomathcore.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-neutral-400">
        © {year} BioMath Core · Important Notice: BioMath Core is a wellness management platform, not a medical service. Always consult a qualified healthcare professional for medical advice.
      </div>
    </footer>
  );
}
