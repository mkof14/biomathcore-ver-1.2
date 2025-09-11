import JSZip from "jszip";
import { Parser as Json2Csv } from "@json2csv/plainjs";
import { listBlackbox } from "@/lib/repos/blackboxRepo";

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
  const { data } = await listBlackbox({ limit });

  const zip = new JSZip();
  zip.file("blackbox.json", JSON.stringify(data, null, 2));
  const fields = ["id","prompt","response","status","createdAt","updatedAt"];
  const csv = new Json2Csv({ fields }).parse(data);
  zip.file("blackbox.csv", csv);

  const buf = await zip.generateAsync({ type: "nodebuffer" });
  return new Response(buf, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=blackbox-export.zip",
      "Cache-Control": "no-store",
    },
  });
}

export {};
