import { cookies } from "next/headers";
import { getServerSession } from "next-auth";

export async function isDevCookiePresent() {
  const jar = await cookies();
  const raw = jar.get("bmc_dev_user")?.value;
  return !!raw && raw.trim().length > 0;
}

export async function isAuthenticated() {
  try {
    const session = await getServerSession().catch(() => null);
    if (session && (session as any).user) return true;
  } catch {}
  if (await isDevCookiePresent()) return true;
  return false;
}
