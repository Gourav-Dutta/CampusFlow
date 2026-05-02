import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";



// Testing purpose only, this API is not in use, we can remove it later
export async function PUT(req: Request, {params}: {params: {studentClass_Id: string}},){
    try{
        const formData = await req.formData();
        // const studentClassId = formData.get("studentClassId") as string;
        // const studentId = formData.get("studentId") as string;


       const session = await auth.api.getSession({
            headers: await headers(),
       });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id; 
        console.log("User-Id: ",  userId);
  
        const classId = formData.get("classId") as string;
        const schoolId = formData.get("schoolId") as string;
        const sectionId = formData.get("sectionId") as string;
        // const year = formData.get("year") as string;
        const validateStudentClass = await prisma.studentClass.findUnique({
            where: { id: params.studentClass_Id }
        });
        if(!validateStudentClass){
            return NextResponse.json({ error: "Student class association not found" }, { status: 404 });
        }
        type updateValue = {
            // studentId?: string,
            class_id?: string;
            school_id?: string;
            section_id?: string;

        };
        const updateData: updateValue ={};
        // if(studentId) updateData.studentId = studentId;
        if(classId) updateData.class_id = classId;
        if(schoolId) updateData.school_id = schoolId;
        if(sectionId) updateData.section_id = sectionId;
        // if(year) updateData.year = parseInt(year);

        const updateStudentClass = await prisma.studentClass.update({
            where:{ id: params.studentClass_Id},
            data: updateData
        });

        return NextResponse.json({
            msg: "Student details updated successfully",
            data: updateStudentClass
        })

}catch(error){
    console.error(`An error occured: ${error}`);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
}
}