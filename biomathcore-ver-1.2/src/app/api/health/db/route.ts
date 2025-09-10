import { NextResponse } from "next/server";
import { Client } from "pg";

export async function GET() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL missing" });
  }
  const client = new Client({ connectionString: url, ssl: /sslmode=require/i.test(url) ? { rejectUnauthorized: false } : undefined });
  try {
    await client.connect();
    const r = await client.query("SELECT 1 as ok");
    return NextResponse.json({ ok: r?.rows?.[0]?.ok === 1 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "db error" });
  } finally {
    try { await client.end(); } catch {}
  }
}
