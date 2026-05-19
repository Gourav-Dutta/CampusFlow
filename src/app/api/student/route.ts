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
    if (session.user.role !== "Student")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const student = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        schools: {
          where: { is_current: true },
          include: { school: true },
        },
        studentClasses: {
            include: {
                classroom: true,
                school: true,
                classSection: true
            }
        }
      },
    });

    return NextResponse.json({
      msg: "Data fetched",
      data: student,
    });
  } catch (error) {
    console.error("Error fetching student data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
