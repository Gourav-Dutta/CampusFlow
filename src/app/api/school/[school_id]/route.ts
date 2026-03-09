import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { NextResponse } from "next/server";
import { SchoolType } from "@/generated/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { school_id: string } },
) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    const formData = await req.formData();
    const school_id = params.school_id;
    const name = formData.get("schoolName") as string;
    const type = formData.get("type") as SchoolType;
    const principleId = formData.get("principleId") as string | null;
    const updateData: any = {};
    if (name) updateData.name = name;
    if (type) updateData.type = type;
    if (principleId) updateData.principal_id = principleId;

    const validateSchool = await prisma.school.findUnique({
      where: {
        id: school_id,
      },
    });
    if (!validateSchool)
      return NextResponse.json(
        {
          msg: "School not found",
        },
        { status: 404 },
      );

    if (updateData.principal_id) {
      const user = await prisma.user.findUnique({
        where: {
          id: updateData.principal_id,
        },
      });
      if (user?.role !== "Admin") {
        return NextResponse.json(
          {
            msg: "The principleId is not a principle",
          },
          { status: 404 },
        );
      }
    }
    const school = await prisma.school.update({
      where: {
        id: school_id,
      },
      data: {
        ...updateData,
      },
    });
    return NextResponse.json(
      {
        msg: "School updated successfully",
        data: school,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        msg: err.message,
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { school_id: string } },
) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    const validateSchool = await prisma.school.findUnique({
      where: {
        id: params.school_id,
      },
    });

    if (!validateSchool)
      return NextResponse.json(
        {
          msg: "School not found",
        },
        { status: 404 },
      );

    await prisma.school.delete({
      where: { id: params.school_id },
    });

    return NextResponse.json(
      {
        msg: "School deleted successfully",
        data: validateSchool,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        msg: err.message,
      },
      { status: 400 },
    );
  }
}
