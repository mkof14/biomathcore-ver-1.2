import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Control Center | BioMath Core",
  description: "Monitoring & Control dashboards",
};

export default function ControlCenterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
