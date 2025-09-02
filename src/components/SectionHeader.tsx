"use client";
import React from "react";

export default function SectionHeader({
  title,
  desc,
  right,
}: {
  title: string;
  desc?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="text-neutral-50 mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-neutral-50 text-3xl md:text-4xl font-semibold tracking-tight">{title}</h1>
        {desc ? <p className="text-neutral-50 mt-1 text-sm text-neutral-300 max-w-2xl">{desc}</p> : null}
      </div>
      {right ? <div className="text-neutral-50 shrink-0">{right}</div> : null}
    </div>
  );
}
