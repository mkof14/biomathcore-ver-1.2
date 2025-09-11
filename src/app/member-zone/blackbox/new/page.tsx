'use client';

import { useState } from "react";
import Link from "next/link";

export default function NewBlackBox() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function create() {
    setSaving(true); setErr(null);
    try {
      const res = await fetch("/api/blackbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, status }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "failed");
      window.location.href = `/member-zone/blackbox/${j.data.id}`;
    } catch (e:any) {
      setErr(e.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/member-zone/blackbox" className="underline">← Back</Link>
        <h1 className="text-xl font-semibold">New BlackBox</h1>
      </div>

      <label className="block space-y-1">
        <div className="text-sm">Title</div>
        <input value={title} onChange={e=>setTitle(e.target.value)} className="border rounded px-3 py-2 w-full"/>
      </label>

      <label className="block space-y-1">
        <div className="text-sm">Content</div>
        <textarea value={content} onChange={e=>setContent(e.target.value)} className="border rounded px-3 py-2 w-full h-40"/>
      </label>

      <label className="block space-y-1">
        <div className="text-sm">Status</div>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="border rounded px-3 py-2">
          <option value="draft">draft</option>
          <option value="ready">ready</option>
          <option value="archived">archived</option>
        </select>
      </label>

      <div className="flex gap-2">
        <button onClick={create} disabled={saving} className="border rounded px-4 py-2 disabled:opacity-50">
          {saving ? "Creating…" : "Create"}
        </button>
        {err && <div className="text-red-600">{err}</div>}
      </div>
    </div>
  );
}
