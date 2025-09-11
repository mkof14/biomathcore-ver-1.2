export const runtime = "nodejs";
export async function POST(req: Request) {
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

  const body = await req.json().catch(()=>({}));
  const gene = String(body?.gene ?? "").toUpperCase();
  const drug = String(body?.drug ?? "");
  const resp = {
    ok: true,
    query: { gene, drug },
    result: {
      interaction: gene && drug ? "potential-interaction" : "insufficient-input",
      evidenceLevel: "mock",
      advisory: gene && drug
        ? `Use caution combining ${drug} with variants in ${gene}.`
        : "Provide both 'gene' and 'drug'."
    }
  };
  return new Response(JSON.stringify(resp, null, 2), { headers:{ "Content-Type":"application/json" }});
}

export {};
