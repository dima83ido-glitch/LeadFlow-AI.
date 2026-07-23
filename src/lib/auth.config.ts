import type { NextAuthConfig } from "next-auth";

// Shared between the full server-side auth instance (src/lib/auth.ts) and
// middleware. Must stay free of Node-only imports (Prisma, bcrypt) since
// middleware runs on the Edge runtime.

// Auth.js always issues the session cookie/JWT with the same physical
// maxAge (below), so "remember me" can't shorten the cookie itself — instead
// a non-remembered session self-invalidates by returning null from the jwt
// callback once this much wall-clock time has passed since login. The
// browser cookie technically survives longer, but the app treats the
// session as signed out well before that.
const NOT_REMEMBERED_SESSION_MS = 24 * 60 * 60 * 1000;

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
        token.remember = Boolean(user.remember);
        token.loginAt = Date.now();
        return token;
      }

      if (!token.remember) {
        const loginAt = (token.loginAt as number | undefined) ?? Date.now();
        if (Date.now() - loginAt > NOT_REMEMBERED_SESSION_MS) {
          return null;
        }
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
