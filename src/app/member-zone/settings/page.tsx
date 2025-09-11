'use client';

import { useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import { Card, CardHeader, CardTitle, CardSub, CardBody, CardFooter, Btn, Badge, ActionRow } from "@/components/ui/CardToned";
import Link from "next/link";

export default function SettingsPage() {
  const [tone, setTone] = useState<"slate"|"indigo"|"teal">("teal");

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Settings"
        desc="Calm palette, clear sections, consistent layout."
      />

      {/* Theme */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <Card tone={tone}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profile</CardTitle>
                <CardSub>Public information</CardSub>
              </div>
              <Badge tone={tone}>account</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="text-sm">
                <div className="mb-1 text-neutral-300">Name</div>
                <input className="w-full h-10 px-3 rounded-lg bg-neutral-900/60 border border-neutral-700" defaultValue="Member" />
              </label>
              <label className="text-sm">
                <div className="mb-1 text-neutral-300">Email</div>
                <input className="w-full h-10 px-3 rounded-lg bg-neutral-900/60 border border-neutral-700" defaultValue="member@example.com" />
              </label>
            </div>
          </CardBody>
          <CardFooter>
            <ActionRow>
              <Btn variant="primary">Save changes</Btn>
              <Btn>Reset</Btn>
            </ActionRow>
          </CardFooter>
        </Card>

        {/* Security */}
        <Card tone="neutral">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Security</CardTitle>
                <CardSub>Password & providers</CardSub>
              </div>
              <Badge>secure</Badge>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Password</div>
                <div className="text-sm text-neutral-400">Change your password</div>
              </div>
              <Btn>Change</Btn>
            </div>

            <div>
              <div className="font-medium mb-2">Single Sign-On</div>
              <ActionRow>
                <Btn>Google</Btn>
                <Btn>GitHub</Btn>
                <Btn>Apple</Btn>
              </ActionRow>
            </div>
          </CardBody>
          <CardFooter>
            <ActionRow>
              <Btn href="/api/stripe/portal" variant="primary">Open Billing Portal</Btn>
              <Btn href="/pricing">Plans</Btn>
            </ActionRow>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
