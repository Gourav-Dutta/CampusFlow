import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminPrinciple } from "@/lib/requireAdminPrinciple";

export async function POST(req: Request) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const school_id = formData.get("school_id") as string;
    const validateSchool = await prisma.school.findUnique({
      where: { id: school_id },
    });
    if (!validateSchool) {
      return NextResponse.json({
        msg: "School not found",
      });
    }
    const newClassRoom = await prisma.classRoom.create({
      data: {
        name,
        school_id,
      },
    });
    return NextResponse.json({
      msg: "Classroom created successfully",
      data: newClassRoom,
    });
  } catch (err: any) {
    console.error("Database Error:", err);
    return NextResponse.json(
      { msg: `An error occurred: ${err.message}` },
      { status: 500 },
    );
  }
}
