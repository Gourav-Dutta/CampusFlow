import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { city: string } },
) {
  //   const { city } = params;
  //   console.log(city);

  try {
    const schools = await prisma.school.findMany({
      where: {
        address: {
          city: {
            equals: params.city,
            mode: "insensitive",
          },
        },
      },
      include: {
        address: true,
      },
    });
    console.log(schools);

    if (schools.length === 0)
      return NextResponse.json({
        msg: "No schools found in this city",
        status: 404,
      });

    return NextResponse.json({ data: schools }, { status: 200 });
  } catch (error) {
    console.error("Error fetching schools by city:", error);
    return NextResponse.json(
      { error: "Failed to fetch schools" },
      { status: 500 },
    );
  }
}
