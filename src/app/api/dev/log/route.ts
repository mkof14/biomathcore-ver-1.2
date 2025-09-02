import { logger } from "@/lib/logger";
export async function GET() {
  logger.info("dev.log ping", { at: new Date().toISOString() });
  return new Response(JSON.stringify({ ok: true }, null, 2), {
    headers: { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store" }
  });
}
