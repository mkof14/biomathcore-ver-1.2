import JSZip from "jszip";
import { Parser as Json2Csv } from "@json2csv/plainjs";
import { listReports } from "@/lib/repos/reportRepo";
import { listVoiceJobs } from "@/lib/repos/voiceRepo";
import { listDrugGene } from "@/lib/repos/drugGeneRepo";

export const runtime = "nodejs";

export async function GET() {
  const zip = new JSZip();

  // reports
  const rep = await listReports({ limit: 1000 });
  zip.file("reports/reports.json", JSON.stringify(rep.data, null, 2));
  zip.file("reports/reports.csv", new Json2Csv({ fields: ["id","title","status","createdAt","updatedAt"] }).parse(rep.data));

  // voice
  const voice = await listVoiceJobs(1000);
  zip.file("voice/jobs.json", JSON.stringify(voice.data, null, 2));
  zip.file("voice/jobs.csv", new Json2Csv({ fields: ["id","text","status","createdAt","updatedAt"] }).parse(voice.data));

  // drug-gene
  const dg = await listDrugGene(1000);
  zip.file("drug-gene/list.json", JSON.stringify(dg.data, null, 2));
  zip.file("drug-gene/list.csv", new Json2Csv({ fields: ["id","drug","gene","effect","createdAt","updatedAt"] }).parse(dg.data));

  // health snapshot
  const health = {
    name: "biomath-core",
    collectedAt: new Date().toISOString(),
    counts: {
      reports: rep.data.length,
      voiceJobs: voice.data.length,
      drugGene: dg.data.length,
    },
  };
  zip.file("health.json", JSON.stringify(health, null, 2));

  const blob = await zip.generateAsync({ type: "nodebuffer" });
  return new Response(blob, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="all-export.zip"',
      "Cache-Control": "no-store",
    },
  });
}

export {};
