import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

/**
 * Call this at the top of any Admin-only route handler.
 * Returns null if the user is an Admin (request may proceed).
 * Returns a 401/403 NextResponse if not [either there is no cookie or user is not Admin] (return it immediately from your handler).
 *
 * @example
 * const deny = await requireAdmin();
 * if (deny) return deny;
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  //   console.log(session);
  //   console.log("RequireAdmin start");
  if (!session?.user) {
    return NextResponse.json(
      { msg: "Unauthorized: Please log in" },
      { status: 401 },
    );
  }

  if (session.user.role !== "Admin") {
    return NextResponse.json(
      { msg: "Forbidden: Admins only" },
      { status: 403 },
    );
  }

  return null; // Client is an Admin — allow the request
}
