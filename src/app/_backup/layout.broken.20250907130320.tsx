import FooterClassic from "@/components/FooterClassic";
import { I18nProvider } from "@/lib/i18n";
import RouteBack from "@/components/common/RouteBack";
// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { DarkModeProvider } from "@/context/DarkModeContext";
import FloatingAiWidget from "@/components/FloatingAiWidget";

/**
 * RootLayout
 * - Server component wrapper that hosts client DarkModeProvider
 * - We don't read theme on the server; the provider sets "dark" on <html> on mount
 * - suppressHydrationWarning avoids mismatch for class on <html>
 */

export const metadata: Metadata = {
  title: "BioMath Core",
  description:
    "BioMath Core — predictive insights and personalized wellness powered by biomathematical modeling and AI.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  metadataBase: new URL("https://biomathcore.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* "dark" class will be toggled by DarkModeProvider (client) */}
      <body className="min-h-dvh antialiased bg-[var(--bg-dark)] text-[var(--fg-dark)]">
      <I18nProvider>
        <DarkModeProvider>
          {/* Skip link for a11y */}
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>

          {/* Global header (fixed) */}
          <Header />
            <RouteBack />

          {/* Main content (offset for fixed header height) */}
          <main id="main-content" className="pt-16">
            {children}
          </main>

          {/* Floating Pulse AI on all pages */}
          <FloatingAiWidget />

          {/* Global footer */}
          
        </DarkModeProvider>
            </I18nProvider>
            <FooterClassic />