"use client";
import React from "react";
import { useI18n } from "@/lib/i18n";

export type Units = "metric" | "imperial";
export default function UnitsPicker({ value, onChange }:{ value:Units, onChange:(u:Units)=>void }) {
  const { t } = useI18n();
  return (
    <label className="text-sm flex items-center gap-2">
      <span className="text-neutral-400">{t("Units")}</span>
      <select
        className="px-2 py-1 rounded-md border bg-neutral-100 text-neutral-900 border-neutral-300 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
        value={value}
        onChange={(e)=>onChange(e.target.value as Units)}
      >
        <option value="metric">{t("Metric (kg, cm)")}</option>
        <option value="imperial">{t("Imperial (lb, ft/in)")}</option>
      </select>
    </label>
  );
}
