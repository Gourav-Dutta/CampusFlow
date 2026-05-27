import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import { AttendanceStatus } from "@/generated/prisma";




// model Attendance {
//   id         String           @id @default(uuid())
//   class_id   String
//   student_id String
//   school_id  String
//   section_id String
//   subject_id String
//   teacher_id String
//   status     AttendanceStatus
//   date       DateTime
//   year       Int

//   classroom ClassRoom @relation(fields: [class_id], references: [id])
//   school    School    @relation(fields: [school_id], references: [id])
//   subject   Subject   @relation(fields: [subject_id], references: [id])

//   student      User         @relation("StudentAttendance", fields: [student_id], references: [id])
//   teacher      User         @relation("TeacherAttendance", fields: [teacher_id], references: [id])
//   classSection ClassSection @relation(fields: [section_id], references: [id])
// }

// Test pensing
export async function POST(req: Request){
    try{
         const session = await auth.api.getSession({
              headers: await headers(),
            });
        
            if (!session?.user) {
              return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            const teacherId = session.user.id;
            if(session.user.role !== "Teacher") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            const formData = await req.formData();
            const class_id = formData.get("class") as string;
            const student_id = formData.get("student") as string;
            const school_id = formData.get("school") as string;
            const section_id = formData.get("section") as string;
            const status = formData.get("status") as AttendanceStatus;
            const subject_id = formData.get("subject") as string;
            const date = new Date();
            const year = new Date().getFullYear() as number;


             const isAuthorized = await prisma.classSubjectTeacher.findFirst({
                where: {
                teacher_id: teacherId,
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

            const attendanceRecord = await prisma.attendance.create({
                data:{
                    class_id,
                    student_id,
                    school_id,
                    section_id,
                    subject_id,
                    teacher_id: teacherId,
                    status,
                    date,
                    year
                }
            });

            return NextResponse.json({
                msg: "Attendance recorded",
                data: attendanceRecord
            })

     }catch(error){
        console.error("Error recording attendance:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            data: error
        }, {status: 500
        })
    }
}