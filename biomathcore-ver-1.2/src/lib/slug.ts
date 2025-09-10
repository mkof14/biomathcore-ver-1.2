// src/lib/slug.ts
export function slugify(input: string): string {
  return (input || "")
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 120);
}

export function unslugify(slug: string): string {
  return (slug || "")
    .toString()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w|\s\w/g, (m) => m.toUpperCase());
}
