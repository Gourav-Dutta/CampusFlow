import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/api/school") ||
    pathname.startsWith("/api/users") ||
    pathname.startsWith("/api/user-address") ||
    pathname.startsWith("/api/user-document");

  if (isProtected) {
    // For role checks (Admin), requireAdmin() is used inside the route handler.
    const sessionCookie =
      request.cookies.get("better-auth.session_token") ??
      request.cookies.get("__Secure-better-auth.session_token");
    // The __Secure- prefix is a special flag used by browsers to provide an extra layer of security for your session tokens.
    //  It’s part of a web security standard called Cookie Prefixes.
    console.log(sessionCookie);
    if (!sessionCookie?.value) {
      return NextResponse.json(
        { msg: "Unauthorized: Please log in" },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/school",
    "/api/school/:path*",
    "/api/users",
    "/api/users/:path*",
    "/api/user-address",
    "/api/user-address/:path*",
    "/api/user-document",
    "/api/user-document/:path*",
  ],
};
