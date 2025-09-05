import Link from "next/link";
import { headers, cookies } from "next/headers";

type Report = {
  id: string;
  type: string;
  title: string;
  markdown: string;
  createdAt: string;
};

async function getReport(id: string): Promise<Report | null> {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const base = `${proto}://${host}`;

  const ck = await cookies();
  const cookieHeader = ck.toString();

  const res = await fetch(`${base}/api/reports/${id}`, {
    cache: "no-store",
    headers: { cookie: cookieHeader },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rep = await getReport(id);
  if (!rep) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <Link href="/member-zone/reports" className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 hover:bg-gray-50 dark:hover:bg-neutral-900">
          ← Back to Reports
        </Link>
        <div className="rounded-2xl border p-6">Report not found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{rep.title}</h1>
        <Link href="/member-zone/reports" className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 hover:bg-gray-50 dark:hover:bg-neutral-900">
          ← Back
        </Link>
      </div>
      <div className="text-sm text-gray-500">
        <span>{new Date(rep.createdAt).toLocaleString()}</span>
        <span className="mx-2">•</span>
        <span>{rep.type}</span>
      </div>
      <div className="rounded-2xl border p-6 bg-white dark:bg-neutral-950">
        <div className="whitespace-pre-wrap leading-relaxed">{rep.markdown}</div>
      </div>
    </div>
  );
}
