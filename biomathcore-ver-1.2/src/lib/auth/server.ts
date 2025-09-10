import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

/**
 * Server-side session helper for NextAuth v4 (App Router).
 * Use: const session = await auth()
 */
export async function auth() {
  return getServerSession(authOptions as any);
}

/** Back-compat alias used elsewhere in the codebase */
export const authHelper = auth;
