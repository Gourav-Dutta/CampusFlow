import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PeriodSlot } from "@/generated/prisma";

// // I can get student school id of a partcular class.
// // This is for the student. He can choose subject for a particular class. We find student's school'id, class'id and then link it .
// model StudentSubjectEnrollment {
//   id          String @id @default(uuid())
//   student_id  String
//   class_id    String
//   school_id   String
//   section_id  String
//   subject_id  String
//   stu_class_id String
//   period_slot PeriodSlot @default(Morning)
//   year        Int

//   student      User         @relation(fields: [student_id], references: [id], onDelete: Cascade)
//   classroom    ClassRoom    @relation(fields: [class_id], references: [id], onDelete: Cascade)
//   subject      Subject      @relation(fields: [subject_id], references: [id], onDelete: Cascade)
//   school       School       @relation(fields: [school_id], references: [id], onDelete: Cascade)
//   classSection ClassSection @relation(fields: [section_id], references: [id], onDelete: Cascade)
//   studentClass StudentClass @relation(fields: [stu_class_id], references: [id], onDelete: Cascade)
//   @@unique([student_id, subject_id, year])
// }

// Student can't update or change subject later.

// Student only choose subject and period, remaining we fill from fetching stu_details from studentClass table.
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const formData = await req.formData();

    const stuDetails = await prisma.studentClass.findMany({
      where: { student_id: userId, is_current: true },
    });

    const classId = stuDetails[0].class_id;
    const schoolId = stuDetails[0].school_id;
    const sectionId = stuDetails[0].section_id;
    const stu_class_id = stuDetails[0].id;
    const subjectId = formData.get("subjectId") as string;
    const periodSlot = formData.get("periodSlot") as PeriodSlot;
    const year = new Date().getFullYear();

    const validateSubject = await prisma.subject.findFirst({
      where: { id: subjectId },
    });
    if (!validateSubject)
      return NextResponse.json(
        { msg: "Subject not validate" },
        { status: 404 },
      );

    const newEnrollment = await prisma.studentSubjectEnrollment.create({
      data: {
        student_id: userId,
        class_id: classId,
        school_id: schoolId,
        section_id: sectionId,
        subject_id: subjectId,
        stu_class_id: stu_class_id,
        year: year,
        period_slot: periodSlot,
      },
    });

    return NextResponse.json(
      {
        data: newEnrollment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error fetching student subject enrollment data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentId = session.user.id;

    const stu_details = await prisma.studentClass.findMany({
      where: { student_id: studentId, is_current: true },
    });

    const enrolledSubjects = await prisma.studentSubjectEnrollment.findMany({
      where: { stu_class_id: stu_details[0].id },
      include: {
        subject: true,
        classroom: true,
        school: true,
        classSection: true,
      }
    });

    return NextResponse.json(
      {
        data: enrolledSubjects,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching student subject enrollment data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
