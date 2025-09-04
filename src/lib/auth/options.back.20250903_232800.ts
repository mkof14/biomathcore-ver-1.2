import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";

import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import AzureADProvider from "next-auth/providers/azure-ad";   // <— используем azure-ad
import FacebookProvider from "next-auth/providers/facebook";
import YahooProvider from "next-auth/providers/yahoo";

const providers: any[] = [];

// Email (magic link)
if (
  process.env.EMAIL_SERVER_HOST &&
  process.env.EMAIL_SERVER_USER &&
  process.env.EMAIL_SERVER_PASSWORD &&
  process.env.EMAIL_FROM
) {
  providers.push(
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST!,
        port: Number(process.env.EMAIL_SERVER_PORT || 587),
        auth: { user: process.env.EMAIL_SERVER_USER!, pass: process.env.EMAIL_SERVER_PASSWORD! },
      },
      from: process.env.EMAIL_FROM!,
      maxAge: 60 * 60 * 24,
    })
  );
}

// Google
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }));
}

// Apple
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_KEY_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_PRIVATE_KEY) {
  providers.push(AppleProvider({
    clientId: process.env.APPLE_CLIENT_ID!,
    clientSecret: {
      keyId: process.env.APPLE_KEY_ID!,
      teamId: process.env.APPLE_TEAM_ID!,
      privateKey: process.env.APPLE_PRIVATE_KEY!.split("\\n").join("\n"),
    },
  }));
}

// Microsoft (consumer: Outlook/Live/Hotmail) — через azure-ad с tenantId=consumers
if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
  const tenant = process.env.MICROSOFT_TENANT_ID || "consumers";
  providers.push(AzureADProvider({
    clientId: process.env.MICROSOFT_CLIENT_ID!,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
    tenantId: tenant, // "consumers" — личные аккаунты, "common" — личные + рабочие
  }));
}

// Facebook
if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
  }));
}

// Yahoo
if (process.env.YAHOO_CLIENT_ID && process.env.YAHOO_CLIENT_SECRET) {
  providers.push(YahooProvider({
    clientId: process.env.YAHOO_CLIENT_ID!,
    clientSecret: process.env.YAHOO_CLIENT_SECRET!,
  }));
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "database" },
  providers,
  pages: { signIn: "/auth" },
};
