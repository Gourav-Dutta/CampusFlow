import { userRole } from '@/generated/prisma/enums';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';



export default async function POST(req: Request, {params}: {params: {student_id: string}}){
    const {student_id} = params;
    try{
        const validateStudent = await prisma.user.findUnique({
            where: { id: student_id}
        });
        if(!validateStudent){
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }
        const formData = await req.formData();
        const schoolId = formData.get("schoolId") as string;
        // const role = formData.get("role") as userRole;
        const year = formData.get("year") as string;

        const schoolStudent = await prisma.userSchool.create({
            data: {
                user_id: student_id,
                school_id: schoolId,
                year: year
            },
        });
        return NextResponse.json({
            msg: "Student school association created successfully",
            data: schoolStudent
        })
    } catch (error) {
        console.error("Error occurred while validating student:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}