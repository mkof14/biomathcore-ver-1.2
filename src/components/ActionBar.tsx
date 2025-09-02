"use client";
import { ReactNode } from "react";

export default function ActionBar({
  title,
  right,
  className,
}: {
  title: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={"flex items-center justify-between py-2 " + (className ?? "")}>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}
