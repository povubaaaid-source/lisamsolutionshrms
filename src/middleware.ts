import { NextResponse, type NextRequest } from "next/server";
import { canRoleAccessPath, getDefaultRouteForRole, isPublicPath, normalizeRole } from "@/lib/auth-contract";

const TOKEN_COOKIE = "token";
const ROLE_COOKIE = "user_role";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const role = normalizeRole(request.cookies.get(ROLE_COOKIE)?.value);

  if (isPublicPath(pathname)) {
    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL(getDefaultRouteForRole(role), request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (!canRoleAccessPath(role, pathname)) {
    const unauthorizedUrl = new URL("/unauthorized", request.url);
    unauthorizedUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(unauthorizedUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
