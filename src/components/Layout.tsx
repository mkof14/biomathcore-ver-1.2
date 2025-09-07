import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Notifications from "@/components/Notifications";
import LoadingSpinner from "@/components/LoadingSpinner";

export const metadata: Metadata = {
  title: "BioMath Core Ver 1.2",
  description:
    "Personalized health insights powered by AI across 20 categories and 180 services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans antialiased text-gray-900">
        <Header />
        <LoadingSpinner />
        <main className="flex-grow">{children}</main>
        
        <Notifications />
      </body>
    </html>
  );
}
