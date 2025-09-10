"use client";

type Row = { id: string; title?: string; status?: string; createdAt?: string | Date };

export default function LatestList({
  title,
  rows,
  emptyText = "No items.",
}: {
  title: string;
  rows: Row[];
  emptyText?: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200/50 bg-white/70 p-4 shadow-sm">
      <div className="mb-2 text-sm font-medium text-neutral-700">{title}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500">
              <th className="p-2 border-b">Title</th>
              <th className="p-2 border-b">Status</th>
              <th className="p-2 border-b">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows?.length ? (
              rows.slice(0, 5).map((r) => (
                <tr key={r.id} className="odd:bg-white even:bg-neutral-50">
                  <td className="p-2 border-b">{r.title ?? r.id}</td>
                  <td className="p-2 border-b">{r.status ?? "—"}</td>
                  <td className="p-2 border-b">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-neutral-500" colSpan={3}>
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
