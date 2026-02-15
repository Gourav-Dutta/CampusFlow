import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
     
        
        const user = await auth.api.signUpEmail({
            body: {
                email: `teacher_${Date.now()}@school.com`, // Unique email for every test
                password: "password123",
                name: "Test Teacher",
                role: "Teacher", 
                year: 2026,
                phone_no: "123456789"
            }
        });

        
        const session = await auth.api.getSession({
            headers: await headers() 
        });

        return NextResponse.json({
            message: "Backend Auth Test Successful",
            createdUser: user,
            activeSession: session
        });

    } catch (error: any) {
        console.error("Auth Test Failed:", error);
        return NextResponse.json({ 
            error: "Auth Test Failed", 
            details: error.message 
        }, { status: 500 });
    }
}