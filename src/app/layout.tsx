import ChatDock from "@/components/ai/ChatDock";
import { DarkModeProvider } from "@/context/DarkModeContext";
import AppHeader from "@/components/Header.tsx";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BioMath Core",
  description: "Numerical intelligence for life sciences",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
      <AppHeader />
              <DarkModeProvider><main className="pt-24">{children}</main></DarkModeProvider>
        <Footer />
        <ChatDock />
    <PulseDock />
    </body>
    </html>
  );
}

import PulseDock from "@/components/ai/PulseDock";
