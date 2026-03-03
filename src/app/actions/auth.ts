// "use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma";

export async function signUpAction(formData: FormData) {
  // If the user is student -> student portal, teacher -> Teacher Portal, principle -> Principle Portal, Parent-> Parent Portal
  // Issue--
  try {
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;
    const phone_no = formData.get("phone_no") as string;
    const year = formData.get("year") as string;
    const role = formData.get("role") as UserRole;
    const studentId = formData.get("studentId") as string;
    console.log("Code execuation start");

    const newUser = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        phone_no,
        role,
        year,
      },
      // headers: await headers(),
    });
    console.log(newUser?.user?.id);
    console.log(role);
    console.log(studentId);

    if (role === UserRole.Parent && studentId && newUser?.user?.id) {
      await prisma.parentStudent.create({
        data: {
          parent_id: newUser.user.id,
          student_id: studentId,
          role: "Guardian",
        },
      });
      console.log("Parent Created");
    }
    return NextResponse.json(
      {
        msg: "User creted",
        data: newUser,
      },
      { status: 201 },
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

export async function SignInAction(formData: FormData) {
  // If the user is student -> student portal, teacher -> Teacher Portal, principle -> Principle Portal
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const user = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return NextResponse.json({
      msg: "User logged in Successfully",
      data: user,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        msg: `An error occured: ${err.message}`,
      },
      { status: 500 },
    );
  }
}

export async function SignOutAction() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    return NextResponse.json({
      msg: "Logged Out",
    });
  } catch (err: any) {
    return NextResponse.json({
      msg: `An error occured: ${err.message}`,
    });
  }
}
