import type { NextAuthConfig } from "next-auth";

// Shared between the full server-side auth instance (src/lib/auth.ts) and
// middleware. Must stay free of Node-only imports (Prisma, bcrypt) since
// middleware runs on the Edge runtime.
export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "USER" | "ADMIN";
      }
      return session;
    },
  },
};
