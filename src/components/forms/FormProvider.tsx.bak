"use client";
import { createContext, useContext } from "react";
import type { FormTheme } from "./themes";

const ThemeCtx = createContext<FormTheme | null>(null);
export function ThemeProvider({ theme, children }: { theme: FormTheme; children: any }) {
  return <ThemeCtx.Provider value={theme}>{children}</ThemeCtx.Provider>;
}
export function useFormTheme() {
  return useContext(ThemeCtx);
}
