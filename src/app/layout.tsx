import { DarkModeProvider } from "@/context/DarkModeContext";
import AppHeader from "@/components/Header.tsx";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import "./globals.css";
import PulseDock from "@/components/ai/PulseDock";

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
        <Footer /><PulseDock />
    </body>
    </html>
  );
}
