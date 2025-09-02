"use client";
import "./forms.css";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { tUI } from "@/lib/i18n-ui";

type Item = { slug: string; title: string; category?: string };

export default function FormsListPage() {
  const search = useSearchParams();
  const admin = search.get("admin") === "1";
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const q = admin ? "?admin=1" : "";
    fetch(`/api/forms/list${q}`)
      .then(r => r.json())
      .then(j => setItems(j?.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [admin]);

  return (
    <div className="forms-root min-h-[60vh] px-4 py-6">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">{tUI("Patient Forms")}</h1>
          <div className="flex items-center gap-3">
            {admin && (
              <span className="text-xs px-2 py-1 rounded bg-amber-600/20 text-amber-300 border border-amber-600/40">
                Admin mode
              </span>
            )}
            <LanguageSwitcher />
          </div>
        <div className="ml-auto"><LanguageSwitcher /></div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-sm text-neutral-300">{tUI("Loading…")}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((x) => (
              <div
                key={x.slug}
                className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 hover:bg-neutral-900"
              >
                <div className="text-base font-medium text-white mb-2">{x.title || x.slug}</div>
                <div className="text-xs text-neutral-400 mb-4">{x.category || "General"}</div>
                <Link
                  href={`/member-zone/forms/${x.slug}${admin ? "?admin=1" : ""}`}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-violet-600 text-white px-4 hover:bg-violet-500"
                >
                  {tUI("Open")}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
