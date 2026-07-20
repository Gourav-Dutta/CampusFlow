import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function GET(req: Request) {
    return NextResponse.json(
        { msg: "School student api - coming soon" }
    )
}