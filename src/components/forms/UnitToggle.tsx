"use client";
import React from "react";

type Unit = { value: string; label: string };
type Props = {
  units: Unit[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
};

export default function UnitToggle({ units, value, onChange, className }: Props) {
  return (
    <div className={`inline-flex gap-2 ${className ?? ""}`}>
      {units.map((u) => (
        <button
          key={u.value}
          type="button"
          onClick={() => onChange(u.value)}
          className={`px-3 py-1 rounded-md border text-sm ${
            value === u.value
              ? "bg-gray-700 text-white dark:bg-gray-200 dark:text-black border-transparent"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-transparent"
          }`}
        >
          {u.label}
        </button>
      ))}
    </div>
  );
}
