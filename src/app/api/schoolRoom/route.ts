// model SchoolRoom {
//   id        String @id @default(uuid())
//   school_id String
//   room_no   String
//   capacity  Int
//   type      String

//   school               School                @relation(fields: [school_id], references: [id], onDelete: Cascade)
//   classSubjectTeachers ClassSubjectTeacher[]
// }

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminPrinciple } from "@/lib/requireAdminPrinciple";

export async function POST(req: Request) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const formData = await req.formData();
    const school_id = formData.get("schoolId") as string;
    const room_no = formData.get("roomNo") as string;
    const capacity = formData.get("roomCapacity") as string;
    const type = formData.get("roomType") as string;

    const validateSchool = await prisma.school.findUnique({
      where: { id: school_id },
    });
    if (!validateSchool)
      return NextResponse.json({ msg: "School not exists" }, { status: 404 });
    const newSchoolRoom = await prisma.schoolRoom.create({
      data: {
        school_id: school_id,
        room_no: room_no,
        capacity: parseInt(capacity),
        type: type,
      },
    });

    return NextResponse.json(
      {
        msg: "New school rool added successfully",
        data: newSchoolRoom,
      },
      { status: 202 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        msg: `Error occured ${error}`,
      },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const schoolRooms = await prisma.schoolRoom.findMany({});
    return NextResponse.json({
      msg: "Data found",
      data: schoolRooms,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        msg: `Error occured ${error}`,
      },
      { status: 500 },
    );
  }
}
