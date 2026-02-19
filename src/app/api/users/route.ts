import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";


export async function GET(req: Request){
    try{
        const allUser= await prisma.user.findMany();
        return NextResponse.json({
            msg: "All user found",
            data: allUser
        }, {status:200})
    }catch(err: any){
        return NextResponse.json({
            msg: `An error occured: ${err.message}`
        }, {status: 500})
    }
}


