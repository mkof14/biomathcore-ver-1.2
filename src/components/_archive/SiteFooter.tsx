import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-white/10 bg-[#0b0f1a] text-gray-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <h3 className="mb-2 text-lg font-semibold text-white">BioMath Core</h3>
          <p className="text-sm text-gray-400">
            Predictive insights and personalized wellness powered by biomathematical modeling and AI.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a href="https://twitter.com/biomathcore" aria-label="X / Twitter" className="rounded-lg p-2 transition hover:bg-white/10" target="_blank" rel="noopener noreferrer">
              <svg width="22" height="22" viewBox="0 0 24 24" className="text-sky-400" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-7.6 8.7L23.5 22H16l-5.4-6.9L4.3 22H1l8.3-9.5L.8 2H8l4.9 6.4L18.9 2Zm-2 18h2.2L7.2 4H5Z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/biomathcore/" aria-label="LinkedIn" className="rounded-lg p-2 transition hover:bg-white/10" target="_blank" rel="noopener noreferrer">
              <svg width="22" height="22" viewBox="0 0 24 24" className="text-blue-500" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.98h5V24H0zM8 8.98h4.8v2.05h.07c.67-1.26 2.3-2.6 4.73-2.6 5.06 0 6 3.33 6 7.66V24h-5v-6.42c0-1.53-.03-3.5-2.13-3.5-2.13 0-2.46 1.66-2.46 3.38V24H8z"/></svg>
            </a>
            <a href="https://www.instagram.com/biomathcore/" aria-label="Instagram" className="rounded-lg p-2 transition hover:bg-white/10" target="_blank" rel="noopener noreferrer">
              <svg width="22" height="22" viewBox="0 0 24 24" className="text-pink-500" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.8.07 1.17.07 1.8.25 2.22.42.56.22.96.49 1.38.91.42.42.69.82.91 1.38.17.42.35 1.05.42 2.22.07 1.2.07 1.6.07 4.8s0 3.6-.07 4.8c-.07 1.17-.25 1.8-.42 2.22a3.8 3.8 0 0 1-.91 1.38 3.8 3.8 0 0 1-1.38.91c-.42.17-1.05.35-2.22.42-1.2.07-1.6.07-4.8.07s-3.6 0-4.8-.07c-1.17-.07-1.8-.25-2.22-.42a3.8 3.8 0 0 1-1.38-.91 3.8 3.8 0 0 1-.91-1.38c-.17-.42-.35-1.05-.42-2.22C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.8c.07-1.17.25-1.8.42-2.22.22-.56.49-.96.91-1.38.42-.42.82-.69 1.38-.91.42-.17 1.05-.35 2.22-.42C8.4 2.2 8.8 2.2 12 2.2m0-2.2C8.74 0 8.32 0 7.1.07 5.86.14 4.95.34 4.17.64 3.36.96 2.69 1.4 2.02 2.07.7 3.39.3 4.96.07 7.1 0 8.32 0 8.74 0 12s0 3.68.07 4.9c.23 2.14.63 3.71 1.95 5.03.67.67 1.34 1.11 2.15 1.43.78.3 1.69.5 2.93.57 1.22.07 1.64.07 4.9.07s3.68 0 4.9-.07c1.24-.07 2.15-.27 2.93-.57.81-.32 1.48-.76 2.15-1.43 1.32-1.32 1.72-2.89 1.95-5.03.07-1.22.07-1.64.07-4.9s0-3.68-.07-4.9C23.7 4.96 23.3 3.39 21.98 2.07 21.31 1.4 20.64.96 19.83.64c-.78-.3-1.69-.5-2.93-.57C15.68 0 15.26 0 12 0Z"/><path d="M12 5.8A6.2 6.2 0 1 0 12 18.2 6.2 6.2 0 0 0 12 5.8Zm0 10.2A4 4 0 1 1 12 8a4 4 0 0 1 0 8Zm6.4-10.9a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z"/></svg>
            </a>
            <a href="https://youtube.com/@biomathcore" aria-label="YouTube" className="rounded-lg p-2 transition hover:bg-white/10" target="_blank" rel="noopener noreferrer">
              <svg width="22" height="22" viewBox="0 0 24 24" className="text-red-500" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 0 0 .5 6.2 31.8 31.8 0 0 0 0 12a31.8 31.8 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.8 31.8 0 0 0 24 12a31.8 31.8 0 0 0-.5-5.8zM9.8 15.5v-7l6.3 3.5-6.3 3.5z"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-white">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/investors">Investors</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/connect-devices">Connect Devices</Link></li>
            <li><Link href="/assistant">AI Assistant</Link></li>
            <li><Link href="/member-zone/catalog">Services</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-white">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/legal/privacy">Privacy Policy</Link></li>
            <li><Link href="/legal/terms">Terms of Service</Link></li>
            <li><Link href="/legal/hipaa">HIPAA Notice</Link></li>
            <li><Link href="/legal/data-protection">Data Protection</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-white">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>info@biomathcore.com</li>
            <li>Charlotte, NC 28202, USA</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs leading-relaxed text-gray-400">
            <strong className="text-gray-300">Important Notice:</strong> BioMath Core is a wellness
            management platform, not a medical service. We provide well-being data analytics and an AI tracker
            for improving your well-being and mood, as well as an educational AI health chat. We do not diagnose
            diseases, prescribe medications, replace a professional doctor, or provide medical advice. Always
            consult with a qualified medical professional for health concerns.
          </p>
          <p className="mt-3 text-[11px] text-gray-500">© {year} BioMath Core. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
