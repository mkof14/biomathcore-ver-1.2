"use client";
import React from "react";
import { getLang, setLang, type UILang } from "@/lib/i18n-ui";

const langs: UILang[] = ["en","ru","es"];

export default function LanguageSwitcherFixed() {
  const [mounted, setMounted] = React.useState(false);
  const [lang, setL] = React.useState<UILang>("en");

  React.useEffect(() => {
    setL(getLang());
    setMounted(true);
  }, []);

  if (!mounted) return null; // защита от hydration mismatch

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value as UILang;
    setL(v);
    setLang(v);
    window.location.reload();
  }

  return (
    <div
      suppressHydrationWarning
      className="fixed top-3 right-3 z-50 rounded-md border border-neutral-700 bg-neutral-900/80 backdrop-blur px-2 py-1"
    >
      <select
        value={lang}
        onChange={onChange}
        className="h-8 rounded-md border border-neutral-700 bg-neutral-800/60 text-neutral-100 px-2"
        aria-label="Language"
        title="Language"
      >
        {langs.map((l) => (
          <option key={l} value={l}>{l.toUpperCase()}</option>
        ))}
      </select>
    </div>
  );
}
