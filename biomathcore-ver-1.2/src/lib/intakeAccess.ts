type QuestionnaireMeta={ id:string; version:number; title:string; description?:string; minAge?:number; requiresPlan?:"free"|"standard"|"premium"; sections:any[]; };
export type User = {
  id: string;
  age?: number;
  plan?: "free"|"standard"|"premium";
};

export function canAccess(q: QuestionnaireMeta, user: User|null) {
  if (!q) return { allowed: false, reason: "Not found" };

  // Age restriction
  if (q.minAge && (user?.age ?? 0) < q.minAge) {
    return { allowed: false, reason: "Age restricted" };
  }

  // Plan restriction
  if (q.requiresPlan) {
    const current = user?.plan || "free";
    const rank = { free: 0, standard: 1, premium: 2 }[current];
    const needed = { free: 0, standard: 1, premium: 2 }[q.requiresPlan];
    if (rank < needed) {
      return { allowed: false, reason: "Upgrade required", requiredPlan: q.requiresPlan };
    }
  }

  return { allowed: true };
}
