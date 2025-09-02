// src/app/data/servicesData.ts

import allCategoriesRaw from "@/components/data/allCategories";
import { slugify } from "@/lib/slug";

export type Service = {
  id?: string;
  title: string;
  icon?: string;
  description?: string;
  plan?: "free" | "premium" | string;
};

export type Category = {
  name: string;
  color?: string;
  icon?: string;
  description?: string;
  services: Service[];
};

export const allCategories = allCategoriesRaw as Category[];


export function findServiceBySlug(slug: string) {
  const needle = decodeURIComponent(slug).toLowerCase();

  for (const category of allCategories) {
    for (const s of category.services ?? []) {
      const byId = (s.id ?? "").toLowerCase();
      const byTitleSlug = slugify(s.title ?? "").toLowerCase();

      if (needle === byId || needle === byTitleSlug) {
        return { category, service: s };
      }
    }
  }
  return null;
}

export default allCategories;
