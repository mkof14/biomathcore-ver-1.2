"use client";
import Link from "next/link";
export default function BackButton({ href = "/member-zone/questionnaires" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center px-4 py-2 rounded-2xl border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      ← Back
    </Link>
  );
}
