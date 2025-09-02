"use client";
import React from "react";
import { getLang } from "@/lib/i18n-ui";

const langs = ["en","ru","es"] as const;

export default function LanguageSwitcher() {
  const [cur, setCur] = React.useState(getLang());

  const setLang = (l: typeof langs[number]) => {
    localStorage.setItem("bm_lang", l);
    const u = new URL(window.location.href);
    u.searchParams.set("lang", l);
    window.location.href = u.toString();
  };

  return (
    <div className="flex gap-2">
      {langs.map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2 py-1 rounded border text-xs ${
            cur === l
              ? "bg-white text-black border-white"
              : "bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700"
          }`}
          title={`Switch to ${l.toUpperCase()}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
