"use client";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/CardToned";
import Link from "next/link";

const links = [
  { href: "/internal/system",       title: "System" },
  { href: "/internal/diagnostics",  title: "Diagnostics" },
  { href: "/internal/export",       title: "Export" },
  { href: "/internal/release",      title: "Release" },
];

export default function Page() {
  return (
    <div className="space-y-6">
      <AdminHeader title="Service Links" desc="Quick access to internal tools." />
      <Card tone="slate">
        <CardHeader><CardTitle>Internal</CardTitle></CardHeader>
        <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {links.map(x => (
            <Link key={x.href} href={x.href}
              className="group rounded-md border border-neutral-800 bg-neutral-950/50 hover:bg-neutral-900/60 transition p-3">
              <div className="font-medium">{x.title}</div>
              <div className="text-xs text-neutral-400 break-all">{x.href}</div>
            </Link>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
