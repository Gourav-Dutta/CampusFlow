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
                    { msg: "Invalid Boolean value for is_primary. Use 'true' or 'false'." },
                    { status: 400 }
                );
            }
        }


        if (!city || !state || !address_line_1) {
            return NextResponse.json({ msg: "Missing required fields" }, { status: 400 });
        }

        if (is_primary_bool) {
            await prisma.userAddress.updateMany({          // Check if any address is primary that make it false
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
                    connect: { id: userId }
                }
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


export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {

        const formData = await req.formData();
        console.log(params.id);
        const validateUser = await prisma.userAddress.findUnique({
            where: { id: params.id }
        });

        if (!validateUser) return NextResponse.json({ msg: "User address not found" }, { status: 404 });
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
                    { msg: "Invalid Boolean value for is_primary. Use 'true' or 'false'." },
                    { status: 400 }
                );
            }
        }


        // if (is_primary_bool) {
        //     await prisma.userAddress.updateMany({          // Check if any address is primary that make it false
        //         where: { user_id: params.id, is_primary: true },
        //         data: { is_primary: false },
        //     });
        // }

        const newAddress = await prisma.userAddress.create({
            where: { id: params.id },
            data: {
                city,
                state,
                address_line_1,
                address_line_2,
                is_primary: is_primary_bool,

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