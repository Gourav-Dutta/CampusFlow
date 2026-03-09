// This APIs are only for the admin.

import { SchoolType, UserRole } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    const formData = await req.formData();
    const name = formData.get("schoolName") as string;
    const type = formData.get("type") as SchoolType;
    const principleId = formData.get("principleId") as string | null;
    console.log(name);
    console.log(type);
    console.log(principleId);
    if (principleId) {
      const user = await prisma.user.findUnique({
        where: {
          id: principleId,
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

    const school = await prisma.school.create({
      data: {
        name: name,
        type: type,
        principal_id: principleId,
      },
    });

    if (!school)
      return NextResponse.json(
        {
          msg: "Failed to add new school",
        },
        { status: 500 },
      );
    return NextResponse.json(
      {
        msg: "Congratulations! new school added",
        data: school,
      },
      { status: 201 },
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

export async function GET(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    const schools = await prisma.school.findMany();
    return NextResponse.json(
      {
        msg: "Schools fetched successfully",
        data: schools,
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
