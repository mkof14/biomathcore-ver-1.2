"use client";

import React, { useEffect, useMemo, useState } from "react";

// Prices per category (can be tuned later)
const PRICE_MAP: Record<string, number> = {
  "Critical Health": 7,
  "Everyday Wellness": 5,
  "Longevity & Anti-Aging": 7,
  "Mental Wellness": 5,
  "Fitness & Performance": 5,
  "Women’s Health": 6,
  "Men’s Health": 6,
  "Beauty & Skincare": 4,
  "Nutrition & Diet": 4,
  "Sleep & Recovery": 4,
  "Environmental Health": 4,
  "Family Health": 6,
  "Preventive Medicine & Longevity": 6,
  "Biohacking & Performance": 6,
  "Senior Care": 4,
  "Eye-Health Suite": 4,
  "Digital Therapeutics Store": 5,
  "General Sexual Longevity": 6,
  "Men's Sexual Health": 6,
  "Women's Sexual Health": 6,
};

// Base/Core and MAX pricing
const CORE_PRICE = 19;
const MAX_PRICE = 79;

// Soft, light card backgrounds (rotate)
const CARD_BG = [
  "bg-emerald-50 dark:bg-emerald-900/20",
  "bg-sky-50 dark:bg-sky-900/20",
  "bg-amber-50 dark:bg-amber-900/20",
  "bg-violet-50 dark:bg-violet-900/20",
  "bg-rose-50 dark:bg-rose-900/20",
  "bg-lime-50 dark:bg-lime-900/20",
];

type Category = {
  id: string;
  title: string;
  isCoreIncluded?: boolean;
};

type SelectionResp = {
  selected?: { categoryId: string }[];
};

export default function CatalogCategoriesClient() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // fetch categories
  const fetchCategories = async () => {
    try {
      const r = await fetch("/api/catalog/categories", { cache: "no-store" });
      if (!r.ok) throw new Error(`categories ${r.status}`);
      const j = await r.json();
      const cats = (j.categories || []) as Category[];
      setCategories(cats);
    } catch (e: any) {
      setError(`Failed to load categories: ${e?.message || e}`);
    }
  };

  // fetch current selections
  const fetchSelections = async () => {
    try {
      const r = await fetch("/api/user/category-selections", { cache: "no-store" });
      if (!r.ok) {
        // Allow page to render even if not signed in; selections will be empty
        setSelectedIds(new Set());
        return;
      }
      const j = (await r.json()) as SelectionResp;
      const ids = new Set((j.selected || []).map((s) => s.categoryId));
      setSelectedIds(ids);
    } catch {
      setSelectedIds(new Set());
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchCategories(), fetchSelections()]);
      setLoading(false);
    })();
  }, []);

  const toggleCategory = async (cat: Category) => {
    if (cat.isCoreIncluded) return; // Core-included are locked
    setBusy(true);
    setError(null);
    try {
      const already = selectedIds.has(cat.id);
      if (already) {
        // Try DELETE with query param first
        let ok = false;
        try {
          const r = await fetch(`/api/user/category-selections?id=${encodeURIComponent(cat.id)}`, {
            method: "DELETE",
          });
          ok = r.ok;
        } catch {}
        // Fallback: DELETE with body if server expects JSON
        if (!ok) {
          const r2 = await fetch(`/api/user/category-selections`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ categoryId: cat.id }),
          });
          ok = r2.ok;
        }
        if (!ok) throw new Error("remove failed");
        const next = new Set(selectedIds);
        next.delete(cat.id);
        setSelectedIds(next);
      } else {
        // Add selection
        const r = await fetch(`/api/user/category-selections`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryId: cat.id }),
        });
        if (!r.ok) throw new Error("add failed");
        const next = new Set(selectedIds);
        next.add(cat.id);
        setSelectedIds(next);
      }
    } catch (e: any) {
      setError(`Action failed: ${e?.message || e}`);
    } finally {
      setBusy(false);
    }
  };

  // Prices calc
  const { selectedList, selectedSum, coreCount } = useMemo(() => {
    const core = categories.filter((c) => c.isCoreIncluded);
    const nonCoreSelected = categories.filter(
      (c) => !c.isCoreIncluded && selectedIds.has(c.id)
    );
    const sum = nonCoreSelected.reduce((acc, c) => {
      const price = PRICE_MAP[c.title] ?? 5;
      return acc + price;
    }, 0);
    return {
      selectedList: nonCoreSelected,
      selectedSum: sum,
      coreCount: core.length,
    };
  }, [categories, selectedIds]);

  const subtotal = CORE_PRICE + selectedSum;

  const progressPct = useMemo(() => {
    // progress to MAX
    const pct = Math.min(100, Math.round((subtotal / MAX_PRICE) * 100));
    return isFinite(pct) ? pct : 0;
  }, [subtotal]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Catalog</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose service categories to customize your plan. Core plan includes a fixed set of categories.
          You can add more categories below — the calculator updates instantly.
        </p>
      </header>

      {/* MAX banner */}
      {subtotal >= MAX_PRICE && (
        <div className="rounded-2xl border border-orange-300 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                You’re at ${subtotal}/mo — MAX plan may be a better deal.
              </p>
              <p className="text-xs text-orange-700/80 dark:text-orange-300/80">
                MAX includes everything for ${MAX_PRICE}/mo. Consider switching to save.
              </p>
            </div>
            <a
              href="/member-zone/plan"
              className="rounded-xl px-4 py-2 text-sm border border-orange-300 dark:border-orange-700 bg-white/70 dark:bg-orange-950 hover:opacity-90"
            >
              View MAX
            </a>
          </div>
        </div>
      )}

      {/* Calculator */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-900/20 p-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm font-semibold">Your Plan</div>
            <div className="text-xs text-emerald-800 dark:text-emerald-200">
              Core (${CORE_PRICE}/mo) + selected categories
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600 dark:text-gray-400">Core</div>
            <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">${CORE_PRICE}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600 dark:text-gray-400">Added</div>
            <div className="text-lg font-bold text-indigo-700 dark:text-indigo-300">${selectedSum}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
            <div className="text-2xl font-extrabold text-fuchsia-700 dark:text-fuchsia-300">${subtotal}</div>
          </div>
        </div>

        {/* Progress to MAX */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
            <span>Progress to MAX (${MAX_PRICE})</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-200 dark:bg-neutral-800 overflow-hidden">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-indigo-400 to-fuchsia-400"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Categories grid */}
      {loading ? (
        <div className="text-sm opacity-70">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map((c, idx) => {
            const bg = CARD_BG[idx % CARD_BG.length];
            const selected = selectedIds.has(c.id);
            const price = PRICE_MAP[c.title] ?? 5;
            return (
              <div
                key={c.id}
                className={[
                  "rounded-2xl border p-4 transition",
                  bg,
                  "border-gray-200 dark:border-neutral-800",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{c.title}</h3>
                    <div className="mt-1 text-xs">
                      {c.isCoreIncluded ? (
                        <span className="inline-block rounded-full px-2 py-0.5 border bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700">
                          Included in Core
                        </span>
                      ) : selected ? (
                        <span className="inline-block rounded-full px-2 py-0.5 border bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700">
                          Selected
                        </span>
                      ) : (
                        <span className="inline-block rounded-full px-2 py-0.5 border bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-neutral-700">
                          Optional
                        </span>
                      )}
                    </div>
                  </div>
                  {/* price badge (contrasting color) */}
                  {!c.isCoreIncluded && (
                    <div className="text-right">
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">Price</div>
                      <div className="text-lg font-bold text-amber-600 dark:text-amber-300">
                        ${price}
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  Category services are provided in the next step.
                </p>

                <div className="mt-4">
                  <button
                    onClick={() => toggleCategory(c)}
                    disabled={busy || !!c.isCoreIncluded}
                    className={[
                      "text-sm rounded-xl px-3 py-2 border transition",
                      c.isCoreIncluded
                        ? "bg-gray-100 dark:bg-neutral-800 text-gray-500 border-gray-200 dark:border-neutral-700 cursor-not-allowed"
                        : selected
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700 hover:opacity-90"
                        : "bg-white/80 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-neutral-700 hover:bg-white",
                    ].join(" ")}
                  >
                    {c.isCoreIncluded ? "Included" : selected ? "Selected — Remove" : "Select"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
