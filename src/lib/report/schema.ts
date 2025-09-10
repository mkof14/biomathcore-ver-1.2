import { z } from "zod";

export const Citation = z.object({
  quote: z.string().min(8),
  source: z.string().min(3),
  title: z.string().min(3),
  url: z.string().url()
});

export const ReportSection = z.object({
  heading: z.string().min(3),
  summary: z.string().min(20),
  bullets: z.array(z.string().min(2)).min(2),
  citations: z.array(Citation).min(1)
});

export const ReportJson = z.object({
  topic: z.string().min(3),
  scope: z.string().min(3),
  generatedAt: z.string(),
  executiveSummary: z.string().min(40),
  keyFindings: z.array(z.string().min(3)).min(3),
  sections: z.array(ReportSection).min(2),
  overallCitations: z.array(Citation).min(2)
});

export type ReportJson = z.infer<typeof ReportJson>;
