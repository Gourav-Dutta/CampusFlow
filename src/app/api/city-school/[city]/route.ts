import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ city: string }> }
) {
  const { city } = await params;

  try {
    const schools = await prisma.school.findMany({
      where: {
        address: {
          is: {
            city: {
              equals: city,
              mode: "insensitive",
            },
          },
        },
      },
      include: {
        address: true,
        classSubjects: true,
        subjectTeachers: true,
        classrooms: true,
        schoolRooms: true
      },
    });

    if (schools.length === 0) {
      return NextResponse.json(
        { message: "No schools found in this city" },
        { status: 404 }
      );
    }

    return NextResponse.json(schools, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch schools" },
      { status: 500 }
    );
  }
}