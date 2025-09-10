"use client";
import { ReactNode } from "react";
import { DarkModeProvider } from "@/context/DarkModeContext";
export default function ClientProviders({ children }: { children: ReactNode }) {
  return <DarkModeProvider>{children}</DarkModeProvider>;
}
