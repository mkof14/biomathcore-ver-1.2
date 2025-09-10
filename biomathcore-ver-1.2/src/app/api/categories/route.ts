// src/app/api/categories/route.ts
import { NextResponse } from "next/server";
import allCategories from "@/components/data/allCategories";
import { slugify } from "@/lib/slug";

type ApiCategory = {
  slug: string;
  name: string;
  blurb: string;
  iconKey: string | null; // Home page safely falls back to Stars if null
};

export async function GET() {
  // Single source of truth: derive categories from allCategories
  const categories: ApiCategory[] = (allCategories || []).map((c: any) => ({
    slug: slugify(c?.name ?? ""),
    name: c?.name ?? "",
    blurb:
      c?.description ??
      "Explore a curated set of services tailored to your goals.",
    // We don’t depend on DB icon mapping here; Home safely defaults if null.
    iconKey: null,
  }));

  return NextResponse.json(
    { ok: true, categories },
    { status: 200, headers: { "cache-control": "public, max-age=300" } },
  );
}
