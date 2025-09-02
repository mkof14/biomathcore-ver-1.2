"use client";
import { jsPDF } from "jspdf";

async function fetchReport(id: string) {
  const r = await fetch(`/api/reports/${encodeURIComponent(id)}`, { cache:"no-store" });
  const j = await r.json();
  if (!j?.ok) throw new Error("Failed to load report");
  return j.data;
}

function toCSV(obj: any): string {
  if (!obj || typeof obj !== "object") return "key,value\nvalue,\n";
  const entries = Object.entries(obj);
  const head = "key,value";
  const rows = entries.map(([k,v]) => {
    let val = typeof v === "object" ? JSON.stringify(v) : String(v ?? "");
    val = `"${val.replace(/"/g,'""')}"`;
    return `${k},${val}`;
  });
  return [head, ...rows].join("\n");
}

function downloadBlob(name: string, mime: string, data: BlobPart) {
  const b = new Blob([data], { type: mime });
  const url = URL.createObjectURL(b);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function ExportButtons({ id }: { id: string }) {
  async function onCSV() {
    const rep = await fetchReport(id);
    const title = rep?.title || id;
    const csv = toCSV(rep?.content ?? rep);
    downloadBlob(`${title}.csv`, "text/csv;charset=utf-8", csv);
  }
  async function onPDF() {
    const rep = await fetchReport(id);
    const title = rep?.title || id;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFontSize(14);
    doc.text(String(title), 40, 50);
    doc.setFontSize(10);
    const text = JSON.stringify(rep?.content ?? rep, null, 2);
    const lines = doc.splitTextToSize(text, 515);
    doc.text(lines, 40, 80);
    const blob = doc.output("blob");
    downloadBlob(`${title}.pdf`, "application/pdf", blob);
  }
  return (
    <div style={{ display:"inline-flex", gap:6 }}>
      <button onClick={onCSV} style={{ padding:"4px 8px", border:"1px solid #ddd", borderRadius:6, cursor:"pointer", background:"white" }}>CSV</button>
      <button onClick={onPDF} style={{ padding:"4px 8px", border:"1px solid #ddd", borderRadius:6, cursor:"pointer", background:"white" }}>PDF</button>
    </div>
  );
}
