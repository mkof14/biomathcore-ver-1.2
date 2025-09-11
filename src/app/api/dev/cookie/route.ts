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
  const userId = (typeof body?.userId === "string" && body.userId.trim()) || "dev-user-001";
  const payload = JSON.stringify({ ok:true, userId });
  return new Response(payload, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Set-Cookie": `bmc_dev_user=${encodeURIComponent(userId)}; Path=/; Max-Age=${60*60*24*7}; SameSite=Lax`,
    },
  });
}

export {};
