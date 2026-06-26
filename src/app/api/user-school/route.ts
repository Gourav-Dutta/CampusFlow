import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminPrinciple } from "@/lib/requireAdminPrinciple";



// Admin/Principle can add student with a school association from their own portal.
// For already existing student, they will provide their user-id to school and school will add them with their school in user school table. 
export async function POST(
  req: Request,
) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const formData = await req.formData();
    const schoolId = formData.get("schoolId") as string;
    const userId = formData.get("userId") as string;
    // const role = formData.get("role") as userRole;
    const year = formData.get("year") as string;
    const is_current_raw = formData.get("is_current") as string;
    const is_current_boolean = is_current_raw === "true" ? true : false; // I wil make this true by default in thr forntend.

    const userDetails  = await prisma.user.findUnique({
      where: { id: userId}
    });
    if(!userDetails) return NextResponse.json({
      error: "User not found",
      msg: "The provided userId does not exist in our records"
    });
    if(userDetails.role !== "Student" && userDetails.role !== "Parent"){
      return NextResponse.json({
        error: "Invalid user role",
        msg: "Only students and parents can be associated with a school"
      }, { status: 400 });
    }
    if (is_current_boolean) {
      await prisma.userSchool.updateMany({
        where: {
          user_id: userId,
          is_current: true,
        },
        data: {
          is_current: false,
        },
      });
    }

    const schoolStudent = await prisma.userSchool.create({
      data: {
        user_id: userId,
        school_id: schoolId,
        year: year,
        is_current: is_current_boolean,
      },
    });
    return NextResponse.json({
      msg: "User school association created successfully",
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