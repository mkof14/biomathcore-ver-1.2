"use client";
import { useEffect, useState } from "react";
type Profile = { id: string; email: string; name: string };
export default function ProfilePage() {
  const [p, setP] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/member/profile").then(r=>r.json()).then(j=>{
      if (j?.ok) { setP(j.data); setName(j.data.name||""); setEmail(j.data.email||""); }
    });
  }, []);

  async function save() {
    setSaving(true); setMsg("");
    const r = await fetch("/api/member/profile", {method:"PATCH", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ name, email })});
    const j = await r.json().catch(()=>null);
    setSaving(false);
    if (j?.ok) { setP(j.data); setMsg("Saved"); } else setMsg(j?.error||"Failed");
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      {!p && <div>Loading…</div>}
      {p && (
        <>
          <div className="space-y-2">
            <label className="block">
              <div className="text-sm text-gray-600">Name</div>
              <input className="border rounded px-3 py-2 w-full" value={name} onChange={e=>setName(e.target.value)} />
            </label>
            <label className="block">
              <div className="text-sm text-gray-600">Email</div>
              <input className="border rounded px-3 py-2 w-full" value={email} onChange={e=>setEmail(e.target.value)} />
            </label>
          </div>
          <button className="border rounded px-4 py-2" onClick={save} disabled={saving}>{saving?"Saving…":"Save"}</button>
          {msg && <div className="text-sm">{msg}</div>}
        </>
      )}
    </div>
  );
}
