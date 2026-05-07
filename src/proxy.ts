import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canRoleAccessPath, getDefaultRouteForRole, isPublicPath, normalizeRole } from "@/lib/auth-contract";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = normalizeRole(request.cookies.get("user_role")?.value);
  const { pathname } = request.nextUrl;

  if (!token && !isPublicPath(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isPublicPath(pathname)) {
    return NextResponse.redirect(new URL(getDefaultRouteForRole(role), request.url));
  }

  if (token && !canRoleAccessPath(role, pathname)) {
    return NextResponse.redirect(new URL(getDefaultRouteForRole(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|img).*)"],
};
