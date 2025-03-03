import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const protectedRoutes = [
  { path: "/admin", allowedRoles: [1] },
  { path: "/seller", allowedRoles: [2, 3] },
];

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const accessToken = token?.accessToken;

  const { pathname } = req.nextUrl;

  if (!accessToken) {
    if (
      pathname.startsWith("/authen/login") ||
      pathname.startsWith("/authen/signup")
    ) {
      return NextResponse.next(); // Allow access to login/signup
    }
    return NextResponse.redirect(new URL("/authen/login", req.url));
  }
  if (
    token &&
    (pathname.startsWith("/authen/login") ||
      pathname.startsWith("/authen/signup"))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const userRoleId = token.roleId; // Ensure roleId is stored in NextAuth session

  const matchedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route.path)
  );

  // if (pathname.startsWith("/seller") && !isProvider) {
  //   return NextResponse.redirect(new URL("/unauthorized", req.url));
  // }

  if (matchedRoute && !matchedRoute.allowedRoles.includes(userRoleId)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/seller/:path*", "/authen/:path*"],
};
