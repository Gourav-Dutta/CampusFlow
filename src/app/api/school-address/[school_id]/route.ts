// This routes is only for ADMIN::

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST(
  req: Request,
  { params }: { params: { school_id: string } },
) {
  try {
    const deny = await requireAdmin();
    if (deny) return deny;
    const formData = await req.formData();
    const validateSchool = await prisma.school.findUnique({
      where: { id: params.school_id },
    });

    if (!validateSchool)
      return NextResponse.json({
        msg: "No school ",
      });
    console.log(formData);
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const address_line_1 = formData.get("address_line_1") as string;
    const address_line_2 = formData.get("address_line_2") as string | null;

    const newAddress = await prisma.schoolAddress.create({
      data: {
        city,
        state,
        address_line_1,
        address_line_2,
        school: {
          connect: { id: params.school_id },
        },
      },
    });

    return NextResponse.json({
      msg: "Address created successfully",
      data: newAddress,
    });
  } catch (err: any) {
    console.error("Database Error:", err);
    return NextResponse.json(
      { msg: `An error occurred: ${err.message}` },
      { status: 500 },
    );
  }
}

export async function PUT( // Convert it to school_id
  req: Request,
  { params }: { params: { school_id: string } },
) {
  try {
    const deny = await requireAdmin();
    if (deny) return deny;
    const formData = await req.formData();
    const validateSchoolAddress = await prisma.schoolAddress.findMany({
      where: { school_id: params.school_id },
    });

    if (!validateSchoolAddress)
      return NextResponse.json({
        msg: "No school address",
      });
    const updateData: any = {};
    if (formData.get("city")) updateData.city = formData.get("city") as string;
    if (formData.get("state"))
      updateData.state = formData.get("state") as string;
    if (formData.get("address_line_1"))
      updateData.address_line_1 = formData.get("address_line_1") as string;
    if (formData.get("address_line_2"))
      updateData.address_line_2 = formData.get("address_line_2") as
        | string
        | null;

    const updatedAddress = await prisma.schoolAddress.updateMany({
      where: { school_id: params.school_id },
      data: updateData,
    });

    return NextResponse.json({
      msg: "Scholl address update successfully",
      data: updatedAddress,
    });
  } catch (err: any) {
    console.error("Database Error:", err);
    return NextResponse.json(
      { msg: `An error occurred: ${err.message}` },
      { status: 500 },
    );
  }
}

export async function GET( // Based on specific school_id
  req: Request,
  { params }: { params: { school_id: string } },
) {
  try {
    const deny = await requireAdmin();
    if (deny) return deny;
    const findSchollAddress = await prisma.schoolAddress.findMany({
      where: { school_id: params.school_id },
      include: {
        school: true,
      },
    });

    return NextResponse.json({
      msg: "Address fetched successfully",
      data: findSchollAddress,
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
  { params }: { params: { school_id: string } },
) {
  try {
    const validateSchool = await prisma.schoolAddress.findMany({
      where: { school_id: params.school_id },
    });
    if (!validateSchool)
      return NextResponse.json({
        msg: "No school ",
      });
    const deny = await requireAdmin();
    if (deny) return deny;
    const deleteAddress = await prisma.schoolAddress.deleteMany({
      where: { school_id: params.school_id },
    });
    return NextResponse.json({
      msg: "Address deleted successfully",
      data: deleteAddress,
    });
  } catch (err: any) {
    console.error("Database Error:", err);
    return NextResponse.json(
      { msg: `An error occurred: ${err.message}` },
      { status: 500 },
    );
  }
}
