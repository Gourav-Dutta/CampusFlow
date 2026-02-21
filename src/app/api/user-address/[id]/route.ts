import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id: userId } = await params;
    const formData = await req.formData();

    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const address_line_1 = formData.get("address_line_1") as string;
    const address_line_2 = formData.get("address_line_2") as string | null;

    const is_primary_raw = formData.get("is_primary");
    let is_primary_bool: boolean = false;

    if (typeof is_primary_raw === "string") {
      const lower = is_primary_raw.toLowerCase();
      if (lower === "true") {
        is_primary_bool = true;
      } else if (lower === "false") {
        is_primary_bool = false;
      } else {
        return NextResponse.json(
          {
            msg: "Invalid Boolean value for is_primary. Use 'true' or 'false'.",
          },
          { status: 400 },
        );
      }
    }

    if (!city || !state || !address_line_1) {
      return NextResponse.json(
        { msg: "Missing required fields" },
        { status: 400 },
      );
    }

    if (is_primary_bool) {
      await prisma.userAddress.updateMany({
        // Check if any address is primary that make it false
        where: { user_id: userId, is_primary: true },
        data: { is_primary: false },
      });
    }

    const newAddress = await prisma.userAddress.create({
      data: {
        city,
        state,
        address_line_1,
        address_line_2,
        is_primary: is_primary_bool,
        user: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json(
      { msg: "Address created successfully", data: newAddress },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("Database Error:", err);
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
    const formData = await req.formData();
    console.log(params.id);
    const validateUser = await prisma.userAddress.findUnique({
      where: { id: params.id },
    });

    if (!validateUser)
      return NextResponse.json(
        { msg: "User address not found" },
        { status: 404 },
      );
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const address_line_1 = formData.get("address_line_1") as string;
    const address_line_2 = formData.get("address_line_2") as string;

    const is_primary_raw = formData.get("is_primary");
    let is_primary_bool: boolean = false;

    if (typeof is_primary_raw === "string") {
      const lower = is_primary_raw.toLowerCase();
      if (lower === "true") {
        is_primary_bool = true;
      } else if (lower === "false") {
        is_primary_bool = false;
      } else {
        return NextResponse.json(
          {
            msg: "Invalid Boolean value for is_primary. Use 'true' or 'false'.",
          },
          { status: 400 },
        );
      }
    }

    const updateAddress: any = {};
    if (city) updateAddress.city = city;
    if (state) updateAddress.state = state;
    if (address_line_1) updateAddress.address_line_1 = address_line_1;
    if (address_line_2) updateAddress.address_line_2 = address_line_2;
    if (is_primary_bool) updateAddress.is_primary = is_primary_bool;

    if (updateAddress.is_primary) {
      await prisma.userAddress.updateMany({
        where: { user_id: validateUser.user_id, is_primary: true },
        data: { is_primary: false },
      });
    }

    const newAddress = await prisma.userAddress.update({
      where: { id: params.id },
      data: updateAddress,
    });

    return NextResponse.json(
      { msg: "Address created successfully", data: newAddress },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("Database Error:", err);
    return NextResponse.json(
      { msg: `An error occurred: ${err.message}` },
      { status: 500 },
    );
  }
}

// Get address based on user-id: /api/user-address/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const userAddress = await prisma.userAddress.findMany({
      where: { user_id: params.id },
      include: {
        user: true,
      },
    });

    return NextResponse.json({
      msg: "Address fetched successfully",
      data: userAddress,
    });
  } catch (err: any) {
    console.error("Database Error:", err);
    return NextResponse.json(
      { msg: `An error occurred: ${err.message}` },
      { status: 500 },
    );
  }
}

// Delete address based on address-id: /api/user-address/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const deleteAddress = await prisma.userAddress.delete({
      where: { id: params.id },
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

// Update is_primary of an address based on address-id:
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const validateAddress = await prisma.userAddress.findUnique({
      where: { id: params.id },
    });
    if (!validateAddress)
      return NextResponse.json(
        {
          msg: "The requested address not found",
        },
        { status: 404 },
      );
    const formData = await req.formData();
    const is_primary_raw = formData.get("is_primary") as string;
    let is_primary_boolean: boolean = false;

    if (typeof is_primary_raw === "string") {
      const Lower = is_primary_raw.toLowerCase();
      if (Lower === "true") {
        is_primary_boolean = true;
      } else if (Lower === "false") {
        is_primary_boolean = false;
      } else {
        return NextResponse.json(
          {
            msg: "Invalid Boolean value for is_primary. Use 'true' or 'false'.",
          },
          { status: 400 },
        );
      }
    }

    // Make is_priamry false for other address of that user
    if (is_primary_boolean) {
      await prisma.userAddress.updateMany({
        where: { user_id: validateAddress.user_id },
        data: { is_primary: false },
      });
    }
    const updateAddress = await prisma.userAddress.update({
      where: { id: params.id },
      data: { is_primary: is_primary_boolean },
      include: { user: true },
    });

    return NextResponse.json(
      {
        msg: "User address updated successfully",
        data: updateAddress,
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Database Error:", err);
    return NextResponse.json(
      { msg: `An error occurred: ${err.message}` },
      { status: 500 },
    );
  }
}
