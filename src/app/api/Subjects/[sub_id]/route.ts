// Test require

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminPrinciple } from "@/lib/requireAdminPrinciple";

export async function GET(
  req: Request,
  { params }: { params: { sub_id: string } },
) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const findSubject = await prisma.subject.findUnique({
      where: { id: params.sub_id },
    });
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

export async function DELETE(
  req: Request,
  { params }: { params: { sub_id: string } },
) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const findSubject = await prisma.subject.findUnique({
      where: { id: params.sub_id },
    });
    if (!findSubject) {
      return NextResponse.json({
        msg: "Subject not found",
      });
    }
    const deleteSubject = await prisma.subject.delete({
      where: { id: params.sub_id },
    });
    return NextResponse.json({
      msg: "Subject deleted successfully",
      data: deleteSubject,
    });
  } catch (err: any) {
    console.error("Database Error:", err);
    return NextResponse.json(
      { msg: `An error occurred: ${err.message}` },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { sub_id: string } },
) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const findSubject = await prisma.subject.findUnique({
      where: { id: params.sub_id },
    });
    if (!findSubject) {
      return NextResponse.json({
        msg: "Subject not found",
      });
    }
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const updateSubject = await prisma.subject.update({
      where: { id: params.sub_id },
      data: {
        name,
      },
    });
    return NextResponse.json({
      msg: "Subject updated successfully",
      data: updateSubject,
    });
  } catch (err: any) {
    console.error("Database Error:", err);
    return NextResponse.json(
      { msg: `An error occurred: ${err.message}` },
      { status: 500 },
    );
  }
}
