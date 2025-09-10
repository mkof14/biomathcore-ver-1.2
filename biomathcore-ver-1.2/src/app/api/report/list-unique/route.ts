import { NextResponse } from "next/server";
import { listReports } from "@/lib/report/store";
export const runtime = "nodejs";

function slug(s: string) {
  return String(s||"")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g,"")
    .toLowerCase()
    .replace(/&/g," and ")
    .replace(/[^a-z0-9]+/g," ")
    .trim()
    .replace(/\s+/g,"-");
}

export async function GET() {
  const items = await listReports();
  const pick = new Map<string, { id:string; title:string; type:string; createdAt:string }>();
  for (const i of items) {
    const t = (i.title||"").trim();
    const k = `${slug(t)}::${String(i.type||"core").trim().toLowerCase()}`;
    const cur = pick.get(k);
    if (!cur || String(i.createdAt||"") > String(cur.createdAt||"")) {
      pick.set(k, { id: i.id, title: t, type: i.type||"core", createdAt: i.createdAt });
    }
  }
  return NextResponse.json(Array.from(pick.values()).sort((a,b)=>String(b.createdAt||"").localeCompare(String(a.createdAt||""))));
}
