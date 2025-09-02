// @ts-nocheck
import { NextResponse } from "next/server";
import { BLACKBOX_PRESETS } from "@/lib/blackbox/presets";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const slug = body?.slug;
    const preset = BLACKBOX_PRESETS.find(p => p.slug === slug);
    if (!preset) return NextResponse.json({ ok:false, error:"PRESET_NOT_FOUND" }, { status: 400 });

    // Persist a job row if you have a BlackBoxJob model; otherwise store in Report as demo
    let job: any;
    try {
      job = await prisma.blackBoxJob.create({
        data: {
          status: "queued",
          kind: preset.params.kind ?? "custom",
          params: preset.params as any,
        } as any
      });
    } catch {
      // Fallback: create a Report row to simulate job envelope
      job = await prisma.report.create({
        data: { title: `BB Job: ${preset.title}`, content: { preset: preset.slug, status: "queued" } },
      });
    }

    return NextResponse.json({ ok:true, data: job });
  } catch {
    return NextResponse.json({ ok:false, error:"JOB_CREATE_FAILED" }, { status: 500 });
  }
}
