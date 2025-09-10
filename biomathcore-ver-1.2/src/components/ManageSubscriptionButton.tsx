"use client";
import { useState } from "react";

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  async function go() {
    setLoading(true);
    try {
      const r = await fetch("/api/billing/portal", { method: "POST" });
      const j = await r.json();
      if (j?.ok && j?.url) {
        window.location.href = j.url as string;
      } else {
        alert("Failed to get portal URL");
      }
    } catch (e) {
      console.error(e);
      alert("Error opening portal");
    } finally {
      setLoading(false);
    }
  }
  return (
    <button onClick={go} disabled={loading} className="border rounded px-4 py-2 disabled:opacity-50">
      {loading ? "Opening…" : "Manage subscription"}
    </button>
  );
}
