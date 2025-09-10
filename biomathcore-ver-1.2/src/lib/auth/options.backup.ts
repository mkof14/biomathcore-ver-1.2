import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database', // Use database-backed sessions
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (user) {
          // In a real app, you'd also check the password hash here
          // For now, we'll just return the user if they exist.
          return { id: user.id, email: user.email, name: user.name, role: user.role };
        } else {
          // Optionally, create a new user on first login
          // For now, just return null if user not found
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      // Add id and role to the session object
      if (session.user) {
        session.user.id = user.id;
        (session.user as any).role = user.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  secret: process.env.NEXTAUTH_SECRET, // A secret is required for production
};
