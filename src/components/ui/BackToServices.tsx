"use client";
import Link from "next/link";

type Props = {
  className?: string;
  label?: string;
  href?: string;
};

export default function BackToServices({
  className = "",
  label = "Back to Services",
  href = "/services",
}: Props) {
  return (
    <Link
      href={href}
      prefetch
      className={`inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-white/10 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10 transition ${className}`}
    >
      <span aria-hidden>←</span>
      <span>{label}</span>
    </Link>
  );
}
