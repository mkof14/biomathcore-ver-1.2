"use client";
/**
 * ThemePreferences — theme settings block for Member Zone.
 * - Shows current effective theme (dark | light)
 * - Toggle button to switch theme
 * - "Use system theme" button to follow prefers-color-scheme
 * - Persists selection in localStorage ("theme": "dark" | "light" | "system")
 * - Applies 'dark' class to <html> when dark is active
 */

import { useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

function getStoredMode(): ThemeMode | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem("theme");
  if (v === "light" || v === "dark" || v === "system") return v;
  return null;
}

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function ThemePreferences() {
  const [mode, setMode] = useState<ThemeMode>(
    () => getStoredMode() ?? "system",
  );
  const [systemDark, setSystemDark] = useState<boolean>(() =>
    getSystemPrefersDark(),
  );

  // Effective theme: system if mode=system, otherwise explicit
  const effectiveDark = useMemo(() => {
    return mode === "system" ? systemDark : mode === "dark";
  }, [mode, systemDark]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  // Apply theme to <html> and persist
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", effectiveDark);
    window.localStorage.setItem("theme", mode);
  }, [mode, effectiveDark]);

  const currentLabel = useMemo(() => {
    if (mode === "system")
      return systemDark ? "System (Dark)" : "System (Light)";
    return mode === "dark" ? "Dark" : "Light";
  }, [mode, systemDark]);

  const toggleExplicit = () => {
    // flips between explicit light/dark (does not select 'system')
    setMode((m) => (m === "dark" ? "light" : "dark"));
  };

  const useSystem = () => setMode("system");

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Theme Preferences</h2>
          <p className="mt-1 text-sm text-gray-300">
            Choose how the interface looks. You can follow your system
            preference or set a fixed mode.
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-white/10 px-2.5 py-1 text-xs text-gray-200">
          Current: <strong className="ml-1">{currentLabel}</strong>
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={toggleExplicit}
          className="rounded-md px-3 py-2 text-sm text-white bg-white/10 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
          title="Toggle between Light and Dark"
        >
          {effectiveDark ? "Switch to Light" : "Switch to Dark"}
        </button>

        <button
          type="button"
          onClick={useSystem}
          className="rounded-md px-3 py-2 text-sm text-black bg-cyan-300 hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
          title="Follow system preference"
        >
          Use system theme
        </button>

        <span className="text-xs text-gray-400">
          Saved: <code className="bg-black/30 px-1 py-0.5 rounded">{mode}</code>
        </span>
      </div>

      <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3 text-xs text-gray-300">
        <p>
          Effective mode is <strong>{effectiveDark ? "Dark" : "Light"}</strong>.
          When set to <em>System</em>, the app automatically follows your OS
          setting.
        </p>
      </div>
    </section>
  );
}
