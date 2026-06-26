import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";


export async function GET(req: Request){
    try{
        const session = await auth.api.getSession({
            headers: await headers()
        });
        if(!session?.user) return NextResponse.json({error: "Unauthorized"}, {status: 401});

        const userId = session.user.id;
        const formData = await req.formData();
        const year = formData.get("year") as string || new Date().getFullYear().toString();

        const attendenceRecord = await prisma.attendance.findMany({
            where: {
                student_id: userId,
                year: parseInt(year)
            }
        });
        return NextResponse.json({
            msg: "Attendance record retrieved successfully",
            data: attendenceRecord
        });
    }catch(error){
        console.error("Error fetching student attendance:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            data: error
        }, {status: 500});
    }
}