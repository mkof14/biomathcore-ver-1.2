export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import Link from "next/link";

function Card({ title, href, subtitle }: { title:string; href:string; subtitle:string }) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 hover:border-neutral-700 hover:bg-neutral-900/60 transition"
    >
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm text-neutral-400">{subtitle}</div>
    </Link>
  );
}

export default function DevHome() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card title="Demo AI" href="/dev/demo-ai" subtitle="Health ping, action bar, endpoint badge" />
      <Card title="Demo Voice" href="/dev/demo-voice" subtitle="Health ping + UI" />
      <Card title="Demo Drug–Gene" href="/dev/demo-drug-gene" subtitle="Health ping + UI" />
      <Card title="Reports" href="/member-zone/reports" subtitle="List/Detail/Export demo" />
    </div>
  );
}
