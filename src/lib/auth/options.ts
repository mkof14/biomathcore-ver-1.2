import type { NextAuthOptions } from "next-auth";

/** Super-minimal auth options for demo build (no DB adapter) */
export const authOptions: NextAuthOptions = {
  providers: [],
  session: { strategy: "jwt" },
  pages: { signIn: "/auth" },
};
export default authOptions;
