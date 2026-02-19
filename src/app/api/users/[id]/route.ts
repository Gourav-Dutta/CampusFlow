import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET( // Get user based on userID
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { msg: "User found", data: user },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { msg: `An error occurred: ${err.message}` },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    const formData = await req.formData();

    type UpdateUser = {
      name?: string;
      password?: string;
      email?: string;
      phone_no?: string;
      year?: string;
    };

    const updateData: UpdateUser = {};

    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;
    const phone_no = formData.get("phone_no") as string;
    const year = formData.get("year") as string;

    if (typeof name === "string") updateData.name = name;
    if (typeof password === "string") updateData.password = password;
    if (typeof email === "string") updateData.email = email;
    if (typeof phone_no === "string") updateData.phone_no = phone_no;
    if (typeof year === "string") updateData.year = year;

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(
      { msg: "User updated successfully", data: updatedUser },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { msg: `An error occurred: ${err.message}` },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const userId = await params.id;
    console.log(userId);
    const validateUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!validateUser)
      return NextResponse.json(
        {
          msg: "No user found",
        },
        { status: 404 },
      );
    const user = await prisma.user.delete({
      where: { id: userId },
    });
    return NextResponse.json(
      {
        msg: "User Found",
        data: user,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        msg: `An error occured: ${err.message}`,
      },
      { status: 500 },
    );
  }
}
