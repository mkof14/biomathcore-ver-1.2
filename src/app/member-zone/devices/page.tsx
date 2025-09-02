"use client";
import { useEffect, useState } from "react";
import EndpointBadge from "@/components/EndpointBadge";

type Device = {
  id: string;
  provider: "fitbit" | "apple-health" | "oura" | "withings";
  label: string;
  status: "connected" | "disconnected";
  createdAt: string;
  updatedAt: string;
};

const providers: Device["provider"][] = ["fitbit", "apple-health", "oura", "withings"];

export default function Page(){
  const [rows, setRows] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  async function load(cursor?: string | null){
    setLoading(true);
    try{
      const q = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
      const r = await fetch(`/api/devices${q}`, { cache: "no-store" });
      const j = await r.json();
      if (j?.ok){
        if (cursor) setRows((p)=>[...p, ...(j.data.rows || [])]);
        else setRows(j.data.rows || []);
        setNextCursor(j.data.nextCursor || null);
      }
    } finally { setLoading(false); }
  }

  async function connect(provider: Device["provider"]){
    const r = await fetch("/api/devices", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ provider }),
    });
    await r.json();
    await load(undefined);
  }

  async function disconnect(id: string){
    const r = await fetch(`/api/devices/${id}`, { method: "DELETE" });
    await r.json();
    await load(undefined);
  }

  useEffect(()=>{ load(undefined); }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Devices</h1>
        <div className="flex gap-2">
          <EndpointBadge path="/api/devices" />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {providers.map((p)=>(
          <button key={p} onClick={()=>connect(p)} className="border rounded px-3 py-2">
            Connect {p}
          </button>
        ))}
      </div>

      <div className="border rounded overflow-hidden bg-white/60">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 border text-left">Provider</th>
              <th className="p-2 border text-left">Label</th>
              <th className="p-2 border text-left">Status</th>
              <th className="p-2 border text-left">Created</th>
              <th className="p-2 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d)=>(
              <tr key={d.id} className="odd:bg-white even:bg-gray-50">
                <td className="p-2 border">{d.provider}</td>
                <td className="p-2 border">{d.label}</td>
                <td className="p-2 border">{d.status}</td>
                <td className="p-2 border">{new Date(d.createdAt).toLocaleString()}</td>
                <td className="p-2 border">
                  <button onClick={()=>disconnect(d.id)} className="border rounded px-2 py-1">
                    Disconnect
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && !loading && (
              <tr><td className="p-2 border text-gray-500" colSpan={5}>No devices.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <button
          onClick={()=>load(nextCursor)}
          disabled={!nextCursor || loading}
          className="border rounded px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Loading…" : nextCursor ? "Load more" : "No more"}
        </button>
      </div>
    </div>
  );
}
