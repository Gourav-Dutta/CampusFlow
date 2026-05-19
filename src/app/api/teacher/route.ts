import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    if (session.user.role !== "Teacher")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const techer = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        taughtSubjects: {
          include: {
            subject: true,
            classroom: true,
            school: true,
            classSection: true,
            schoolRoom: true,
          },
        },
        schools: {
          where: { is_current: true },
          include: { school: true },
        },
      },
    });

    return NextResponse.json({
      msg: "Data fetched",
      data: techer,
    });
  } catch (error) {
    console.error("Error fetching teacher data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
