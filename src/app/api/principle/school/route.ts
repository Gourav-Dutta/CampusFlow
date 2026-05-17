import prisma from "@/lib/prisma";
import { requireAdminPrinciple } from "@/lib/requireAdminPrinciple";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";



export async function GET(req: Request){
    try{
        const deny = await requireAdminPrinciple();
        if(deny) return deny;

        const session = await auth.api.getSession({
              headers: await headers(),
            });
        
            if (!session?.user) {
              return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        
        const userId = session.user.id;
        console.log("principle/school: userId:: ", userId);

        const school = await prisma.userSchool.findFirst({
            where: { user_id: userId, is_current: true },
            // include: { school: true },
        });

        if (!school) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(school);
    }
    catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}