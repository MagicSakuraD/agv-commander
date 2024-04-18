// import NextAuth from "next-auth";
// import authConfig from "./auth.config";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { db } from "@/lib/db";

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   adapter: PrismaAdapter(db),
//   session: { strategy: "jwt" },
//   ...authConfig,
// });
"use server";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { LoginSchema } from "@/lib/schema";

async function getUser(email: string) {
  try {
    // 使用Prisma客户端查询用户
    const user = await db.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = LoginSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password!);

          if (passwordsMatch) return user;
        }
        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
