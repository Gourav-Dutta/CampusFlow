import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ExamComponent, ExamType } from "@/generated/prisma";


// model StudentMarks {
//   id             String        @id @default(uuid())
//   student_id     String
//   subject_id     String
//   marks          Int
//   year           Int
//   grade          String
//   exam_type      ExamType
//   exam_component ExamComponent

//   student      User         @relation(fields: [student_id], references: [id])
//   subject      Subject      @relation(fields: [subject_id], references: [id])
//   // classroom    ClassRoom    @relation(fields: [class_id], references: [id])
//   // school       School       @relation(fields: [school_id], references: [id])
//   // classSection ClassSection @relation(fields: [section_id], references: [id])
// }



// Test Pending
export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const formData = await req.formData();
  const studentId = formData.get("studentId") as string;
  const subject_id = formData.get("subjectId") as string;
  const marks = parseInt(formData.get("marks") as string, 10);
  const examType = formData.get("examType") as ExamType;
  const examComponent = formData.get("examComponent") as ExamComponent;
  const grade = formData.get("grade") as string;
  const year = new Date().getFullYear() as number;
    // Fetch student details to get class_id, school_id, section_id
    const stuDetails = await prisma.studentClass.findMany({
      where: { student_id: studentId, is_current: true },
    });

    const class_id = stuDetails[0].class_id;
    const school_id = stuDetails[0].school_id;
    const section_id = stuDetails[0].section_id;

  // Using the class,school, section and subject we check wither the teacher is assigned to that class/subject/school/section or not.
  const isAuthorized = await prisma.classSubjectTeacher.findFirst({
    where: {
      teacher_id: userId,
      class_id,
      section_id,
      subject_id,
      school_id,
      year,
    },
  });

  if (!isAuthorized) {
    return NextResponse.json(
      { error: "Forbidden: You are not assigned to this class/subject/section" },
      { status: 403 }
    );
  }
  
  const stuMarks = await prisma.studentMarks.create({
    data: {
      student_id: studentId,
      subject_id,
      marks,
      year,
      grade: grade, 
      exam_type: examType,
      exam_component: examComponent,
      class_id,
      school_id,
      section_id
    }
  })
 
}