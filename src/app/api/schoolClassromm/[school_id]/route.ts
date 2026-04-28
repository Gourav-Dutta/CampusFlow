// This to get, update, delete a classRomm of a particular school.
// This is actully CRUD on class depends on school.
// Only for ADMIN & PRINCIPLE

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminPrinciple } from "@/lib/requireAdminPrinciple";

export async function GET(
  req: Request,
  { params }: { params: { school_id: string } },
) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const findClassRoom = await prisma.classRoom.findMany({
      where: { school_id: params.school_id },
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

// Delete all class of a school. Suppose school is deleted, then all classRomm related to that school have to deleted
export async function DELETE(
  req: Request,
  { params }: { params: { school_id: string } },
) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const findClassRoom = await prisma.classRoom.findMany({
      where: { school_id: params.school_id },
    });
    if (!findClassRoom) {
      return NextResponse.json({
        msg: "No Classroom found",
      });
    }
    const deleteClassRoom = await prisma.classRoom.deleteMany({
      where: { school_id: params.school_id },
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
