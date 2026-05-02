import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminPrinciple } from "@/lib/requireAdminPrinciple";



// Admin/Principle can add student with a school association from their own portal. 
export async function POST(
  req: Request,
) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const formData = await req.formData();
    const schoolId = formData.get("schoolId") as string;
    const studentId = formData.get("studentId") as string;
    // const role = formData.get("role") as userRole;
    const year = formData.get("year") as string;
    const is_current_raw = formData.get("is_current") as string;
    const is_current_boolean = is_current_raw === "true" ? true : false; // I wil make this true by default in thr forntend.
    if (is_current_boolean) {
      await prisma.userSchool.updateMany({
        where: {
          user_id: studentId,
          is_current: true,
        },
        data: {
          is_current: false,
        },
      });
    }

    const schoolStudent = await prisma.userSchool.create({
      data: {
        user_id: studentId,
        school_id: schoolId,
        year: year,
        is_current: is_current_boolean,
      },
    });
    return NextResponse.json({
      msg: "Student school association created successfully",
      data: schoolStudent,
    });
  } catch (error) {
    console.error("Error occurred while associating student with school:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error}` },
      { status: 500 },
    );
  }
}


export async function GET(req: Request){
    try{
        const deny = await requireAdminPrinciple();
        if(deny) return deny;

        const userSchools = await prisma.userSchool.findMany();
        return NextResponse.json({
            msg: "Data retrived successfully",
            data: userSchools
        });
    }catch(error){
        console.error("Error occured during retriving data!");
        return NextResponse.json({
            error: "Internal server error",
            msg: `An error occurred: ${error}`
        })
    }
}