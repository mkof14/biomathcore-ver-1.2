// src/lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";


export async function getServerSessionSafe() {
  try {
    const session = await getServerSession(authOptions);
    return session;
  } catch {
    return null;
  }
}


export function requireAuthRedirectURL() {
  return "/sign-in?reason=auth";
}
