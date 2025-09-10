export const runtime = "nodejs";
export async function POST() {
  return new Response(JSON.stringify({ ok: true, created: true, id: crypto.randomUUID?.() ?? String(Date.now()) }), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}
