"use client";
import React from "react";
import { useI18n } from "@/lib/i18n";

const langs = [
  ["en","English"],["ru","Русский"],["es","Español"],["de","Deutsch"],
  ["fr","Français"],["uk","Українська"],["pl","Polski"],["he","עברית"],
  ["ar","العربية"],["hi","हिन्दी"],["zh","中文"]
] as const;

export default function LanguageSelect() {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-neutral-700">{t("forms.patient.ui.language") || "Language"}</span>
      <select
        value={lang}
        onChange={(e)=>setLang(e.target.value as any)}
        className="select-soft w-44"
      >
        {langs.map(([code, label]) => (
          <option key={code} value={code}>{label}</option>
        ))}
      </select>
    </div>
  );
}
