import JSZip from "jszip";
import { Parser as Json2Csv } from "@json2csv/plainjs";
import { listDevices } from "@/lib/repos/deviceRepo";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "1000", 10);
  const { data } = await listDevices({ limit });

  const zip = new JSZip();
  zip.file("devices.json", JSON.stringify(data, null, 2));
  const fields = ["id","provider","label","status","createdAt","updatedAt"];
  const csv = new Json2Csv({ fields }).parse(data);
  zip.file("devices.csv", csv);

  const buf = await zip.generateAsync({ type: "nodebuffer" });
  return new Response(buf, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=devices-export.zip",
      "Cache-Control": "no-store",
    },
  });
}
