import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth }) {
      return true; // Use proxy.ts for custom redirection logic
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.roleName = (user as any).roleName
        token.permissions = (user as any).permissions
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role
        ;(session.user as any).roleName = token.roleName
        ;(session.user as any).permissions = token.permissions
      }
      return session
    }
  },
  providers: [], // Add providers with an empty array for edge compatibility
} satisfies NextAuthConfig
