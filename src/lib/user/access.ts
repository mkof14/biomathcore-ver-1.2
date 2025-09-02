export type PlanCode = "basic"|"premium"|"sexual-health-package"|"mental-health-package";
export type Audience = "all"|"adult";

export type CurrentUser = {
  id: string;
  email?: string;
  birthDate?: string | null;
  plans: PlanCode[];
};

export function isAdult(birthDate?: string | null): boolean {
  if (!birthDate) return false;
  const dob = new Date(birthDate);
  if (isNaN(dob.getTime())) return false;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age >= 18;
}

export function hasPlan(user: CurrentUser | null, required?: PlanCode): boolean {
  if (!required) return true;
  if (!user) return false;
  return user.plans.includes(required);
}

export function canSeeAudience(user: CurrentUser | null, audience: Audience): boolean {
  if (audience === "all") return true;
  return isAdult(user?.birthDate ?? null);
}

export function canAccessQuestionnaire(user: CurrentUser | null, opts: { audience: Audience; requiredPlan?: PlanCode }): boolean {
  return canSeeAudience(user, opts.audience) && hasPlan(user, opts.requiredPlan);
}
