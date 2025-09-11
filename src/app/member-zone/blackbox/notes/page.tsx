'use client';

// src/app/member-zone/blackbox/notes/page.tsx
import React, { useState } from "react";
import { useBlackBox } from "@/hooks/useBlackBox";

export default function BlackBoxNotesPage() {
  const { data, loading, error, create, update, remove, refetch } =
    useBlackBox();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", tags: "" });

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setBusy(true);
    try {
      await create({
        title: form.title.trim(),
        body: form.body,
        tags: form.tags.trim() || undefined,
        status: "draft",
      });
      setForm({ title: "", body: "", tags: "" });
    } catch (e) {
      alert("Failed to create note");
    } finally {
      setBusy(false);
    }
  }

  async function onRename(id: string, current: string) {
    const next = window.prompt("New title", current || "");
    if (next == null) return;
    const title = next.trim();
    if (!title) return;
    await update(id, { title });
  }

  async function onEditBody(id: string, current: string) {
    const next = window.prompt("New body", current || "");
    if (next == null) return;
    await update(id, { body: next });
  }

  async function onEditTags(id: string, current: string | null) {
    const next = window.prompt("Tags (comma separated)", current || "");
    if (next == null) return;
    await update(id, { tags: next.trim() || null });
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
          Health Black Box — Notes
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Quick CRUD over your health notes. This page does not touch your
          existing /member-zone/blackbox.
        </p>
      </div>

      <form
        onSubmit={onCreate}
        className="mb-6 rounded-xl border border-gray-200 bg-white p-4"
      >
        <h2 className="text-lg font-semibold text-gray-900">Create</h2>
        <div className="mt-3 grid gap-3">
          <input
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            placeholder="Title"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <textarea
            value={form.body}
            onChange={(e) => setForm((s) => ({ ...s, body: e.target.value }))}
            placeholder="Body"
            rows={5}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            value={form.tags}
            onChange={(e) => setForm((s) => ({ ...s, tags: e.target.value }))}
            placeholder="tags (comma,separated)"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black/90 disabled:opacity-60"
          >
            {busy ? "Creating…" : "Create"}
          </button>
        </div>
      </form>

      {loading && <p className="text-sm text-gray-600">Loading…</p>}
      {error && <p className="text-sm text-red-600">Error: {String(error)}</p>}

      <div className="grid gap-4">
        {data.map((n) => (
          <div
            key={n.id}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm text-gray-900 font-medium">
                  {n.title}
                </div>
                <div className="text-xs text-gray-600 mt-0.5">
                  Tags: {n.tags || "—"} • Updated:{" "}
                  {new Date(n.updatedAt).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onRename(n.id, n.title)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-50"
                >
                  Rename
                </button>
                <button
                  onClick={() => onEditBody(n.id, n.body)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-50"
                >
                  Edit Body
                </button>
                <button
                  onClick={() => onEditTags(n.id, n.tags)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-50"
                >
                  Edit Tags
                </button>
                <button
                  onClick={() => remove(n.id)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-50"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
              {n.body}
            </div>
          </div>
        ))}
        {!loading && !error && data.length === 0 && (
          <p className="text-sm text-gray-700">
            No notes yet — create one above.
          </p>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={() => refetch()}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>
    </section>
  );
}
