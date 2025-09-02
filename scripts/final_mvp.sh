#!/usr/bin/env bash
set -euo pipefail

npm i -E jszip @json2csv/plainjs uuid lucide-react jspdf >/dev/null

mkdir -p src/lib/repos
mkdir -p src/app/api/reports/export
mkdir -p src/app/api/reports/[id]
mkdir -p src/app/api/dev/cookie
mkdir -p src/app/api/dev/echo-cookies
mkdir -p src/app/api/voice/health
mkdir -p src/app/api/drug-gene/health
mkdir -p src/app/member-zone/reports/[id]
mkdir -p src/components
mkdir -p .data

cat > src/lib/repos/reportRepo.ts <<'TS'
// @ts-nocheck
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

export type Report = {
  id: string;
  title: string;
  status: "draft"|"ready"|"archived";
  content?: string;
  createdAt: string;
  updatedAt: string;
};

const STORE = path.join(process.cwd(), ".data", "reports.json");

function load(): Report[] {
  try {
    const s = fs.readFileSync(STORE, "utf8");
    const arr = JSON.parse(s);
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}
function save(arr: Report[]) {
  fs.mkdirSync(path.dirname(STORE), { recursive: true });
  fs.writeFileSync(STORE, JSON.stringify(arr, null, 2), "utf8");
}

export async function listReports(opts: {
  id?: string; q?: string; status?: string; from?: string; to?: string;
  limit?: number; cursor?: string | null;
} = {}) {
  const { id, q, status, from, to } = opts || {};
  const limit = Math.max(1, Math.min(1000, Number(opts?.limit ?? 50)));
  let data = load();
  if (id) data = data.filter(r => r.id === id);
  if (q) {
    const s = q.toLowerCase();
    data = data.filter(r =>
      r.title.toLowerCase().includes(s) ||
      (r.content || "").toLowerCase().includes(s)
    );
  }
  if (status) data = data.filter(r => r.status === status);
  if (from) data = data.filter(r => r.createdAt >= from);
  if (to) data = data.filter(r => r.createdAt <= to);
  data.sort((a,b) => (a.createdAt < b.createdAt ? 1 : -1));
  const slice = data.slice(0, limit);
  return { data: slice, nextCursor: null as any };
}

export async function createReport(input: { title: string; status?: Report["status"]; content?: string }) {
  const all = load();
  const now = new Date().toISOString();
  const row: Report = {
    id: randomUUID(),
    title: (input.title || "Untitled").slice(0, 200),
    status: (input.status || "draft"),
    content: input.content || "",
    createdAt: now,
    updatedAt: now,
  };
  all.unshift(row);
  save(all);
  return row;
}

export async function getReport(id: string) {
  const all = load();
  return all.find(r => r.id === id) || null;
}

export async function updateReport(id: string, patch: Partial<Pick<Report,"title"|"status"|"content">>) {
  const all = load();
  const i = all.findIndex(r => r.id === id);
  if (i === -1) throw new Error("not_found");
  const now = new Date().toISOString();
  all[i] = {
    ...all[i],
    title: patch.title ?? all[i].title,
    status: (patch.status as any) ?? all[i].status,
    content: (patch.content as any) ?? all[i].content,
    updatedAt: now,
  };
  save(all);
  return all[i];
}

export async function deleteReport(id: string) {
  const all = load();
  const i = all.findIndex(r => r.id === id);
  if (i === -1) throw new Error("not_found");
  const row = all[i];
  all.splice(i,1);
  save(all);
  return row;
}
TS

cat > src/app/api/reports/route.ts <<'TS'
// @ts-nocheck
import { NextResponse } from "next/server";
import { listReports, createReport } from "@/lib/repos/reportRepo";

function ok(d:any){return NextResponse.json({ok:true, data:d});}
function bad(m:string,c=400){return NextResponse.json({ok:false,error:m},{status:c});}
export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") || undefined;
  const q = url.searchParams.get("q") || undefined;
  const status = url.searchParams.get("status") || undefined;
  const from = url.searchParams.get("from") || undefined;
  const to = url.searchParams.get("to") || undefined;
  const limit = parseInt(url.searchParams.get("limit") || "50", 10);
  const cursor = url.searchParams.get("cursor") || undefined;
  const out = await listReports({ id, q, status, from, to, limit, cursor });
  return ok(out.data);
}

export async function POST(req: Request) {
  const body = await req.json().catch(()=>null);
  if (!body || typeof body !== "object") return bad("invalid_body");
  if (!body.title || typeof body.title !== "string") return bad("title_required");
  const row = await createReport({ title: body.title, status: body.status, content: body.content });
  return ok(row);
}
TS

cat > src/app/api/reports/[id]/route.ts <<'TS'
// @ts-nocheck
import { NextResponse } from "next/server";
import { getReport, updateReport, deleteReport } from "@/lib/repos/reportRepo";
function ok(d:any){return NextResponse.json({ok:true, data:d});}
function nf(){return NextResponse.json({ok:false, error:"not_found"},{status:404});}
function bad(m:string,c=400){return NextResponse.json({ok:false,error:m},{status:c});}
export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { id: string }}) {
  const r = await getReport(params.id);
  if (!r) return nf();
  return ok(r);
}
export async function PATCH(req: Request, { params }: { params: { id: string }}) {
  const body = await req.json().catch(()=>null);
  if (!body || typeof body !== "object") return bad("invalid_body");
  try { const r = await updateReport(params.id, body); return ok(r); } catch { return nf(); }
}
export async function DELETE(_req: Request, { params }: { params: { id: string }}) {
  try { const r = await deleteReport(params.id); return ok({ id:r.id, deleted:true }); } catch { return nf(); }
}
TS

cat > src/app/api/reports/export/route.ts <<'TS'
// @ts-nocheck
import JSZip from "jszip";
import { Parser as Json2Csv } from "@json2csv/plainjs";
import { listReports } from "@/lib/repos/reportRepo";
export const runtime = "nodejs";

export async function GET(req: Request) {
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
  const fields = ["id","title","status","createdAt","updatedAt"];
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
TS

cat > src/app/api/dev/cookie/route.ts <<'TS'
// @ts-nocheck
export const runtime = "nodejs";
export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const userId = (typeof body?.userId === "string" && body.userId.trim()) || "dev-user-001";
  const payload = JSON.stringify({ ok:true, userId });
  return new Response(payload, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Set-Cookie": `bmc_dev_user=${encodeURIComponent(userId)}; Path=/; Max-Age=${60*60*24*7}; SameSite=Lax`,
    },
  });
}
TS

cat > src/app/api/dev/echo-cookies/route.ts <<'TS'
// @ts-nocheck
export const runtime = "nodejs";
export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const parsed = Object.fromEntries(
    cookie.split(/;\s*/).filter(Boolean).map(kv=>{
      const i = kv.indexOf("="); return i===-1 ? [kv,""] : [kv.slice(0,i), decodeURIComponent(kv.slice(i+1))];
    })
  );
  return new Response(JSON.stringify({ ok:true, cookie, parsed }, null, 2), {
    headers: { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store" }
  });
}
TS

cat > src/app/api/voice/health/route.ts <<'TS'
// @ts-nocheck
export const runtime = "nodejs";
export async function GET() {
  return new Response(JSON.stringify({ ok:true, service:"voice", status:"green" }), {
    headers: { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store" }
  });
}
TS

cat > src/app/api/drug-gene/health/route.ts <<'TS'
// @ts-nocheck
export const runtime = "nodejs";
export async function GET() {
  return new Response(JSON.stringify({ ok:true, service:"drug-gene", status:"green" }), {
    headers: { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store" }
  });
}
TS

cat > src/components/EndpointBadge.tsx <<'TS'
"use client";
// @ts-nocheck
import Link from "next/link";
import { useState } from "react";
import { Copy, ArrowUpRight, Check } from "lucide-react";

export default function EndpointBadge({ path, className }: { path: string; className?: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(path);
      setDone(true);
      setTimeout(()=>setDone(false), 1200);
    } catch {}
  }
  return (
    <div className={"inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm bg-neutral-900/40 border-neutral-700 " + (className ?? "")}>
      <Link href={path} target="_blank" className="font-mono underline underline-offset-2 hover:opacity-90" title="Open in new tab">
        {path}
      </Link>
      <Link href={path} target="_blank" aria-label="Open">
        <ArrowUpRight className="h-4 w-4 opacity-70 hover:opacity-100" />
      </Link>
      <button onClick={copy} className="ml-1 opacity-80 hover:opacity-100" aria-label="Copy URL" title="Copy full URL">
        {done ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}
TS

cat > src/components/ActionBar.tsx <<'TS'
"use client";
// @ts-nocheck
import { ReactNode } from "react";
import Link from "next/link";

export default function ActionBar({
  title, extra, onCreate
}: {
  title: string;
  extra?: ReactNode;
  onCreate?: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        {extra}
        {onCreate && (
          <button onClick={onCreate} className="px-3 py-1 rounded border border-neutral-700 hover:bg-neutral-800">
            Create sample
          </button>
        )}
        <Link href="/api/reports/export?limit=1000" className="px-3 py-1 rounded border border-neutral-700 hover:bg-neutral-800">
          Export ZIP
        </Link>
      </div>
    </div>
  );
}
TS

cat > src/app/member-zone/reports/page.tsx <<'TS'
"use client";
// @ts-nocheck
import { useEffect, useState } from "react";
import Link from "next/link";
import ActionBar from "@/components/ActionBar";
import EndpointBadge from "@/components/EndpointBadge";

type Row = { id:string; title:string; status:string; createdAt:string; updatedAt:string; };

export default function ReportsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/reports?limit=50");
      const j = await res.json().catch(()=>({}));
      const arr = Array.isArray(j?.data) ? j.data : [];
      setRows(arr);
    } finally { setLoading(false); }
  }
  useEffect(()=>{ load(); }, []);

  async function createSample() {
    await fetch("/api/reports", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ title:"Sample report", status:"draft", content:"Hello world" })
    });
    await load();
  }

  return (
    <div className="p-6">
      <ActionBar
        title="Reports"
        onCreate={createSample}
        extra={<EndpointBadge path="/api/reports" />}
      />
      <div className="rounded border border-neutral-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900/40">
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Created</th>
              <th className="p-2 text-left w-[120px]">Open</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: Row) => (
              <tr className="odd:bg-black even:bg-neutral-900/30" key={r.id}>
                <td className="p-2 border border-neutral-900">{r.title}</td>
                <td className="p-2 border border-neutral-900">{r.status}</td>
                <td className="p-2 border border-neutral-900">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="p-2 border border-neutral-900">
                  <Link className="underline" href={`/member-zone/reports/${r.id}`}>open</Link>
                </td>
              </tr>
            ))}
            {!rows.length && !loading && (
              <tr><td className="p-3 text-neutral-500" colSpan={4}>No items.</td></tr>
            )}
            {loading && (
              <tr><td className="p-3 text-neutral-400" colSpan={4}>Loading…</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
TS

cat > src/app/member-zone/reports/[id]/page.tsx <<'TS'
"use client";
// @ts-nocheck
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ActionBar from "@/components/ActionBar";
import EndpointBadge from "@/components/EndpointBadge";

type Row = { id:string; title:string; status:"draft"|"ready"|"archived"; content?:string; createdAt:string; updatedAt:string; };

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [row, setRow] = useState<Row|null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    const res = await fetch(`/api/reports/${id}`);
    const j = await res.json().catch(()=>({}));
    setRow(j?.data || null);
  }
  useEffect(()=>{ load(); }, [id]);

  async function save() {
    if (!row) return;
    setSaving(true);
    setErr("");
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method:"PATCH", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ title: row.title, status: row.status, content: row.content || "" })
      });
      if (!res.ok) throw new Error("save_fail");
      await load();
    } catch(e:any) { setErr(String(e?.message||e)); }
    finally { setSaving(false); }
  }
  async function removeIt() {
    if (!row) return;
    await fetch(`/api/reports/${id}`, { method:"DELETE" });
    router.push("/member-zone/reports");
  }

  if (!row) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6">
      <ActionBar title="Report detail"
        extra={<EndpointBadge path={`/api/reports/${encodeURIComponent(row.id)}`} />}
      />
      <div className="flex flex-col gap-3 max-w-3xl">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-neutral-400">Title</span>
          <input value={row.title} onChange={e=>setRow({ ...row, title:e.target.value })}
                 className="px-3 py-2 rounded border border-neutral-700 bg-black" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-neutral-400">Content</span>
          <textarea value={row.content||""} onChange={e=>setRow({ ...row, content:e.target.value })}
                    rows={8} className="px-3 py-2 rounded border border-neutral-700 bg-black" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-neutral-400">Status</span>
          <select value={row.status} onChange={e=>setRow({ ...row, status:e.target.value })}
                  className="px-3 py-2 rounded border border-neutral-700 bg-black">
            <option value="draft">draft</option>
            <option value="ready">ready</option>
            <option value="archived">archived</option>
          </select>
        </label>

        <div className="text-xs text-neutral-500">
          <div>ID: {row.id}</div>
          <div>Created: {new Date(row.createdAt).toLocaleString()}</div>
          <div>Updated: {new Date(row.updatedAt).toLocaleString()}</div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={save} disabled={saving} className="px-4 py-2 rounded border border-neutral-700 disabled:opacity-50">
            {saving ? "Saving…" : "Save"}
          </button>
          <a href={`/api/reports/export?limit=1&id=${encodeURIComponent(row.id)}`}
             className="px-4 py-2 rounded border border-neutral-700">Export ZIP</a>
          <button onClick={removeIt} disabled={saving} className="px-4 py-2 rounded border border-red-700 text-red-400 disabled:opacity-50">
            Delete
          </button>
          <Link href="/member-zone/reports" className="ml-auto underline">Back to list</Link>
        </div>

        {err && <div className="text-red-500">{err}</div>}
      </div>
    </div>
  );
}
TS

lsof -ti:3000 | xargs -r kill -9 || true
NEXT_DISABLE_ESLINT=1 npm run dev >/dev/null 2>&1 & disown
sleep 2

PORT=3000; curl -fsS "http://127.0.0.1:3000/api/health/version" >/dev/null 2>&1 || PORT=3002
printf "%s\n" \
"http://localhost:$PORT/member-zone/reports" \
"http://localhost:$PORT/api/reports?limit=20" \
"http://localhost:$PORT/api/reports/export?limit=1000" \
"http://localhost:$PORT/api/voice/health" \
"http://localhost:$PORT/api/drug-gene/health" \
"http://localhost:$PORT/api/dev/cookie" \
"http://localhost:$PORT/api/dev/echo-cookies"
