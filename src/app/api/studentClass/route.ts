// Principle add it from his page not from student page because principle can manage the student class association of his school.

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { requireAdminPrinciple } from "@/lib/requireAdminPrinciple";

// model StudentClass {
//   id         String @id @default(uuid())
//   student_id String
//   class_id   String
//   school_id  String
//   section_id String
//   year       Int

//   student      User         @relation(fields: [student_id], references: [id], onDelete: Cascade)
//   classroom    ClassRoom    @relation(fields: [class_id], references: [id], onDelete: Cascade)
//   school       School       @relation(fields: [school_id], references: [id], onDelete: Cascade)
//   classSection ClassSection @relation(fields: [section_id], references: [id], onDelete: Cascade)
// }

export async function POST(req: Request) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const formData = await req.formData();
    const studentId = formData.get("studentId") as string;
    const classId = formData.get("classId") as string;
    const schoolId = formData.get("schoolId") as string;
    const sectionId = formData.get("sectionId") as string;
    const year = formData.get("year") as string;
    const validateStudent = await prisma.user.findUnique({
      where: { id: studentId },
    });
    if (!validateStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    const validateClass = await prisma.classRoom.findUnique({
      where: { id: classId },
    });
    if (!validateClass) {
      return NextResponse.json(
        { error: "Classroom not found" },
        { status: 404 },
      );
    }
    const validateSchool = await prisma.school.findUnique({
      where: { id: schoolId },
    });
    if (!validateSchool) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }
    const validateSection = await prisma.classSection.findUnique({
      where: { id: sectionId },
    });
    if (!validateSection) {
      return NextResponse.json(
        { error: "Class section not found" },
        { status: 404 },
      );
    }

    const is_current_raw = formData.get("is_current");
    let is_current_bool: boolean = false;

    if (typeof is_current_raw === "string") {
      const lower = is_current_raw.toLowerCase();
      if (lower === "true") {
        is_current_bool = true;
      } else if (lower === "false") {
        is_current_bool = false;
      } else {
        return NextResponse.json(
          {
            msg: "Invalid Boolean value for is_current. Use 'true' or 'false'.",
          },
          { status: 400 },
        );
      }
    }

    if (is_current_bool) {
      await prisma.studentClass.updateMany({
        where: { student_id: studentId, is_current: true },
        data: { is_current: false },
      });
    }
    const studentClass = await prisma.studentClass.create({
      data: {
        student_id: studentId,
        class_id: classId,
        school_id: schoolId,
        section_id: sectionId,
        year: parseInt(year),
        is_current: is_current_bool,
      },
    });
    return NextResponse.json({
      msg: "Student class association created successfully",
      data: studentClass,
    });
  } catch (error) {
    console.error(
      "Error occurred while creating student class association:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const studentClasses = await prisma.studentClass.findMany();
    return NextResponse.json({ data: studentClasses });
  } catch (error) {
    console.error(
      "Error occurred while fetching student class associations:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function DELETE(req: Request) {
  try {
    const deny = await requireAdmin();
    if (deny) return deny;
    const formData = await req.formData();
    const studentClassId = formData.get("studentClassId") as string;
    const validateStudentClass = await prisma.studentClass.findUnique({
      where: { id: studentClassId },
    });
    if (!validateStudentClass) {
      return NextResponse.json(
        { error: "Student class association not found" },
        { status: 404 },
      );
    }
    await prisma.studentClass.delete({
      where: { id: studentClassId },
    });
    return NextResponse.json({
      msg: "Student class association deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error occurred while deleting student class association:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const formData = await req.formData();
    const studentClassId = formData.get("studentClassId") as string;
    const studentId = formData.get("studentId") as string;
    const classId = formData.get("classId") as string;
    const schoolId = formData.get("schoolId") as string;
    const sectionId = formData.get("sectionId") as string;
    const year = formData.get("year") as string;
    const validateStudentClass = await prisma.studentClass.findUnique({
      where: { id: studentClassId },
    });
    if (!validateStudentClass) {
      return NextResponse.json(
        { error: "Student class association not found" },
        { status: 404 },
      );
    }
    type updateValue = {
      student_id?: string;
      class_id?: string;
      school_id?: string;
      section_id?: string;
      year?: number;
    };
    const updateData: updateValue = {};
    if (studentId) updateData.student_id = studentId;
    if (classId) updateData.class_id = classId;
    if (schoolId) updateData.school_id = schoolId;
    if (sectionId) updateData.section_id = sectionId;
    if (year) updateData.year = parseInt(year);

    const updateStudentClass = await prisma.studentClass.update({
      where: { id: studentClassId },
      data: updateData,
    });

    return NextResponse.json({
      msg: "Student details updated successfully",
      data: updateStudentClass,
    });
  } catch (error) {
    console.error(`An error occured: ${error}`);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
