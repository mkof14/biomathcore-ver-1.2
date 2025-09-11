// src/lib/auth.ts
import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
// Placeholders for future OAuths (commented until configured)
// import AppleProvider from "next-auth/providers/apple";
// import AzureADProvider from "next-auth/providers/azure-ad";
// import FacebookProvider from "next-auth/providers/facebook";
// import YahooProvider from "next-auth/providers/yahoo";

const emailServer = process.env.EMAIL_SERVER;
const emailFrom = process.env.EMAIL_FROM || "no-reply@example.com";

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: emailServer,
      from: emailFrom,
      maxAge: 24 * 60 * 60, // 24h
    }),
    // AppleProvider({ clientId: process.env.APPLE_CLIENT_ID!, clientSecret: process.env.APPLE_CLIENT_SECRET! }),
    // AzureADProvider({ clientId: process.env.AZURE_AD_CLIENT_ID!, clientSecret: process.env.AZURE_AD_CLIENT_SECRET!, tenantId: process.env.AZURE_AD_TENANT_ID || "common" }),
    // FacebookProvider({ clientId: process.env.FACEBOOK_CLIENT_ID!, clientSecret: process.env.FACEBOOK_CLIENT_SECRET! }),
    // YahooProvider({ clientId: process.env.YAHOO_CLIENT_ID!, clientSecret: process.env.YAHOO_CLIENT_SECRET! }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth", // ensure this page exists; no changes to frozen public pages
  },
  callbacks: {
    async jwt({ token }) { return token; },
    async session({ session, token }) { return session; },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export function requireAuthRedirectURL() {
  return "/sign-in?reason=auth"; // keep if referenced elsewhere
}

export async function getSession() {
  return getServerSession(authOptions);
}export async function getServerSessionSafe(){ return null }
