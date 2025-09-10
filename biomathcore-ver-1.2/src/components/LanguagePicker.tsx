"use client";
import React from "react";
import { useI18n } from "@/lib/i18n";

const langs = [
  { code:"en", label:"English" },
  { code:"ru", label:"Русский" },
  { code:"es", label:"Español" },
  { code:"de", label:"Deutsch" },
  { code:"fr", label:"Français" },
  { code:"uk", label:"Українська" },
  { code:"pt", label:"Português" },
  { code:"it", label:"Italiano" },
] as const;

export default function LanguagePicker() {
  const { locale, setLocale, t } = useI18n();
  return (
    <label className="text-sm flex items-center gap-2">
      <span className="text-neutral-400">{t("Language")}</span>
      <select
        className="px-2 py-1 rounded-md border bg-neutral-100 text-neutral-900 border-neutral-300 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
        value={locale}
        onChange={(e)=>setLocale(e.target.value as any)}
      >
        {langs.map(l=> <option key={l.code} value={l.code}>{l.label}</option>)}
      </select>
    </label>
  );
}
