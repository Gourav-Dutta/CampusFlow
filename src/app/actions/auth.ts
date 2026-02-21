// "use server";

import { userRole } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function signUpAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;
    const phone_no = formData.get("phone_no") as string;
    const year = formData.get("year") as string;
    const role = formData.get("role") as userRole;

    const newUser = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        phone_no,
        role,
        year,
      },
    });
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
      msg: "Logged Out"
    })
  } catch (err: any) {
    return NextResponse.json({
      msg: `An error occured: ${err.message}`
    })
  }
}
