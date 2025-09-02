// src/app/api/blackbox/analyze/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let text = "";
    let filename: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (file && typeof file !== "string") {
        filename = file.name || "upload.bin";
        // In placeholder we don't read file content
      }
      const pasted = form.get("text");
      if (pasted && typeof pasted === "string") {
        text = pasted.slice(0, 2000);
      }
    } else if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      text = (body?.text || "").toString().slice(0, 2000);
    }

    // Simulated result
    const jobId = `job_${Date.now()}`;
    const summary = text
      ? `Received ${text.length} characters${filename ? ` + file "${filename}"` : ""}.`
      : filename
        ? `Received file "${filename}".`
        : "No content.";
    const score = Math.round(Math.random() * 100);

    return NextResponse.json({
      ok: true,
      result: { jobId, summary, score },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
