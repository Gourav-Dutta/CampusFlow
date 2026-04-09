import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminPrinciple } from "@/lib/requireAdminPrinciple";

export async function POST(
  req: Request,
  { params }: { params: { school_id: string; class_id: string } },
) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const { school_id, class_id } = params;
    const formData = await req.formData();
    const subject = formData.get("subject_id") as string;
    const subjectDetails = await prisma.classSubject.create({
      data: {
        subject_id: subject,
        class_id: class_id,
        school_id: school_id,
      },
    });
    console.log(school_id);
    console.log(class_id);
    return NextResponse.json(
      { msg: "success", data: subjectDetails },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { msg: `Error adding subject to class: ${error}` },
      { status: 500 },
    );
  }
}


export async function GET(req: Request, {params}: {params: {school_id: string; class_id: string}}){
    try{
        const {school_id, class_id} = params;
        const subjects = await prisma.classSubject.findMany({
            where: {
                school_id: school_id,
                class_id: class_id
            }
        });
        return NextResponse.json({msg: "success", data: subjects}, {status: 200});
    }catch(error){
        console.error(error);
        return NextResponse.json({msg: `Error fetching subjects for class: ${error}`}, {status: 500});
    }
}
