// model ClassSubjectTeacher {
//   id            String @id @default(uuid())
//   subject_id    String
//   class_id      String
//   teacher_id    String
//   school_id     String
//   section_id    String
//   period_slot   String
//   schoolRoom_id String // This is linked to SchoolRoom table, that define in which room the class will be held.
//   year          Int

//   subject      Subject      @relation(fields: [subject_id], references: [id], onDelete: Cascade)
//   classroom    ClassRoom    @relation(fields: [class_id], references: [id], onDelete: Cascade)
//   teacher      User         @relation(fields: [teacher_id], references: [id], onDelete: Cascade)
//   school       School       @relation(fields: [school_id], references: [id], onDelete: Cascade)
//   schoolRoom   SchoolRoom   @relation(fields: [schoolRoom_id], references: [id], onDelete: Cascade)
//   classSection ClassSection @relation(fields: [section_id], references: [id], onDelete: Cascade)
// }


import prisma from "@/lib/prisma";
import { requireAdminPrinciple } from "@/lib/requireAdminPrinciple";
import { NextResponse } from "next/server";


async function POST(req: Request){
    try{
        const deny = await requireAdminPrinciple();
        if(deny) return deny;
        const formData = await req.formData();
        const subjectId = formData.get("subject") as string;
        const classId = formData.get("class") as string;
        const teacherId = formData.get("teacher") as string;
        const schoolId = formData.get("school") as string;
        const sectionId = formData.get("section") as string;
        const periodSlot = formData.get("periodSlot") as string;
        const year = formData.get("year") as string;
        const schoolRoomId = formData.get("schoolRoom") as string;
        const validateSubject = await prisma.subject.findUnique({
            where: {id: subjectId}
        });
        if(!validateSubject) return NextResponse.json({error: "Subject not found"}, {status: 404});


        const validateClass = await prisma.classRoom.findUnique({
            where: {id: classId}
        });
        if(!validateClass) return NextResponse.json({error: "Class not found"}, {status: 404});


        const validateTeacher = await prisma.user.findUnique({
            where: {id: teacherId}
        });
        if(!validateTeacher) return NextResponse.json({error: "Teacher not found"}, {status: 404});


        const validateSchool = await prisma.school.findUnique({
            where: {id: schoolId}
        });
        if(!validateSchool) return NextResponse.json({error: "School not found"}, {status: 404});


        const validateSection = await prisma.classSection.findUnique({
            where: {id: sectionId}
        });
        if(!validateSection) return NextResponse.json({error: "Class section not found"}, {status: 404});

        const newTeacherSubjectSelection = await prisma.classSubjectTeacher.create({
            data: {
                subject_id: subjectId,
                class_id: classId,
                teacher_id: teacherId,
                school_id: schoolId,
                section_id: sectionId,
                period_slot: periodSlot,
                year: parseInt(year),
                schoolRoom_id: schoolRoomId
            }
        });

        return NextResponse.json({
            msg:" Class subject teacher association created successfully",
            data: newTeacherSubjectSelection
        }, {status:201});
    }catch(error){
        return NextResponse.json({error: "An error occurred while creating the association"}, {status: 500});
    }
}


async function GET(req: Request){
    try{
        const deny = await requireAdminPrinciple();
        if(deny) return deny;
        const associations = await prisma.classSubjectTeacher.findMany();
        return NextResponse.json({data: associations}, {status: 200});
    }catch(error){
        return NextResponse.json({error: "An error occurred while fetching the association"}, {status: 500});
    }
}