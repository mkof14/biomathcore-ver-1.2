import { listDrugGene } from "@/lib/repos/drugGeneRepo";
export const runtime = "nodejs";
export async function GET(req: Request) {
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "100", 10);
  const cursor = url.searchParams.get("cursor") || undefined;
  const res = await listDrugGene(limit, cursor);
  return new Response(JSON.stringify({ ok:true, ...res }, null, 2), { headers: { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store" }});
}

export {};
