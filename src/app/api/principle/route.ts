import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    const deny = await requireAdmin();
    if (deny) return deny;
    const principals = await prisma.user.findMany({
      where: {
        role: "Principal",
        principalOf: {
          none: {},
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone_no: true,
      },
    });

    return NextResponse.json({
      msg: "Unassigned principals fetched successfully",
      data: principals,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        msg: err.message,
      },
      { status: 500 },
    );
  }
}
