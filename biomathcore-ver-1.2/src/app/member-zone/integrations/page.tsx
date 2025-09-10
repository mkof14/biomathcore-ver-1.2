"use client";
import React from "react";
import SectionHeader from "@/components/SectionHeader";
import { Card, CardHeader, CardTitle, CardBody, Row, Btn } from "@/components/ui/CardToned";

export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Integrations" desc="Connect external services." />
      <Card tone="teal">
        <CardHeader><CardTitle>Available</CardTitle></CardHeader>
        <CardBody className="space-y-2">
          <Row label="GitHub" actions={<Btn variant="primary" href="#">Connect</Btn>} />
          <Row label="Google" actions={<Btn variant="primary" href="#">Connect</Btn>} />
        </CardBody>
      </Card>
    </div>
  );
}
