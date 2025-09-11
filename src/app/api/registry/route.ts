import { NextResponse } from "next/server";
import { QUESTIONNAIRE_REGISTRY } from "@/lib/questionnaire/registry";

export async function GET() {
  const items = Object.values(QUESTIONNAIRE_REGISTRY).map((q) => ({
    id: q.id,
    title: q.title,
    version: q.version,
    description: q.description ?? "",
  }));
  return NextResponse.json({ ok: true, items });
}

export {};
