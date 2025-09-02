// @ts-nocheck
export async function searchReports(params: {
  q?: string; from?: string; to?: string; limit?: number; sort?: string;
}) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.from) sp.set("from", params.from);
  if (params.to) sp.set("to", params.to);
  if (params.limit) sp.set("limit", String(params.limit));
  if (params.sort) sp.set("sort", params.sort);
  const r = await fetch(`/api/reports/search?${sp.toString()}`, { cache: "no-store" });
  return r.json();
}
