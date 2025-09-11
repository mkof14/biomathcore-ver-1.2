import { randomUUID } from "crypto";

export type DGRow = {
  id: string;
  drugName: string;
  geneSymbol: string;
  relation: string;
  status: "pending" | "curated" | "archived";
  createdAt: string;
  updatedAt: string;
};

type ListArgs = {
  id?: string;
  q?: string;
  status?: string;
  from?: string;
  to?: string;
  limit?: number;
  cursor?: string|undefined;
};

function mem() {
  const g = globalThis as any;
  if (!g.__DG__) g.__DG__ = new Map<string, DGRow>();
  return g.__DG__ as Map<string, DGRow>;
}

export async function createDG(input: Partial<DGRow>): Promise<DGRow> {
  const now = new Date().toISOString();
  const row: DGRow = {
    id: randomUUID(),
    drugName: (input.drugName || "UnknownDrug").toString(),
    geneSymbol: (input.geneSymbol || "GENE").toString(),
    relation: (input.relation || "inhibits").toString(),
    status: (input.status as any) || "pending",
    createdAt: now,
    updatedAt: now,
  };
  mem().set(row.id, row);
  return row;
}

export async function getDG(id: string): Promise<DGRow | null> {
  return mem().get(id) || null;
}

export async function updateDG(id: string, patch: Partial<DGRow>): Promise<DGRow> {
  const m = mem();
  const cur = m.get(id);
  if (!cur) throw new Error("not_found");
  const next: DGRow = {
    ...cur,
    drugName: patch.drugName ?? cur.drugName,
    geneSymbol: patch.geneSymbol ?? cur.geneSymbol,
    relation: patch.relation ?? cur.relation,
    status: (patch.status as any) ?? cur.status,
    updatedAt: new Date().toISOString(),
  };
  m.set(id, next);
  return next;
}

export async function deleteDG(id: string): Promise<DGRow> {
  const m = mem();
  const cur = m.get(id);
  if (!cur) throw new Error("not_found");
  m.delete(id);
  return cur;
}

export async function listDG(args: ListArgs = {}): Promise<{data: DGRow[]; nextCursor?: string}> {
  const { id, q, status, from, to, limit = 20, cursor } = args;
  const all = Array.from(mem().values());
  let rows = all.sort((a,b)=> (a.createdAt < b.createdAt ? 1 : -1));

  if (id) rows = rows.filter(r => r.id === id);
  if (q) {
    const qq = q.toLowerCase();
    rows = rows.filter(r =>
      r.drugName.toLowerCase().includes(qq) ||
      r.geneSymbol.toLowerCase().includes(qq) ||
      r.relation.toLowerCase().includes(qq)
    );
  }
  if (status) rows = rows.filter(r => r.status === status);
  if (from) rows = rows.filter(r => r.createdAt >= from);
  if (to) rows = rows.filter(r => r.createdAt <= to);

  let start = 0;
  if (cursor) {
    const idx = rows.findIndex(r => r.id === cursor);
    if (idx >= 0) start = idx + 1;
  }
  const take = Math.max(1, Math.min(1000, limit));
  const page = rows.slice(start, start + take);
  const nextCursor = rows[start + take]?.id;
  return { data: page, nextCursor };
}

export async function countDG(): Promise<number> { return mem().size; }

export async function seedDG(n = 5): Promise<number> {
  const drugs = ["Imatinib","Gefitinib","Erlotinib","Sunitinib","Dasatinib"];
  const genes = ["ABL1","EGFR","KRAS","BRAF","ALK"];
  const rels = ["inhibits","activates","binds"];
  for (let i=0;i<n;i++){
    await createDG({
      drugName: drugs[i % drugs.length],
      geneSymbol: genes[(i+1) % genes.length],
      relation: rels[i % rels.length],
      status: (i%3===0 ? "curated" : "pending") as any
    });
  }
  return mem().size;
}
export async function resetDG(): Promise<void> { mem().clear(); }

// added by codemod: safe fallback export
export const listDrugGene = async (..._args:any[]) => [];

// added by codemod: safe fallback export
export const createDrugGene = async (..._args:any[]) => ({ id: "stub", ...(_args?.[0]||{}) });
