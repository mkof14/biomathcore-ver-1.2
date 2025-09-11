import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Returns JSON schemas for Black Box input/output.
 * No DB changes required; this is a contract for the client and future engines.
 */
export async function GET() {
  const inputSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://biomathcore.com/schemas/blackbox.input.json",
    type: "object",
    required: ["data"],
    additionalProperties: false,
    properties: {
      caseTitle: {
        type: "string",
        minLength: 1,
        description: "Human readable case title",
      },
      data: {
        type: "object",
        description: "Clinical/wellness inputs. Arbitrary namespaced JSON.",
        additionalProperties: true,
      },
      settings: {
        type: "object",
        description: "Execution knobs (model hints, safety levels, etc.)",
        additionalProperties: true,
      },
    },
  };

  const outputSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://biomathcore.com/schemas/blackbox.output.json",
    type: "object",
    required: ["summary", "timestamp"],
    additionalProperties: true,
    properties: {
      runId: { type: "string", description: "Server-assigned id for this run" },
      summary: {
        type: "string",
        description: "Short textual summary of the result",
      },
      insights: {
        type: "array",
        items: {
          type: "object",
          required: ["title", "value"],
          properties: {
            title: { type: "string" },
            value: { type: "string" },
            evidence: { type: "string" },
          },
          additionalProperties: false,
        },
      },
      timestamp: { type: "string", format: "date-time" },
      echoes: {
        type: "object",
        description: "Echo of some validated input fields for traceability",
        additionalProperties: true,
      },
    },
  };

  return NextResponse.json({ ok: true, inputSchema, outputSchema });
}

export {};
