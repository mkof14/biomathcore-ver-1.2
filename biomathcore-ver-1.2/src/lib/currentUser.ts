import { cookies } from "next/headers";

type Plan = "free"|"standard"|"premium";
export type CurrentUser = { id: string; age?: number; plan?: Plan } | null;

async function getFromNextAuth(): Promise<CurrentUser> {
  try {
   
    const { getServerSession } = await import("next-auth");
   
    let authOptions: any = undefined;
    try { authOptions = (await import("@/app/api/auth/[...nextauth]/route")).authOptions; } catch {}
    const session = await getServerSession(authOptions);
    if (!session) return null;

   
    const u = session.user as any;
    return {
      id: u?.id || "user",
      age: typeof u?.age === "number" ? u.age : undefined,
      plan: (u?.plan as Plan) || "free"
    };
  } catch {
    return null;
  }
}

function getFromDevCookie(): CurrentUser {
  const jar = cookies();
  const raw = jar.get("bmc_dev_user")?.value;
  if (!raw) return null;
  try {
    const u = JSON.parse(raw);
    return {
      id: String(u.id || "dev"),
      age: typeof u.age === "number" ? u.age : undefined,
      plan: (u.plan as Plan) || "free",
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const a = await getFromNextAuth();
  if (a) return a;
  return getFromDevCookie();
}
