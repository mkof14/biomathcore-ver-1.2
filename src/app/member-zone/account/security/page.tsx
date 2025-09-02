"use client";
import { useState } from "react";

export default function AccountSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function changePassword() {
    setBusy(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (!res.ok || json?.ok === false)
        throw new Error(json?.error || "Failed");
      setMsg("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e: any) {
      setErr(e?.message || "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold">Account · Security</h1>
      <p className="text-sm text-gray-400 mt-1">Change your password.</p>
      <div className="mt-6 card-like">
        <label className="block text-sm mb-2">Current password</label>
        <input
          className="input"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <label className="block text-sm mt-4 mb-2">New password</label>
        <input
          className="input"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={changePassword}
          disabled={busy}
          className="btn btn-primary mt-4"
        >
          {busy ? "Updating..." : "Update password"}
        </button>
        {msg && <p className="text-green-400 mt-3">{msg}</p>}
        {err && <p className="text-red-400 mt-3">Error: {err}</p>}
      </div>
    </section>
  );
}
