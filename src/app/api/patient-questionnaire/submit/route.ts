import { NextResponse } from "next/server";

// простое in-memory «хранилище» для девелопмента
const store: any[] = [];

export async function POST(req: Request) {
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

  const body = await req.json();
  // Можно добавить валидацию здесь
  store.push({ at: new Date().toISOString(), ...body });
  return NextResponse.json({ ok: true, saved: { id: store.length, at: store.at(-1).at } });
}

export {};
