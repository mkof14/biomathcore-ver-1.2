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

  const cookie = req.headers.get("cookie") || "";
  const parsed = Object.fromEntries(
    cookie.split(/;\s*/).filter(Boolean).map(kv=>{
      const i = kv.indexOf("="); return i===-1 ? [kv,""] : [kv.slice(0,i), decodeURIComponent(kv.slice(i+1))];
    })
  );
  return new Response(JSON.stringify({ ok:true, cookie, parsed }, null, 2), {
    headers: { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store" }
  });
}

export {};
