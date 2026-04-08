// Only for ADMIN & PRINCIPLE
// One a classromm is specify for a particular school, we can't change school-id in class section\
// Thisis not physical classRoom but actual class like class VI etc.

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminPrinciple } from "@/lib/requireAdminPrinciple";

export async function GET(
  req: Request,
  { params }: { params: { class_id: string } },
) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const findClassRoom = await prisma.classRoom.findUnique({
      where: { id: params.class_id },
      include: {
        school: true,
      },
    });
    if (!findClassRoom) {
      return NextResponse.json({
        msg: "Classroom not found",
      });
    }
    return NextResponse.json({
      msg: "Classroom fetched successfully",
      data: findClassRoom,
    });
  } catch (err: any) {
    console.error("Database Error:", err);
    return NextResponse.json(
      { msg: `An error occurred: ${err.message}` },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { class_id: string } },
) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const validateClassRoom = await prisma.classRoom.findUnique({
      where: { id: params.class_id },
    });
    if (!validateClassRoom) {
      return NextResponse.json({
        msg: "Classroom not found",
      });
    }
    const updateClassRoom = await prisma.classRoom.update({
      where: { id: params.class_id },
      data: {
        name,
      },
    });
    return NextResponse.json({
      msg: "Classroom updated successfully",
      data: updateClassRoom,
    });
  } catch (err: any) {
    console.error("Database Error:", err);
    return NextResponse.json(
      { msg: `An error occurred: ${err.message}` },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { class_id: string } },
) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const findClassRoom = await prisma.classRoom.findUnique({
      where: { id: params.class_id },
    });
    if (!findClassRoom) {
      return NextResponse.json({
        msg: "Classroom not found",
      });
    }
    const deleteClassRoom = await prisma.classRoom.delete({
      where: { id: params.class_id },
    });
    return NextResponse.json({
      msg: "Classroom deleted successfully",
      data: deleteClassRoom,
    });
  } catch (err: any) {
    console.error("Database Error:", err);
    return NextResponse.json(
      { msg: `An error occurred: ${err.message}` },
      { status: 500 },
    );
  }
}
