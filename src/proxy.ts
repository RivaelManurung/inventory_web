import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-edge";

export default auth((req) => {
  const isAuth = !!req.auth;
  const { nextUrl } = req;
  const isAuthPage =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register");

  const isDashboardRoute = nextUrl.pathname === "/" || 
                           nextUrl.pathname.startsWith("/dashboard") ||
                           nextUrl.pathname.startsWith("/master") ||
                           nextUrl.pathname.startsWith("/users") ||
                           nextUrl.pathname.startsWith("/transaksi") ||
                           nextUrl.pathname.startsWith("/settings") ||
                           nextUrl.pathname.startsWith("/roles") ||
                           nextUrl.pathname.startsWith("/laporan");

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!isAuth && isDashboardRoute) {
    let from = nextUrl.pathname;
    if (nextUrl.search) {
      from += nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
    );
  }

  if (nextUrl.pathname === "/" && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
