import JSZip from "jszip";
import { Parser as Json2Csv } from "@json2csv/plainjs";
import { listAI } from "@/lib/repos/aiRepo";
export const runtime = "nodejs";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "1000", 10);
  const { data } = await listAI({ limit });
  const zip = new JSZip();
  zip.file("ai.json", JSON.stringify(data, null, 2));
  const csv = new Json2Csv({ fields: Object.keys(data[0] || {}) }).parse(data);
  zip.file("ai.csv", csv);
  const blob = await zip.generateAsync({ type: "nodebuffer" });
  return new Response(blob, {
    headers: { "Content-Type":"application/zip", "Content-Disposition":'attachment; filename="ai-export.zip"' }
  });
}
