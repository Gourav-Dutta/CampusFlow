import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ExamComponent, ExamType } from "@/generated/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

// Only admin can add marks - modify this
// model StudentMarks {
//   id             String        @id @default(uuid())
//   student_id     String
//   subject_id     String
//   class_id       String
//   school_id      String
//   section_id     String
//   marks          Int
//   year           Int
//   grade          String
//   exam_type      ExamType
//   exam_component ExamComponent

//   student      User         @relation(fields: [student_id], references: [id])
//   subject      Subject      @relation(fields: [subject_id], references: [id])
//   classroom    ClassRoom    @relation(fields: [class_id], references: [id])
//   school       School       @relation(fields: [school_id], references: [id])
//   classSection ClassSection @relation(fields: [section_id], references: [id])
// }

// Test Pending
// export async function POST(req: Request) {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });

//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = session.user.id;
//     const formData = await req.formData();
//     const studentId = formData.get("studentId") as string;
//     const subject_id = formData.get("subjectId") as string;
//     const marks = parseInt(formData.get("marks") as string, 10);
//     const examType = formData.get("examType") as ExamType;
//     const examComponent = formData.get("examComponent") as ExamComponent;
//     const grade = formData.get("grade") as string;
//     const year = new Date().getFullYear() as number;

//     if (
//       !studentId ||
//       !subject_id ||
//       isNaN(marks) ||
//       !examType ||
//       !examComponent ||
//       !grade
//     ) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 },
//       );
//     }
//     // Fetch student details to get class_id, school_id, section_id
//     const stuDetails = await prisma.studentClass.findFirst({
//       where: { student_id: studentId, is_current: true },
//     });

//     if (!stuDetails)
//       return NextResponse.json(
//         { error: "Student details not found" },
//         { status: 404 },
//       );
//     // const class_id = stuDetails.class_id;
//     // const school_id = stuDetails.school_id;
//     // const section_id = stuDetails[0].section_id;

//     const { class_id, school_id, section_id } = stuDetails;

//     // Using the class,school, section and subject we check wither the teacher is assigned to that class/subject/school/section or not.
//     const isAuthorized = await prisma.classSubjectTeacher.findFirst({
//       where: {
//         teacher_id: userId,
//         class_id,
//         section_id,
//         subject_id,
//         school_id,
//         year,
//       },
//     });

//     if (!isAuthorized) {
//       return NextResponse.json(
//         {
//           error:
//             "Forbidden: You are not assigned to this class/subject/section",
//         },
//         { status: 403 },
//       );
//     }

//     const stuMarks = await prisma.studentMarks.create({
//       data: {
//         student_id: studentId,
//         subject_id,
//         marks,
//         year,
//         grade: grade,
//         exam_type: examType,
//         exam_component: examComponent,
//         class_id,
//         school_id,
//         section_id,
//       },
//     });
//     return NextResponse.json(stuMarks, { status: 201 });
//   } catch (error: any) {
//     console.error("Error creating student marks:", error);
//     return NextResponse.json(
//       { error: "Failed to create student marks" },
//       { status: 500 },
//     );
//   }
// }

// POST /api/marks/principal
// Principal can enter marks for any student in their school

export async function POST(req: Request) {
  try {
    const deny = await requireAdmin();
    if (deny) return deny;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Only admin can use this route
    if (session.user.role !== "Admin") {
      return NextResponse.json(
        { error: "Forbidden: Only principals can use this route" },
        { status: 403 },
      );
    }

    const formData = await req.formData();
    const studentId = formData.get("studentId") as string;
    const subject_id = formData.get("subjectId") as string;
    const marksRaw = formData.get("marks") as string;
    const examType = formData.get("examType") as ExamType;
    const examComponent = formData.get("examComponent") as ExamComponent;
    const grade = formData.get("grade") as string;
    const school_id = formData.get("school") as string;
    const class_id = formData.get("class") as string;
    const section_id = formData.get("section") as string;
    const marks = parseInt(marksRaw, 10);
    const year = formData.get("year")
      ? parseInt(formData.get("year") as string, 10)
      : new Date().getFullYear();

    if (
      !studentId ||
      !subject_id ||
      isNaN(marks) ||
      !examType ||
      !examComponent ||
      !grade ||
      !school_id ||
      !class_id ||
      !section_id
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check for duplicate marks entry (same student, subject, year, exam_type, exam_component)
    const duplicate = await prisma.studentMarks.findFirst({
      where: {
        student_id: studentId,
        subject_id,
        school_id,
        class_id,
        section_id,
        year,
        exam_type: examType,
        exam_component: examComponent,
      },
    });

    if (duplicate) {
      return NextResponse.json(
        {
          error:
            "Marks already entered for this student/subject/exam combination",
        },
        { status: 409 },
      );
    }

    const stuMarks = await prisma.studentMarks.create({
      data: {
        student_id: studentId,
        subject_id,
        marks,
        year,
        grade,
        exam_type: examType,
        exam_component: examComponent,
        class_id,
        school_id,
        section_id,
      },
    });

    return NextResponse.json(stuMarks, { status: 201 });
  } catch (error: any) {
    console.error("Error creating student marks (principal):", error);
    return NextResponse.json(
      { error: "Failed to create student marks" },
      { status: 500 },
    );
  }
}

// export async function GET(req: Request){
//   try{
//       const session  = await auth.api.getSession({
//         headers: await headers(),
//       });

//       if(!session?.user) return NextResponse.json({error: "Unauthorized"}, {status: 401});

//       // const teacherId = session.user.id;
//       const formData = await req.formData();
//       const studentId = await formData.get("studentId") as string;
//       const year = await formData.get("year") as string || new Date().getFullYear().toString();

//       const marksRecord = await prisma.studentMarks.findMany({
//         where: {
//           student_id: studentId,
//           year: parseInt(year, 10)
//         }
//       })
//       return NextResponse.json({
//         msg: "Marks fetched successfully",
//         data: marksRecord
//       });
//   } catch (error) {
//     console.error("Database Error:", error);
//     return NextResponse.json({ error: "Internal Server Error",
//       data: error instanceof Error ? error.message : "Unknown error"
//      }, { status: 500 });
//   }
// }

// export async function GET(req: Request) {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });

//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = session.user.id;

//     if (session.user.role !== "Student") {
//       return NextResponse.json(
//         { error: "Forbidden: Only students can access this route" },
//         { status: 403 },
//       );
//     }
//     // const formData = await req.formData();
//     // const class_id = formData.get("classId") as string;

//     // 1. Find the student's current active class — this anchors school + year + class + section
//     const currentClass = await prisma.studentClass.findFirst({
//       where: {
//         student_id: userId,
//         is_current: true,
//       },
//       include: {
//         classroom: { select: { name: true } },
//         classSection: { select: { name: true } },
//         school: { select: { name: true, type: true } },
//       },
//     });

//     if (!currentClass) {
//       return NextResponse.json(
//         { error: "No active class enrollment found" },
//         { status: 404 },
//       );
//     }

//     const { class_id, school_id, section_id, year } = currentClass;

//     // 2. Fetch marks locked to current school + class + section + year
//     //    This naturally excludes all previous schools and previous years
//     const marks = await prisma.studentMarks.findMany({
//       where: {
//         student_id: userId,
//         school_id, // current school only
//         class_id, // current class only
//         section_id, // current section only
//         year, // current year only
//       },
//       include: {
//         subject: { select: { id: true, name: true } },
//       },
//       //   orderBy: [
//       //     { exam_type: "asc" },
//       //     { subject: { name: "asc" } },
//       //   ],
//     });

//     //     // 3. Group by subject for a clean markcard structure
//     //     const groupedBySubject = marks.reduce
//     //   Record
//     //     string,
//     //     {
//     //       subject_id: string,
//     //       subject_name: string;
//     //       entries: {
//     //         exam_type: ExamType;
//     //         exam_component: ExamComponent;
//     //         marks: number;
//     //         grade: string;
//     //       }[];
//     //     }
//     //   >
//     // >((acc, mark) => {
//     //   const subjectName = mark.subject.name;
//     //   if (!acc[subjectName]) {
//     //     acc[subjectName] = {
//     //       subject_id: mark.subject_id,
//     //       subject_name: subjectName,
//     //       entries: [],
//     //     };
//     //   }
//     //   acc[subjectName].entries.push({
//     //     exam_type: mark.exam_type,
//     //     exam_component: mark.exam_component,
//     //     marks: mark.marks,
//     //     grade: mark.grade,
//     //   });
//     //   return acc;
//     // }, {});

//     return NextResponse.json(
//       {
//         student_id: userId,
//         year,
//         school: {
//           id: school_id,
//           name: currentClass.school.name,
//           type: currentClass.school.type,
//         },
//         class: {
//           id: class_id,
//           name: currentClass.classroom.name,
//           section: currentClass.classSection.name,
//         },
//         markcard: marks,
//       },
//       { status: 200 },
//     );
//   } catch (error: any) {
//     console.error("Error fetching student marks:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch student marks" },
//       { status: 500 },
//     );
//   }
// }


export async function GET(req: Request){
  try{
      const session  = await auth.api.getSession({
        headers: await headers(),
      });
      
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;


    const stuMarks = await prisma.studentMarks.findMany({
      where: {student_id: userId}
    });
    return NextResponse.json({
      msg: "Marks fetched successfully",
      data: stuMarks
    });
  }catch(error){
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Internal Server Error"}, { status: 500 })
  }
}