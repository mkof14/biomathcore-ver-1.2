export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Control Center | BioMath Core",
  description: "Monitoring & Control dashboards",
};

export default function ControlCenterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
