export type PlanCode =
  | "free"
  | "basic"
  | "pro"
  | "psychology_addon"
  | "sexual_health_addon";

export function getUserPlans(userId: string): Promise<PlanCode[]> {
  // TODO: подставить реальные планы пользователя
  return Promise.resolve(["basic"]);
}

export function isAdmin(): boolean {
  if (typeof process !== "undefined") {
    return process.env.NEXT_PUBLIC_ADMIN_MODE === "1" || process.env.NEXT_PUBLIC_ADMIN_MODE === "true";
  }
  return false;
}

export function canSeeForm(form: { visibility: string; gates?: string[] }, userPlans: PlanCode[]): boolean {
  if (isAdmin()) return true;
  if (form.visibility === "PUBLIC") return true;
  if (form.visibility === "INVITE_ONLY") return false; // позже — проверка инвайтов
  const gates = form.gates || [];
  return gates.some((g) => userPlans.includes(g as PlanCode));
}
