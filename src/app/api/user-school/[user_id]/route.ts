import { userRole } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminPrinciple } from "@/lib/requireAdminPrinciple";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Once we enter a user record in the user_school table, we can't delete or update it usless thge user deleted from our portal.
// This is for maintain a record of the user's association with the school.
// We can add a new record if the user changes school.
// Only admin and principle can add or view the user-school association.



// pending task: This params API does't need i am retriving user-id from headers, have to shift it.
export async function GET(
  req: Request,
  { params }: { params: { user_id: string } },
) {
  try {
    // const deny = await requireAdminPrinciple();
    // if (deny) return deny;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userCurrentSchool = await prisma.userSchool.findMany({
      where: { user_id: userId, is_current: true },
    });
    return NextResponse.json({
      msg: "User schools retrieved successfully",
      data: userCurrentSchool,
    });
  } catch (error) {
    console.error("Error occurred while retrieving user schools:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
