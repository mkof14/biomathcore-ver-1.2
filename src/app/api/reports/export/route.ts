import JSZip from "jszip";
import { Parser as Json2Csv } from "@json2csv/plainjs";
import { listReports } from "@/lib/repos/reportRepo";

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
  const id = url.searchParams.get("id") || undefined;
  const q = url.searchParams.get("q") || undefined;
  const status = url.searchParams.get("status") || undefined;
  const from = url.searchParams.get("from") || undefined;
  const to = url.searchParams.get("to") || undefined;
  const limit = parseInt(url.searchParams.get("limit") || "1000", 10);
  const cursor = url.searchParams.get("cursor") || undefined;

  const { data } = await listReports({ id, q, status, from, to, limit, cursor });

  const zip = new JSZip();
  zip.file("reports.json", JSON.stringify(data, null, 2));
  const fields = ["id","title","content","status","createdAt","updatedAt"];
  const csv = new Json2Csv({ fields }).parse(data);
  zip.file("reports.csv", csv);

  const blob = await zip.generateAsync({ type: "nodebuffer" });
  return new Response(blob, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="reports-export.zip"`,
      "Cache-Control": "no-store",
    },
  });
}

export {};
