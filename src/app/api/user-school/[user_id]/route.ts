import { userRole } from '@/generated/prisma/enums';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAdminPrinciple } from '@/lib/requireAdminPrinciple';


// Once we enter a user record in the user_school table, we can't delete or update it usless thge user deleted from our portal. 
// This is for maintain a record of the user's association with the school.
// We can add a new record if the user changes school.
// Only admin and principle can add or view the user-school association.

export async function POST(req: Request, {params}: {params: {user_id: string}}){
   
    try{
        const deny = await requireAdminPrinciple();
        if (deny) return deny;
         const {user_id} = params;
        const validateStudent = await prisma.user.findUnique({
            where: { id: user_id}
        });
        if(!validateStudent){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const formData = await req.formData();
        const schoolId = formData.get("schoolId") as string;
        // const role = formData.get("role") as userRole;
        const year = formData.get("year") as string;
        const is_current_raw = formData.get("is_current") as string;
        const is_current_boolean = is_current_raw === "true" ? true: false; // I wil make this true by default in thr forntend.
        if(is_current_boolean){
            await prisma.userSchool.updateMany({
                where: {
                    user_id: user_id,
                    is_current: true
                },
                data: {
                    is_current: false
                }
            })
        }

        const schoolStudent = await prisma.userSchool.create({
            data: {
                user_id: user_id,
                school_id: schoolId,
                year: year,
                is_current: is_current_boolean
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


export async function GET(req: Request, {params}: {params: {user_id: string}}){
    try{
        const deny = await requireAdminPrinciple();
        if (deny) return deny;
        const {user_id} = params;
        const userSchools = await prisma.userSchool.findMany({
            where: {user_id: user_id}
        });
        return NextResponse.json({
            msg: "User schools retrieved successfully",
            data: userSchools
        })
    }catch(error){
        console.error("Error occurred while retrieving user schools:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
}
