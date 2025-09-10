// @ts-nocheck
export const runtime = "nodejs";
export async function POST(req: Request) {
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
