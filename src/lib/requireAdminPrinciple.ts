import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

/**
 * Call this at the top of any Admin-or-Principal-only route handler.
 * Returns null if the user is an Admin or Principal (request may proceed).
 * Returns a 401/403 NextResponse if not (return it immediately from your handler).
 *
 * @example
 * const deny = await requireAdminPrinciple();
 * if (deny) return deny;
 */
export async function requireAdminPrinciple(): Promise<NextResponse | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json(
      { msg: "Unauthorized: Please log in" },
      { status: 401 },
    );
  }

  if (session.user.role !== "Admin" && session.user.role !== "Principal") {
    return NextResponse.json(
      { msg: "Forbidden: Admins and Principals only" },
      { status: 403 },
    );
  }

  return null; // User is an Admin or Principal — allow the request
}
