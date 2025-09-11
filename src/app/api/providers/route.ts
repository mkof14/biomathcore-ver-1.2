import { NextResponse } from "next/server";
import { PROVIDERS } from "./_data";

// Ensure server-side handling and disable static optimization/caching in dev
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(
      { providers: PROVIDERS },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      },
    );
  } catch (err) {
    console.error("[api/providers][GET] error:", err);
    return NextResponse.json(
      { error: "Failed to load providers" },
      { status: 500 },
    );
  }
}

export {};
