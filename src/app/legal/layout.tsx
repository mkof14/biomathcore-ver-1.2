// src/app/legal/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal | BioMath Core",
  robots: { index: true, follow: true },
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-white text-gray-900">{children}</div>;
}
