export const runtime = "nodejs";
const boot = Date.now();
export async function GET() {
  const u = Math.floor((Date.now() - boot)/1000);
  return new Response(JSON.stringify({ ok:true, data:{ uptimeSec:u }}), { headers:{ "Content-Type":"application/json" }});
}
