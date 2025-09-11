import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function GET() {
  // демо-планы; убираем прямую зависимость от stripe sdk
  return NextResponse.json({
    ok: true,
    plans: [
      { id: "demo_basic",  price: 0,     interval: "month", name: "Basic (Demo)" },
      { id: "demo_pro",    price: 2900,  interval: "month", name: "Pro (Demo)" },
      { id: "demo_team",   price: 9900,  interval: "month", name: "Team (Demo)" },
    ],
  });
}
