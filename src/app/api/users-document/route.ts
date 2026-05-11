// A user can submit his/her documents for verification. 
// Principle can check these documents using these APIs.


import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminPrinciple } from "@/lib/requireAdminPrinciple";


export async function GET(req: Request){
    try{

        const deny = await requireAdminPrinciple();
        if(deny) return deny;
        const formData = await req.formData();
        const userId = formData.get("userId") as string;
        const user_document = await prisma.userDocument.findMany({
            where: {user_id: userId},
            include: {user: true}
        });
        return NextResponse.json({
        data: user_document
        })
    }catch(error){
        console.error("Error fetching user documents:", error);
        return NextResponse.json({error: "Failed to fetch user documents"}, {status: 500});
    }
}
