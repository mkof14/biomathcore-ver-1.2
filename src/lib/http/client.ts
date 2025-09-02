export type ApiOk<T> = { ok: true; data: T };
export type ApiFail = { ok: false; error: string; [k: string]: unknown };
export type ApiResp<T> = ApiOk<T> | ApiFail;

export async function fetchJson<T=unknown>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const r = await fetch(input, {
    headers: { "Content-Type": "application/json", ...(init?.headers||{}) },
    credentials: "include",
    ...init,
  });
  const ct = r.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");
  if (!r.ok) {
    const body = isJson ? await r.json().catch(()=>null) : await r.text();
    const msg = isJson && body?.error ? body.error : `HTTP ${r.status}`;
    throw new Error(msg);
  }
  return (isJson ? await r.json() : (await r.text())) as T;
}
