'use client';

import SectionHeader from "@/components/SectionHeader";
import { Card, CardHeader, CardTitle, CardBody, Row, Btn } from "@/components/ui/CardToned";

const items = [
  { label: "AI", base: "/api/ai" },
  { label: "Voice", base: "/api/voice" },
  { label: "Drug–Gene", base: "/api/drug-gene" },
  { label: "Reports", base: "/api/reports" },
];

export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Data Export" desc="Download your data in CSV, JSON, or ZIP." />
      <Card tone="slate">
        <CardHeader><CardTitle>Collections</CardTitle></CardHeader>
        <CardBody className="space-y-2">
          {items.map((x) => (
            <Row key={x.label} label={x.label}
              actions={
                <div className="flex gap-2">
                  <Btn href={`${x.base}/export?format=csv&limit=1000`}>CSV</Btn>
                  <Btn href={`${x.base}/export?format=json&limit=1000`}>JSON</Btn>
                  <Btn variant="primary" href={`${x.base}/export?format=zip&limit=1000`}>ZIP</Btn>
                </div>
              }
            />
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
