import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';



//When principle have to do some work he can fetch all techer of a particular school.
export async function GET(req: Request){
    try{
        // const formData = await req.formData();
        // const schoolId = req.nextUrl.searchParams.get("schoolId") as string;
        // const schoolId = formData.get("schoolId") as string;

        const {searchParams} = new URL(req.url);
        const schoolId = searchParams.get("schoolId") as string;
        

        const allTeachers = await prisma.user.findMany({
            where: {role: "Teacher",
                schools: {
                    some: {school_id: schoolId}
                },
            },
            include: {
                schools: {
                    where: {school_id: schoolId}
                }
            }
    })
    return NextResponse.json({ data: allTeachers });
    }catch(error){
        console.error("Error occurred while fetching teachers:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}