import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Deferred: this config is wired up but not mounted behind an
// /api/auth/[...nextauth] route yet, and no middleware protects app routes.
// Login/Register/Forgot Password render pure UI forms with local state —
// submitting them does not call `signIn`/`signOut` in this phase.

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async () => {
        // Real credential verification against the database is added when
        // this phase's mock data is replaced with Prisma-backed queries.
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
