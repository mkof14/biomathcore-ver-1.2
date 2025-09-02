"use client";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/CardToned";

export default function Page() {
  return (
    <div className="space-y-6">
      <AdminHeader title="Logs" desc="Connect your log provider (e.g., Vercel, Logtail) and surface recent events here." />
      <Card tone="slate">
        <CardHeader><CardTitle>Status</CardTitle></CardHeader>
        <CardBody>
          <div className="text-sm text-neutral-400">No log provider configured yet.</div>
        </CardBody>
      </Card>
    </div>
  );
}
