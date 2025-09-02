import { NextResponse } from "next/server";

export function withLog(handler: (req: Request) => Promise<Response> | Response, name: string) {
  return async (req: Request) => {
    const start = Date.now();
    const reqId = Math.random().toString(36).slice(2);
    try {
      const res = await handler(req);
      const ms = Date.now() - start;
      console.log(`[api] ${name} ${req.method} ${new URL(req.url).pathname} ${res.status} id=${reqId} ${ms}ms`);
      return new NextResponse(res.body, {
        status: res.status,
        headers: new Headers(res.headers),
      });
    } catch (e:any) {
      const ms = Date.now() - start;
      console.error(`[api] ${name} ERROR id=${reqId} ${ms}ms`, e?.message || e);
      return NextResponse.json({ ok:false, error:"internal_error", id:reqId }, { status: 500 });
    }
  };
}
