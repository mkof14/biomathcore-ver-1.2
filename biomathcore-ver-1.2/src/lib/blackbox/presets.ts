// @ts-nocheck
export type BBPreset = {
  slug: string;
  title: string;
  params: Record<string, any>;
};

export const BLACKBOX_PRESETS: BBPreset[] = [
  { slug: "basic-audit", title: "Basic Audit", params: { kind: "audit", depth: 1 } },
  { slug: "deep-audit",  title: "Deep Audit",  params: { kind: "audit", depth: 3 } },
  { slug: "quick-summary", title: "Quick Summary", params: { kind: "summarize" } },
];
