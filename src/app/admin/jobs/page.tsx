'use client';

import AdminHeader from "@/components/admin/AdminHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/CardToned";

export default function Page() {
  return (
    <div className="space-y-6">
      <AdminHeader title="Jobs / Queues" desc="Background workers and schedules." />
      <Card tone="slate">
        <CardHeader><CardTitle>Status</CardTitle></CardHeader>
        <CardBody>
          <div className="text-sm text-neutral-400">No job runner connected yet.</div>
        </CardBody>
      </Card>
    </div>
  );
}
