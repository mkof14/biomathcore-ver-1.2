export const runtime = "nodejs";

type MockSub = {
  plan: "Free" | "Pro";
  status: "inactive" | "active" | "past_due" | "canceled";
  renewsAt: string | null;
  portalUrl: string | null;
};

function mock(): MockSub {
  const now = new Date();
  const next = new Date(now.getTime() + 30*24*60*60*1000);
  return {
    plan: "Pro",
    status: "active",
    renewsAt: next.toISOString(),
    portalUrl: "/stripe-test",
  };
}

export async function GET() {
  try {
    // пробуем «реальный» обработчик, если он существует в проекте
    const real = await import("./route.real").catch(() => null) as any;
    if (real?.GET) {
      const res = await real.GET();
      if (res?.ok || res?.status === 200) return res;
    }
  } catch {}
  return Response.json({ ok: true, data: mock(), mock: true }, { headers: { "Cache-Control": "no-store" }});
}

export {};
