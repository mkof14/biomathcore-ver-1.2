"use client";
import { useEffect, useState } from "react";

/* Простые inline SVG без зависимостей */
function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        d="M12 4V2m0 20v-2M4 12H2m20 0h-2M5 5 3.6 3.6M20.4 20.4 19 19M19 5l1.4-1.4M3.6 20.4 5 19" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  );
}
function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        d="M21 12.79A9 9 0 1 1 11.21 3c.18 0 .36.01.54.02A7 7 0 0 0 21 12.25c0 .18-.01.36-.02.54z" />
    </svg>
  );
}

/**
 * Переключатель темы (иконкой). Сохраняет выбор в localStorage.
 * При первой загрузке берёт system prefers-color-scheme.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark"|"light">("dark");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("adminTheme")) as "dark"|"light"|null;
    const systemDark = typeof window !== "undefined"
      && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial = stored || (systemDark ? "dark" : "light");
    setTheme(initial);
    document.querySelector<HTMLElement>(".admin-theme")?.setAttribute("data-theme", initial);
  }, []);

  function apply(next: "dark"|"light") {
    setTheme(next);
    localStorage.setItem("adminTheme", next);
    document.querySelector<HTMLElement>(".admin-theme")?.setAttribute("data-theme", next);
  }

  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className="btn btn-ghost btn-icon"
      aria-label={`Switch to ${next} theme`}
      title={theme === "dark" ? "Light theme" : "Dark theme"}
      onClick={() => apply(next)}
    >
      {theme === "dark" ? <SunIcon width={18} height={18}/> : <MoonIcon width={18} height={18}/>}
    </button>
  );
}
