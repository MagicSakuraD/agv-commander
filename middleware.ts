// import authConfig from "@/auth.config";
// import NextAuth from "next-auth";

// import {
//   authRoutes,
//   publicRoutes,
//   apiAuthPrefix,
//   DEFAULT_LOGIN_REDIRECT,
// } from "@/routes";
// import { NextResponse } from "next/server";

// const { auth } = NextAuth(authConfig);

// export default auth((req) => {
//   const { nextUrl } = req;
//   const isLoggedIn = !!req.auth;

//   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
//   const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
//   const isAuthRoute = authRoutes.includes(nextUrl.pathname);

//   // if (isApiAuthRoute) {
//   //   return NextResponse.next();
//   // }

//   // if (isAuthRoute && isLoggedIn) {
//   //   return NextResponse.redirect(
//   //     new URL(DEFAULT_LOGIN_REDIRECT, nextUrl.origin)
//   //   );
//   // }

//   // if (!isLoggedIn && !isPublicRoute) {
//   //   return NextResponse.redirect(new URL("/", nextUrl.origin));
//   // }

//   // return NextResponse.next();
// });

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
