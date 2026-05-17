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
import { RoomType } from "@/generated/prisma";
import { RoomStatus } from "@/generated/prisma";

export async function POST(req: Request) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const formData = await req.formData();
    const school_id = formData.get("schoolId") as string;
    const room_no = formData.get("roomNo") as string;
    const capacity = formData.get("roomCapacity") as string;
    const type = formData.get("roomType") as RoomType;
    const status = formData.get("roomStatus") as RoomStatus;

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
        status: status,
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


// Get all room based on school id.
export async function GET(req: Request) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const {searchParams} = new URL(req.url);
    const schoolId = searchParams.get("schoolId") as string;
    const schoolRooms = await prisma.schoolRoom.findMany({
      where: { school_id: schoolId }
    });
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


export async function PUT(req: Request){
  try{
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const formData = await req.formData();
    const id = formData.get("roomId") as string;
    const Status = formData.get("roomStatus") as RoomStatus;
    const Type = formData.get("roomType") as RoomType;
    const capacity= formData.get("roomCapacity") as string;
    
    type UpdateValue = {
    status?: RoomStatus,
    type?: RoomType,
    capacity?: number
    };

    const newValue: UpdateValue = {};

    if(Status) newValue.status = Status;
    if(Type) newValue.type = Type;
    if(capacity) newValue.capacity = parseInt(capacity);

    const updatedValue = await prisma.schoolRoom.update({
      where: { id: id},
      data: newValue
    });

    return NextResponse.json({
      msg: "Room updated successfully",
      data: updatedValue
    });
  }catch(error){
    console.error(error);
    return NextResponse.json({
      msg: `Error occured ${error}`,
      data: error
    })
  }
}
