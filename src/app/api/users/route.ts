import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminPrinciple } from "@/lib/requireAdminPrinciple";


export async function GET(req: Request){
    try{
        const deny = await requireAdminPrinciple();
        if(deny) return deny;

        const users = await prisma.user.findMany();
        return NextResponse.json({
            msg: "users retrived successfully",
            data: users
        })
    }catch(error){
        console.log(error);
        return NextResponse.json({
            msg: "Error in users fetching",
            error: `Error occured in users fetching ${error}`
        });
    }
}