"use client";
import React, { useEffect, useState } from "react";
import { SectionCard } from "@/components/admin/AdminShell";

type SecretPreview = { key: string; valuePreview: string; updatedAt: string };

/**
 * Управление секретами: добавление/обновление/удаление.
 * В списке значения маскируются на бэке (без утечек в UI).
 */
export default function SecretsPage() {
  const [items, setItems] = useState<SecretPreview[]>([]);
  const [newKey, setNewKey] = useState("");
  const [newVal, setNewVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string|null>(null);

  /** Загружаем список секретов (без значений, только превью и мета). */
  const load = async () => {
    const j = await fetch("/api/admin/secrets").then(r => r.json());
    setItems(j.items || []);
  };

  useEffect(() => { load(); }, []);

  /** Добавить/обновить запись по ключу. */
  const add = async () => {
    setLoading(true); setMessage(null);
    const r = await fetch("/api/admin/secrets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: newKey, value: newVal })
    });
    setLoading(false);
    if (r.ok) { setNewKey(""); setNewVal(""); setMessage("Saved"); load(); }
    else { const j = await r.json().catch(() => ({})); setMessage(j.error || "Error"); }
  };

  /** Удаление записи по ключу. */
  const del = async (key: string) => {
    setLoading(true); setMessage(null);
    const r = await fetch(`/api/admin/secrets?key=${encodeURIComponent(key)}`, { method: "DELETE" });
    setLoading(false);
    if (r.ok) { setMessage("Deleted"); load(); }
    else { const j = await r.json().catch(() => ({})); setMessage(j.error || "Error"); }
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Secrets Manager" descr="Хранилище интеграционных ключей (Stripe, Gemini, OAuth и т. п.)">
        <div className="grid md:grid-cols-3 gap-3">
          <input
            className="px-3 py-2 rounded-xl border border-black/10"
            placeholder="KEY (e.g., GEMINI_API_KEY)"
            aria-label="Secret key name"
            value={newKey}
            onChange={e => setNewKey(e.target.value)}
          />
          <input
            className="px-3 py-2 rounded-xl border border-black/10"
            placeholder="VALUE"
            aria-label="Secret value"
            value={newVal}
            onChange={e => setNewVal(e.target.value)}
          />
          <button
            disabled={!newKey || !newVal || loading}
            onClick={add}
            className="btn btn-accent"
            aria-label="Save secret"
            title="Добавит новый ключ или обновит существующий"
          >
            {loading ? "Saving..." : "Add / Update"}
          </button>
        </div>

        {message ? <div className="small mt-2">{message}</div> : null}

        {/* Таблица со списком ключей, значения — только превью для безопасности */}
        <div className="admin-card p-0 mt-5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/5">
              <tr>
                <th className="text-left py-2 px-3">Key</th>
                <th className="text-left py-2 px-3">Preview</th>
                <th className="text-left py-2 px-3">Updated</th>
                <th className="py-2 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it.key} className="border-t border-black/10">
                  <td className="py-2 px-3">{it.key}</td>
                  <td className="py-2 px-3">{it.valuePreview}</td>
                  <td className="py-2 px-3">{new Date(it.updatedAt).toLocaleString()}</td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => del(it.key)}
                      className="btn btn-ghost"
                      aria-label={`Delete secret ${it.key}`}
                      title="Удалить секрет (безвозвратно в текущем хранилище)"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="py-3 px-3 kicker" colSpan={4}>
                    Пока пусто. Добавь ключи через форму выше.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
