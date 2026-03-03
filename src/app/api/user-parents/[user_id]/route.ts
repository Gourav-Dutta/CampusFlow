// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

// export async function POST( // Only a user (student) can add their parents
//   req: Request,
//   { params }: { params: { user_id: string } },
// ) {
//   try {
//     const validateUser = await prisma.user.findUnique({
//       where: { id: params.user_id },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//       },
//     });

//     if (!validateUser)
//       return NextResponse.json(
//         {
//           msg: "User not found",
//         },
//         { status: 404 },
//       );

//     if (validateUser.role !== "Student")
//       return NextResponse.json(
//         {
//           msg: "Only a Student can add their parent",
//         },
//         { status: 404 },
//       );

//     const formData = await req.formData();
//     const email = formData.get("email") as string;
//     const phone_number = formData.get("phone_number") as string;
//     const RawPassword = formData.get("password") as string;
//     const address_line_1 = formData.get("address_line_1") as string;
//     const address_line_2 = formData.get("address_line_2") as string;
//     const name = formData.get("name") as string;
//     const role = formData.get("role") as string;
//     const password = await bcrypt.hash(RawPassword, 10);

//     const newParent = await prisma.parent.create({
//       data: {
//         name,
//         email,
//         phone_number,
//         password,
//         address_line_1,
//         address_line_2,
//         students: {
//           create: {
//             role: role,
//             student: {
//               connect: { id: params.user_id },
//             },
//           },
//         },
//       },
//     });
//     console.log(name);
//     return NextResponse.json({
//       msg: "Data Get",
//       data: newParent,
//     });
//   } catch (err: any) {
//     console.error("Database Error:", err);
//     return NextResponse.json(
//       { msg: `An error occurred: ${err.message}` },
//       { status: 500 },
//     );
//   }
// }

// // export async function GET( // Fetch all the parents of a particular student
// //   req: Request,
// //   { params }: { params: { user_id: string } },
// // ) {
// //   try {
// //     const parents = await prisma.parent.findMany({
// //       where: {
// //         students: {
// //           some: {
// //             student_id: params.user_id,
// //           },
// //         },
// //       },
// //     });

// //     return NextResponse.json({
// //       msg: "Parents fetched successfully",
// //       data: parents,
// //     });
// //   } catch (err: any) {
// //     return NextResponse.json(
// //       { msg: `Error fetching parents: ${err.message}` },
// //       { status: 500 },
// //     );
// //   }
// // }

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
