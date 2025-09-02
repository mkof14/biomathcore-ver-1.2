"use client";
import React, { useEffect, useState } from "react";
import { useLang } from "@/lib/store/lang";
import Link from "next/link";

type Item = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  visibility: "PUBLIC"|"INVITE_ONLY"|"PLAN_GATED";
  gates: string[];
  sensitive: boolean;
  anonymousAllowed: boolean;
};

export default function AdminForms() {
  const { lang } = useLang();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/forms/list?admin=1&lang=${lang}`, { cache: "no-store" })
      .then(r=>r.json()).then(j=>setItems(j.data || []))
      .finally(()=>setLoading(false));
  }, [lang]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold text-white">All Forms (Admin)</h1>
      {loading && <div className="text-sm text-neutral-400">Loading…</div>}
      {!loading && (
        <div className="grid gap-3">
          {items.map((x) => (
            <div key={x.id} className="rounded-lg border border-neutral-300 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-medium text-neutral-900">{x.title}</div>
                  <div className="text-xs text-neutral-500">
                    {x.category || "—"} · {x.visibility}{x.sensitive ? " · sensitive" : ""}
                  </div>
                </div>
                <Link href={`/member-zone/forms/${x.slug}`} className="px-3 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-500">
                  Open
                </Link>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-sm text-neutral-500">No forms.</div>}
        </div>
      )}
    </div>
  );
}
