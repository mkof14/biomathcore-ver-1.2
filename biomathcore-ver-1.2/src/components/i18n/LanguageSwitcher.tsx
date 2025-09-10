"use client";
import React from "react";
import { getLang, setLang } from "@/lib/i18n-ui";

export default function LanguageSwitcher() {
  const [lang, set] = React.useState(getLang());

  React.useEffect(() => {
    const h = () => set(getLang());
    window.addEventListener("bm-lang-change", h);
    return () => window.removeEventListener("bm-lang-change", h);
  }, []);

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as any)}
      className="h-9 rounded-md border border-neutral-700 bg-neutral-900/70 text-white px-2"
      aria-label="Language"
      title="Language"
    >
      <option value="en">EN</option>
      <option value="ru">RU</option>
      <option value="es">ES</option>
    </select>
  );
}
