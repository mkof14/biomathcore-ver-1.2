'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Row = {
  id: string;
  drugName: string;
  geneSymbol: string;
  relation: string;
  status: "pending"|"curated"|"archived";
  createdAt: string;
  updatedAt: string;
};

export default function DGDetailPage(){
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const [row, setRow] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function load(){
    const r = await fetch(`/api/drug-gene/${id}`, { cache:"no-store" });
    if (r.ok){ setRow(await r.json().then(j=>j.data)); }
  }
  useEffect(()=>{ load(); },[id]);

  async function save(){
    if (!row) return;
    setSaving(true); setErr("");
    try{
      const r = await fetch(`/api/drug-gene/${row.id}`, {
        method:"PATCH",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          drugName: row.drugName,
          geneSymbol: row.geneSymbol,
          relation: row.relation,
          status: row.status
        })
      });
      if (!r.ok) setErr("Save failed");
    } finally { setSaving(false); }
  }

  async function removeIt(){
    if (!row) return;
    if (!confirm("Delete?")) return;
    const r = await fetch(`/api/drug-gene/${row.id}`, { method:"DELETE" });
    if (r.ok){ router.push("/member-zone/drug-gene"); }
  }

  if (!row) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Drug–Gene: {row.id.slice(0,8)}</h1>

      <div className="grid gap-3 max-w-xl">
        <label className="grid gap-1">
          <div className="text-sm text-neutral-400">Drug</div>
          <input value={row.drugName} onChange={e=> setRow({ ...row, drugName: e.target.value })} className="border rounded px-3 py-2 bg-transparent" />
        </label>

        <label className="grid gap-1">
          <div className="text-sm text-neutral-400">Gene</div>
          <input value={row.geneSymbol} onChange={e=> setRow({ ...row, geneSymbol: e.target.value })} className="border rounded px-3 py-2 bg-transparent" />
        </label>

        <label className="grid gap-1">
          <div className="text-sm text-neutral-400">Relation</div>
          <input value={row.relation} onChange={e=> setRow({ ...row, relation: e.target.value })} className="border rounded px-3 py-2 bg-transparent" />
        </label>

        <label className="grid gap-1">
          <div className="text-sm text-neutral-400">Status</div>
          <select value={row.status} onChange={e=> setRow({ ...row, status: e.target.value as any })} className="border rounded px-3 py-2 bg-transparent">
            <option value="pending">pending</option>
            <option value="curated">curated</option>
            <option value="archived">archived</option>
          </select>
        </label>

        <div className="text-sm text-neutral-500">
          <div>ID: {row.id}</div>
          <div>Created: {new Date(row.createdAt).toLocaleString()}</div>
          <div>Updated: {new Date(row.updatedAt).toLocaleString()}</div>
        </div>

        <div className="flex gap-2">
          <button onClick={save} disabled={saving} className="border rounded px-4 py-2 disabled:opacity-50">
            {saving ? "Saving…" : "Save"}
          </button>
          <a href={`/api/drug-gene/export?limit=1&id=${encodeURIComponent(row.id)}`} className="border rounded px-4 py-2 inline-block">
            Export ZIP (single)
          </a>
          <button onClick={removeIt} disabled={saving} className="border rounded px-4 py-2 text-red-600 border-red-600 disabled:opacity-50">
            Delete
          </button>
        </div>

        {err && <div className="text-red-600">{err}</div>}
      </div>
    </div>
  );
}
