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




// Test pending




// Only one entry then update this. 
// Like if the principle assign a teacher for a subject and class, 
// then he can't assign another teacher for the same subject and class unless he update the existing one. 
// This is to maintain a record of which teacher is teaching which subject in which class. 
// This will help us to track the teacher's performance and also to track the student's performance in that subject.

// If math is assign to Teacher A for class 5, and if the year end then he can assign to different subject diff class.

// One teacher can teach one subject in one class, but same subject in diff class.
// Teacher will recognize there current class and subject based on year.
// if by any chance we have to change the teacher for a subject and class, then we can update the existing record instead of creating a new one.
// New one created only for new entry, like new subject-same year or same subject-diff year
import prisma from "@/lib/prisma";
import { requireAdminPrinciple } from "@/lib/requireAdminPrinciple";
import { NextResponse } from "next/server";


export async function POST(req: Request){
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


export async function GET(req: Request){
    try{
        const deny = await requireAdminPrinciple();
        if(deny) return deny;
        const associations = await prisma.classSubjectTeacher.findMany();
        return NextResponse.json({data: associations}, {status: 200});
    }catch(error){
        return NextResponse.json({error: "An error occurred while fetching the association"}, {status: 500});
    }
}

export async function PUT(req: Request){
    try{
        
        const deny = await requireAdminPrinciple();
        if(deny) return deny;
        const formData = await req.formData();
        const associationId = formData.get("associationId") as string;
        const subjectId = formData.get("subject") as string;
        const classId = formData.get("class") as string;
        const teacherId = formData.get("teacher") as string;
        const schoolId = formData.get("school") as string;
        const sectionId = formData.get("section") as string;
        const periodSlot = formData.get("periodSlot") as string;
        const year = formData.get("year") as string;
        const schoolRoomId = formData.get("schoolRoom") as string;

        const existingAssociation = await prisma.classSubjectTeacher.findUnique({
            where: {id: associationId}
        });
        if(!existingAssociation) return NextResponse.json({error: "Association not found"}, {status: 404});
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


        type updatedValue = {
                subject_id?: string,
                class_id?: string,
                teacher_id?: string,
                school_id?: string,
                section_id?: string,
                period_slot?: string,
                year?: number,
                schoolRoom_id?: string
        }

        const updateData: updatedValue = {};
        if(subjectId) updateData.subject_id = subjectId;
        if(classId) updateData.class_id = classId;
        if(teacherId) updateData.teacher_id = teacherId;
        if(schoolId) updateData.school_id = schoolId;
        if(sectionId) updateData.section_id = sectionId;
        if(periodSlot) updateData.period_slot = periodSlot;
        if(year) updateData.year = parseInt(year);
        if(schoolRoomId) updateData.schoolRoom_id = schoolRoomId;


        const updatedAssociation = await prisma.classSubjectTeacher.update({
            where: {id: associationId},
            data: updateData
        });

        return NextResponse.json({
            msg: "Association updated successfully",
            data: updatedAssociation
        });



    }catch(error){
        console.error("Error occurred while updating the association:", error);
        return NextResponse.json({error: "An error occurred while updating the association"}, {status: 500});
    }
}