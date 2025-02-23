import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const protectedRoutes = [
  { path: "/admin", allowedRoles: [1] },
  { path: "/seller", allowedRoles: [2, 3] }, 
];

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  

  if (!token || !token.roleId) {
    return NextResponse.redirect(new URL("/authen/login", req.url));
  }

  const userRoleId = token.roleId; // Ensure roleId is stored in NextAuth session
  const { pathname } = req.nextUrl;

  const matchedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route.path)
  );

  if (matchedRoute && !matchedRoute.allowedRoles.includes(userRoleId)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/seller/:path*"],
};

