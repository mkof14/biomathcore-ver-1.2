"use client";
import { usePathname } from "next/navigation";
import ServiceGenerator from "@/components/ServiceGenerator";

function titleCase(s: string) {
  const t = decodeURIComponent(s.replace(/-/g, " "));
  return t.replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function ServiceGeneratorMount() {
  const pathname = usePathname(); // e.g. /services/mood-tracker
  const slug = (
    pathname?.split("/").filter(Boolean).pop() ?? "Service"
  ).toString();
  const serviceName = titleCase(slug);
  return <ServiceGenerator serviceName={serviceName} />;
}
