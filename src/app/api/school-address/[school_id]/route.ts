// // This routes is only for ADMIN::

// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function POST(req: Request, {params} : {params: {school_id : string}}){
//   try{
//      const formData = await req.formData();
//      const validateSchool = await prisma.school.findUnique({
//         where: { id: params.school_id}
//      });

//      if(!validateSchool) return NextResponse.json({
//         msg : "No school "
//      })
//   }
// }
