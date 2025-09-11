import JSZip from "jszip";
import { Parser as Json2Csv } from "@json2csv/plainjs";
import { listVoice } from "@/lib/repos/voiceRepo";
export const runtime = "nodejs";
export async function GET(req: Request) {
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "1000", 10);
  const { data } = await listVoice({ limit });
  const zip = new JSZip();
  zip.file("voice.json", JSON.stringify(data, null, 2));
  const csv = new Json2Csv({ fields: Object.keys(data[0] || {}) }).parse(data);
  zip.file("voice.csv", csv);
  const blob = await zip.generateAsync({ type: "nodebuffer" });
  return new Response(blob, {
    headers: { "Content-Type":"application/zip", "Content-Disposition":'attachment; filename="voice-export.zip"' }
  });
}

export {};
