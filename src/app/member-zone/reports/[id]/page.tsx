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
