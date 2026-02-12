import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { userRole } from "@/generated/prisma/enums";
// import {prisma} from @/lib/prisma.ts 

// export async function POST(req: Request){
//     return NextResponse.json({
//         msg: "Requested Received"
//     })
// }


export async function POST(req: Request){
try{
const form = await req.formData();
console.log(form);
const rawYear = form.get("year");
console.log(rawYear);
if(!rawYear) return NextResponse.json({msg: "Year is missing"}, {status:500});
const newUser = await prisma.user.create({
    data: {
      name: form.get("name") as string,
      email: form.get("email") as string,
      phone_no: form.get("phone_no") as string,
      password: form.get("password") as string,
      year: form.get("year") as string,
      role: form.get("role") as userRole
    }
}) 
return NextResponse.json({
    msg: "User created",
    user: newUser
}, {status: 202})
}catch(err: any){
return NextResponse.json({
    msg: `An error occured: ${err.message}`
}, {status:500})
}
}


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