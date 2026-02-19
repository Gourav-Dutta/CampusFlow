// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function POST(
//   req: Request,
//   { params }: { params: { id: string } },
// ) {
//   try {
//     const userId = await params.id;
//     console.log(userId);
//     const formData = await req.formData();
//     console.log(formData);
//     type obj = {
//       city?: string;
//       state?: string;
//       address_line_1?: string;
//       address_line_2?: string;
//       is_primary?: string;
//     };

//     const userAddress: obj = {};
//     const city = formData.get("city") as string;
//     const state = formData.get("state") as string;
//     const address_line_1 = formData.get("address_line_1") as string;
//     const address_line_2 = formData.get("address_line_2") as string;
//     const is_primary = formData.get("is_primary");

//     if (typeof city === "string") userAddress.city = city;
//     if (typeof state === "string") userAddress.state = state;
//     if (typeof address_line_1 === "string")
//       userAddress.address_line_1 = address_line_1;
//     if (typeof address_line_2 === "string")
//       userAddress.address_line_2 = address_line_2;
//     if (typeof is_primary === "string") {
//       userAddress.is_primary = is_primary === "true";
//     }

//     const newAddress = await prisma.userAddress.create({
//     where: {id: userId},

//     })
//     return NextResponse.json(
//       {
//         msg: "User Found",
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
