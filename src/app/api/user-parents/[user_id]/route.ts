import prisma from "@/lib/prisma";
import { RelationStatus } from "@/generated/prisma";
import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

export async function POST( // Only a parent make this request, Parent adding a student request - A parent can add a user as relation but the status will be pending. Only that user whom the request is through approved it
  req: Request,
  { params }: { params: { user_id: string } },
) {
  try {
    const validateUser = await prisma.user.findUnique({
      where: { id: params.user_id },
    });
    if (!validateUser)
      return NextResponse.json(
        {
          msg: "User not found",
        },
        { status: 404 },
      );

    if (validateUser.role !== "Parent")
      return NextResponse.json(
        {
          msg: "Sorry, user is not a parent!",
        },
        { status: 400 },
      );
    const formData = await req.formData();
    const studentId = formData.get("studentId") as string;
    const newStu_Parent_Relation = await prisma.parentStudent.create({
      data: {
        student_id: studentId,
        parent_id: params.user_id,
        role: "Gurdian",
        status: "Pending",
      },
    });

    return NextResponse.json(
      {
        msg: "Parend added successfully",
        data: newStu_Parent_Relation,
      },
      { status: 201 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { msg: `Error fetching parents: ${err.message}` },
      { status: 500 },
    );
  }
}

export async function GET( // Fetch all the parents of a particular student
  req: Request,
  { params }: { params: { user_id: string } },
) {
  try {
    const validateUser = await prisma.user.findUnique({
      where: {
        id: params.user_id,
      },
    });
    if (!validateUser)
      return NextResponse.json(
        {
          msg: "User not found",
        },
        { status: 404 },
      );
    const parents = await prisma.parentStudent.findMany({
      where: {
        student_id: params.user_id,
      },
      include: {
        parent: true,
        student: true,
      },
    });

    return NextResponse.json({
      msg: "Parents fetched successfully",
      data: parents,
    });
  } catch (err: any) {
    return NextResponse.json(
      { msg: `Error fetching parents: ${err.message}` },
      { status: 500 },
    );
  }
}

//A parent can create a POST request to add a student as a relation in parentStudent table.
// The status will be pending. Only that user whom the request is through approved it.
// This is used to make sure that not whoever want can add any student in their relation.
export async function PUT(
  req: Request,
  { params }: { params: { user_id: string } },
) {
  // Only for user-student type-- the user_id comes through params should be the user not the parent
  try {
    const validateUser = await prisma.user.findUnique({
      where: {
        id: params.user_id,
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
    const parentId = formData.get("parentId") as string;
    const status = formData.get("status") as RelationStatus;
    const updateStatus = await prisma.parentStudent.updateMany({
      where: { parent_id: parentId, student_id: params.user_id },
      data: { status: status },
    });
    return NextResponse.json(
      {
        msg: "Status update successfully",
        data: updateStatus,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { msg: `Error fetching parents: ${err.message}` },
      { status: 500 },
    );
  }
}
// // export async function PATCH(
// //   req: Request,
// //   { params }: { params: { user_id: string } },
// // ) {
// //   try {
// //     const formData = await req.formData();
// //     const validateUser = await prisma.parent.findUnique({
// //       where: { id: params.user_id },
// //     });

// //     if (!validateUser)
// //       return NextResponse.json(
// //         {
// //           msg: "User not found",
// //         },
// //         { status: 404 },
// //       );

// //     const name = formData.get("name") as string | null;
// //     const email = formData.get("email") as string | null;
// //     const phone_number = formData.get("phone_number") as string | null;
// //     const address_line_1 = formData.get("address_line_1") as string | null;
// //     const address_line_2 = formData.get("address_line_2") as string | null;
// //     const rawPassword = formData.get("password") as string | null;
// //     // const role = formData.get("role") as string | null;  // Role is not editable right now -- Solve this issue!

// //     const updateData: any = {};
// //     if (name) updateData.name = name;
// //     if (email) updateData.email = email;
// //     if (phone_number) updateData.phone_number = phone_number;
// //     if (address_line_1) updateData.address_line_1 = address_line_1;
// //     if (address_line_2) updateData.address_line_2 = address_line_2;

// //     if (rawPassword && rawPassword.length > 0) {
// //       updateData.password = await bcrypt.hash(rawPassword, 10);
// //     }

// //     const updatedParent = await prisma.parent.update({
// //       where: { id: params.user_id },
// //       data: {
// //         ...updateData,
// //       },
// //     });
// //     // Issue: Let say one parent is related to multiple students, then i need to update the role of all the students or i have to update on the basis of the student id

// //     return NextResponse.json({
// //       msg: "Parent updated successfully",
// //       data: updatedParent,
// //     });
// //   } catch (err: any) {
// //     console.error("Update Error:", err);
// //     return NextResponse.json({ msg: err.message }, { status: 500 });
// //   }
// // }

// // export async function DELETE(
// //   req: Request,
// //   { params }: { params: { user_id: string } },
// // ) {
// //   try {
// //     await prisma.$transaction([
// //       prisma.parentStudent.deleteMany({
// //         where: { parent_id: params.user_id },
// //       }),
// //       prisma.parent.delete({
// //         where: { id: params.user_id },
// //       }),
// //     ]);

// //     return NextResponse.json({ msg: "Parent deleted successfully" });
// //   } catch (err: any) {
// //     return NextResponse.json({ msg: err.message }, { status: 500 });
// //   }
// // }
