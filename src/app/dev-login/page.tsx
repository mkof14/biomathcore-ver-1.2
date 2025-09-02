"use client";
import { useState } from "react";

export default function DevLogin() {
  const [userId, setUserId] = useState("dev-user-001");
  const [out, setOut] = useState("");

  async function signIn() {
    const r = await fetch("/api/dev/cookie", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ userId })
    });
    const t = await r.text();
    setOut(t);
  }

  return (
    <div className="mx-auto max-w-md p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dev Login</h1>
      <div className="space-y-2">
        <label className="block text-sm">User ID</label>
        <input
          value={userId}
          onChange={e=>setUserId(e.target.value)}
          className="w-full rounded border border-neutral-700 bg-neutral-900/50 px-3 py-2"
          placeholder="dev-user-001"
        />
      </div>
      <button onClick={signIn} className="border rounded px-4 py-2">Set Dev Cookie</button>
      <div className="text-xs whitespace-pre-wrap border rounded p-2">{out}</div>
    </div>
  );
}
