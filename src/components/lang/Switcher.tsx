"use client";
import React from "react";
import { useLang } from "@/lib/store/lang";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-neutral-400">Language:</span>
      <select
        value={lang}
        onChange={(e)=>setLang(e.target.value as any)}
        className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="ru">Русский</option>
      </select>
    </div>
  );
}
