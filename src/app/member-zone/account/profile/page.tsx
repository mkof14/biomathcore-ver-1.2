'use client';

import { useState } from "react";

export default function AccountProfilePage() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });
      const json = await res.json();
      if (!res.ok || json?.ok === false)
        throw new Error(json?.error || "Failed");
      setMsg("Profile updated.");
    } catch (e: any) {
      setErr(e?.message || "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">Account · Profile</h1>
      <p className="text-sm text-gray-400 mt-1">
        Update your display name and avatar URL.
      </p>
      <div className="mt-6 card-like">
        <label className="block text-sm mb-2">Name</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
        <label className="block text-sm mt-4 mb-2">Image URL</label>
        <input
          className="input"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://..."
        />
        <button onClick={save} disabled={busy} className="btn btn-primary mt-4">
          {busy ? "Saving..." : "Save changes"}
        </button>
        {msg && <p className="text-green-400 mt-3">{msg}</p>}
        {err && <p className="text-red-400 mt-3">Error: {err}</p>}
      </div>
    </section>
  );
}
