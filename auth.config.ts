import GitHub from "next-auth/providers/github";
// import type { NextAuthConfig } from "next-auth";

// export default { providers: [GitHub] } satisfies NextAuthConfig;

import { Github } from "@icon-park/react";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [GitHub],
} satisfies NextAuthConfig;
