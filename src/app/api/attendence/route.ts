import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AttendanceStatus } from "@/generated/prisma";
import { requireAdminPrinciple } from "@/lib/requireAdminPrinciple";

// // model Attendance {
// //   id         String           @id @default(uuid())
// //   class_id   String
// //   student_id String
// //   school_id  String
// //   section_id String
// //   subject_id String
// //   teacher_id String
// //   status     AttendanceStatus
// //   date       DateTime
// //   year       Int

// //   classroom ClassRoom @relation(fields: [class_id], references: [id])
// //   school    School    @relation(fields: [school_id], references: [id])
// //   subject   Subject   @relation(fields: [subject_id], references: [id])

// //   student      User         @relation("StudentAttendance", fields: [student_id], references: [id])
// //   teacher      User         @relation("TeacherAttendance", fields: [teacher_id], references: [id])
// //   classSection ClassSection @relation(fields: [section_id], references: [id])
// // }

export async function POST(req: Request) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const formData = await req.formData();
    const studentId = formData.get("studentId") as string;
    const classId = formData.get("classId") as string;
    const schoolId = formData.get("schoolId") as string;
    const sectionId = formData.get("sectionId") as string;
    const subjectId = formData.get("subjectId") as string;
    const teacherId = formData.get("teacherId") as string;
    const status = formData.get("status") as AttendanceStatus;
    const date = new Date();
    const year = date.getFullYear();
    const validateStudent = await prisma.user.findUnique({
      where: { id: studentId },
    });
    if (!validateStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    const attendanceRecord = await prisma.attendance.create({
      data: {
        student_id: studentId,
        class_id: classId,
        school_id: schoolId,
        section_id: sectionId,
        subject_id: subjectId,
        teacher_id: teacherId,
        status,
        date,
        year,
      },
    });
    return NextResponse.json({
      msg: "Attendance recorded successfully",
      data: attendanceRecord,
    });
  } catch (error) {
    console.error("Error recording attendance:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        data: error,
      },
      { status: 500 },
    );
  }
}
// Fetch student based on teacher assigned class, school, section and subject than use that to add in attendence::
// // Test pensing
// export async function POST(req: Request) {
//   try {
//     const session = await auth.api.getSession({ headers: await headers() });
//     if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     if (session.user.role !== "Teacher") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

//     const teacherId = session.user.id;
//     const formData = await req.formData();

//     // attendanceList = [{ student_id: "abc", status: "Present" }, ...]
//     const attendanceListRaw = formData.get("attendanceList") as string;
//     const attendanceList: { student_id: string; status: AttendanceStatus }[] = JSON.parse(attendanceListRaw);

//     const date = new Date();
//     date.setHours(0, 0, 0, 0);
//     const year = date.getFullYear();

//     // Get teacher's current assignment
//     const teacherSubject = await prisma.classSubjectTeacher.findFirst({
//       where: { teacher_id: teacherId, year },
//     });

//     if (!teacherSubject) {
//       return NextResponse.json({ error: "No subject assigned to this teacher" }, { status: 404 });
//     }

//     const { subject_id, class_id, school_id, section_id } = teacherSubject;

//     // Verify students are enrolled
//     const enrolledStudents = await prisma.studentSubjectEnrollment.findMany({
//       where: { subject_id, class_id, section_id, school_id, year },
//       select: { student_id: true },
//     });

//     if (enrolledStudents.length === 0) {
//       return NextResponse.json({ error: "No students enrolled in this class/subject/section" }, { status: 404 });
//     }

//     // 3. Bulk insert all at once
//     await prisma.attendance.createMany({
//       data: attendanceList.map(({ student_id, status }) => ({
//         class_id,
//         student_id,
//         school_id,
//         section_id,
//         subject_id,
//         teacher_id: teacherId,
//         status,
//         date,
//         year,
//       })),
//     });

//     return NextResponse.json({ msg: "Attendance recorded", count: attendanceList.length });

//   } catch (error) {
//     console.error("Error recording attendance:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const studentId = session.user.id;



    const attendenceRecord = await prisma.attendance.findMany({
      where: {
        student_id: studentId,
      },
    });

    return NextResponse.json({
      msg: "Attendence record retrive successfully",
      data: attendenceRecord,
    });
  } catch (error) {
    console.error("Error recording attendance:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        data: error,
      },
      { status: 500 },
    );
  }
}
