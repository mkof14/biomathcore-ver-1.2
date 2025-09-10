"use client";
export default function PulseIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <span className={`relative inline-flex ${className}`} aria-hidden="true">
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 opacity-30 animate-pulse-ring"></span>
      <span className="absolute inset-0 rounded-full border border-violet-400/60 animate-heartbeat"></span>
      <svg viewBox="0 0 48 48" className="relative z-10 h-full w-full">
        <defs>
          <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6"/>
            <stop offset="100%" stopColor="#EC4899"/>
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="20" fill="url(#pulseGrad)" opacity="0.9"/>
        <path d="M8 24h7l3.2-7 5.6 14 3.4-7H40" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}
