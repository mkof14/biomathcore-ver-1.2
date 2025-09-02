// @ts-nocheck
export const runtime = "nodejs";
export async function GET(req: Request) {
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
