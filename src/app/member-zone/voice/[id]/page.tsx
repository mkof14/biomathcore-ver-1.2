'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ActionBar from "@/components/ActionBar";
import EndpointBadge from "@/components/EndpointBadge";
type Row = { id:string; title:string; status:"draft"|"ready"|"archived"; createdAt:string|Date; updatedAt:string|Date; content?:string };

export default function VoiceDetail(){
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const [row, setRow] = useState<Row|null>(null);
  const [saving, setSaving] = useState(false);

  async function load(){ const r = await fetch(`/api/voice/${id}`, { cache:"no-store" }); if (r.ok){ const j = await r.json(); setRow(j.data); } }
  async function save(){ if(!row) return; setSaving(true); const r = await fetch(`/api/voice/${row.id}`, { method:"PATCH", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ title: row.title, status: row.status, content: row.content })}); setSaving(false); if (r.ok) load(); }
  async function removeIt(){ if(!row) return; if(!confirm("Delete?")) return; const r = await fetch(`/api/voice/${row.id}`, { method:"DELETE" }); if (r.ok) router.push("/member-zone/voice"); }

  useEffect(()=>{ load(); }, [id]);
  if (!row) return <div className="p-6">Loading…</div>;

  const apiDetail = `/api/voice/${row.id}`;
  const apiExport = `/api/voice/export?limit=1000&id=${encodeURIComponent(row.id)}`;

  return (
    <div className="p-6 space-y-6">
      <ActionBar title="Voice Detail" right={<div className="flex gap-2 flex-wrap"><EndpointBadge path={apiDetail}/><EndpointBadge path={apiExport}/></div>} />
      <div className="grid gap-4 max-w-2xl">
        <label className="grid gap-1"><span className="text-sm">Title</span><input className="border rounded px-3 py-2" value={row.title} onChange={e=>setRow({...row, title:e.target.value})}/></label>
        <label className="grid gap-1"><span className="text-sm">Status</span><select className="border rounded px-3 py-2" value={row.status} onChange={e=>setRow({...row, status: e.target.value as any})}><option value="draft">draft</option><option value="ready">ready</option><option value="archived">archived</option></select></label>
        <label className="grid gap-1"><span className="text-sm">Content</span><textarea className="border rounded px-3 py-2 min-h-[140px]" value={row.content||""} onChange={e=>setRow({...row, content:e.target.value})}/></label>
        <div className="text-sm text-gray-500"><div>ID: {row.id}</div><div>Created: {new Date(row.createdAt as any).toLocaleString()}</div><div>Updated: {new Date(row.updatedAt as any).toLocaleString()}</div></div>
        <div className="flex gap-2">
          <button onClick={save} disabled={saving} className="border rounded px-4 py-2 disabled:opacity-50">{saving?"Saving…":"Save"}</button>
          <a href={apiExport} className="border rounded px-4 py-2 inline-block">Export ZIP (single)</a>
          <button onClick={removeIt} disabled={saving} className="border rounded px-4 py-2 text-red-600 border-red-600 disabled:opacity-50">Delete</button>
        </div>
      </div>
    </div>
  );
}
