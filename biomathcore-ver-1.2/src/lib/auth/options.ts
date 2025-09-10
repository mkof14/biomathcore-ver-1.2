import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import AzureADProvider from "next-auth/providers/azure-ad";
import FacebookProvider from "next-auth/providers/facebook";

function hasEnv(keys: string[]) {
  return keys.every((k) => (process.env as any)[k] && String((process.env as any)[k]).length > 0);
}

const providers: any[] = [];

// Email (magic link)
if (hasEnv(["EMAIL_SERVER_HOST","EMAIL_SERVER_USER","EMAIL_SERVER_PASSWORD","EMAIL_FROM"])) {
  providers.push(EmailProvider({
    server: {
      host: process.env.EMAIL_SERVER_HOST!,
      port: Number(process.env.EMAIL_SERVER_PORT || 587),
      auth: { user: process.env.EMAIL_SERVER_USER!, pass: process.env.EMAIL_SERVER_PASSWORD! },
    },
    from: process.env.EMAIL_FROM!,
    maxAge: 60 * 60 * 24,
  }));
}

// Google
if (hasEnv(["GOOGLE_CLIENT_ID","GOOGLE_CLIENT_SECRET"])) {
  providers.push(GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }));
}

// Apple
if (hasEnv(["APPLE_CLIENT_ID","APPLE_KEY_ID","APPLE_TEAM_ID","APPLE_PRIVATE_KEY"])) {
  providers.push(AppleProvider({
    clientId: process.env.APPLE_CLIENT_ID!,
    clientSecret: {
      keyId: process.env.APPLE_KEY_ID!,
      teamId: process.env.APPLE_TEAM_ID!,
      privateKey: process.env.APPLE_PRIVATE_KEY!.split("\\n").join("\n"),
    },
  }));
}

// Microsoft (Outlook/Live/Hotmail) via Azure AD
if (hasEnv(["MICROSOFT_CLIENT_ID","MICROSOFT_CLIENT_SECRET"])) {
  providers.push(AzureADProvider({
    clientId: process.env.MICROSOFT_CLIENT_ID!,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
    tenantId: process.env.MICROSOFT_TENANT_ID || "consumers",
  }));
}

// Facebook
if (hasEnv(["FACEBOOK_CLIENT_ID","FACEBOOK_CLIENT_SECRET"])) {
  providers.push(FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
  }));
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "database" },
  providers,
  pages: { signIn: "/auth" },
};
