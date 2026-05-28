import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export async function GET(req: Request){
    try{
         const session = await auth.api.getSession({
              headers: await headers(),
            });

            if(!session?.user){
                return NextResponse.json({error: "Unauthorized"}, {status: 401});
            }
        
            const studentId = session.user.id;
            const formData = await req.formData();
            const subject_id = formData.get("subjectId") as string;
            const year = new Date().getFullYear() as number;

            const marksRecord = await prisma.studentMarks.findMany({
                where: {
                    student_id: studentId,
                    year
                }
            });

            return NextResponse.json({
                msg: "Marks fetched successfully",
                data: marksRecord
            })

    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Internal Server Error", 
            data: error instanceof Error ? error.message : "Unknown error"
         }, { status: 500 });
    }
}