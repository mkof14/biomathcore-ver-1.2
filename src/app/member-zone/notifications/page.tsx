'use client';

import React from "react";
import SectionHeader from "@/components/SectionHeader";
import { Card, CardHeader, CardTitle, CardBody, Row, Btn } from "@/components/ui/CardToned";

export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Notifications" desc="Email and in-app alerts." />
      <Card tone="slate">
        <CardHeader><CardTitle>Channels</CardTitle></CardHeader>
        <CardBody className="space-y-2">
          <Row label="Email alerts" actions={<><Btn variant="primary" href="#">Enable</Btn><Btn href="#">Mute 24h</Btn></>} />
          <Row label="In-app notifications" actions={<><Btn variant="primary" href="#">Enable</Btn><Btn href="#">Mute 24h</Btn></>} />
        </CardBody>
      </Card>
    </div>
  );
}
