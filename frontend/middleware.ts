import { NextRequest, NextResponse } from "next/server";

function getJwtPayload(token: string) {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const decoded = typeof atob === "function" ? atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")) : "";
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedPaths = ["/checkout", "/orders", "/customize", "/admin"];
  const matchesProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  if (!matchesProtected) return NextResponse.next();

  const token = request.cookies.get("accessToken")?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = getJwtPayload(token);
  if (pathname.startsWith("/admin") && payload?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/customize/:path*", "/admin/:path*"],
};
