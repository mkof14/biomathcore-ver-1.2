import { NextResponse } from "next/server";
import { createDG } from "@/lib/repos/drugGeneRepo";
import { withLog } from "@/lib/api/log";
export const runtime = "nodejs";

export const POST = withLog(async () => {
  const samples = [
    { drug: "Warfarin", gene: "CYP2C9", status: "done" },
    { drug: "Clopidogrel", gene: "CYP2C19", status: "queued" },
    { drug: "Abacavir", gene: "HLA-B*57:01", status: "done" },
  ];
  for (const s of samples) await createDG(s as any);
  return NextResponse.json({ ok:true, created: samples.length });
}, "dg.dev.seed");
