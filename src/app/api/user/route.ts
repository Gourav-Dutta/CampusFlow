import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


// Get my profile
export async function GET(req: Request) { // Get user based on userID
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
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

// Update my account
export async function PUT(req: Request) { // Update user based on userID
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
    };

    const updateData: UpdateUser = {};

    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;
    const phone_no = formData.get("phone_no") as string;
    // const year = formData.get("year") as string;

    if (typeof name === "string") updateData.name = name;
    if (typeof password === "string") updateData.password = password;
    if (typeof email === "string") updateData.email = email;
    if (typeof phone_no === "string") updateData.phone_no = phone_no;
    // if (typeof year === "string") updateData.year = year;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json(
      { msg: "Your details updated successfully", data: updatedUser },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { msg: `An error occurred: ${err.message}` },
      { status: 500 },
    );
  }
}

// Like- delete my account
export async function DELETE(req: Request) { // Delete user based on userID
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
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
      include: {
        parentLinks: true,
      },
    });
    return NextResponse.json(
      {
        msg: "User Deleted Successfully",
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
// export async function GET(req: Request) {
//   try {
//     const deny = await requireAdmin();
//     if (deny) return deny;
//     const allUser = await prisma.user.findMany();
//     console.log("All user found");
//     return NextResponse.json(
//       {
//         msg: "All user found",
//         data: allUser,
//       },
//       { status: 200 },
//     );
//   } catch (err: any) {
//     return NextResponse.json(
//       {
//         msg: `An error occured: ${err.message}`,
//       },
//       { status: 500 },
//     );
//   }
// }
