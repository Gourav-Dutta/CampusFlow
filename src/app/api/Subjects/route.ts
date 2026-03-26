import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminPrinciple } from "@/lib/requireAdminPrinciple";

export async function POST(req: Request) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const createSubject = await prisma.subject.create({
      data: {
        name,
      },
    });
    return NextResponse.json({
      msg: "Subject created successfully",
      data: createSubject,
    });
  } catch (err: any) {
    console.error("Database Error:", err);
    return NextResponse.json(
      { msg: `An error occurred: ${err.message}` },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const findSubject = await prisma.subject.findMany();
    if (!findSubject) {
      return NextResponse.json({
        msg: "Subject not found",
      });
    }
    return NextResponse.json({
      msg: "Subject fetched successfully",
      data: findSubject,
    });
  } catch (err: any) {
    console.error("Database Error:", err);
    return NextResponse.json(
      { msg: `An error occurred: ${err.message}` },
      { status: 500 },
    );
  }
}
