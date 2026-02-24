import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST( // Only a user can add their parents
  req: Request,
  { params }: { params: { user_id: string } },
) {
  try {
    const validateUser = await prisma.user.findUnique({
      where: { id: params.user_id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!validateUser)
      return NextResponse.json(
        {
          msg: "User not found",
        },
        { status: 404 },
      );

    const formData = await req.formData();
    const email = formData.get("email") as string;
    const phone_number = formData.get("phone_number") as string;
    const RawPassword = formData.get("password") as string;
    const address_line_1 = formData.get("address_line_1") as string;
    const address_line_2 = formData.get("address_line_2") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const password = await bcrypt.hash(RawPassword, 10);

    const newParent = await prisma.parent.create({
      data: {
        name,
        email,
        phone_number,
        password,
        address_line_1,
        address_line_2,
        students: {
          create: {
            role: role,
            student: {
              connect: { id: params.user_id },
            },
          },
        },
      },
    });
    console.log(name);
    return NextResponse.json({
      msg: "Data Get",
      data: newParent,
    });
  } catch (err: any) {
    console.error("Database Error:", err);
    return NextResponse.json(
      { msg: `An error occurred: ${err.message}` },
      { status: 500 },
    );
  }
}
