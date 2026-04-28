import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdminPrinciple } from "@/lib/requireAdminPrinciple";

// model ClassSection {
//   id       String @id @default(uuid())
//   name     String
//   class_id String

//   classroom                 ClassRoom                  @relation(fields: [class_id], references: [id], onDelete: Cascade)
//   studentClasses            StudentClass[]
//   // classSubjects   ClassSubject[]
//   classSubjectTeachers      ClassSubjectTeacher[]
//   studentSubjectEnrollments StudentSubjectEnrollment[]
//   attendance                Attendance[]
//   marks                     StudentMarks[]
// }

export async function POST(
  req: Request,
  { params }: { params: { class_id: string } },
) {
  try {
    const deny = await requireAdminPrinciple();
    if (deny) return deny;
    const { class_id } = params;
    const formData = await req.formData();
    const sectionName = formData.get("sectionName") as string;
    const validateClass = await prisma.classRoom.findUnique({
      where: { id: class_id },
    });
    if (!validateClass) {
      return NextResponse.json(
        { error: "Classroom not found" },
        { status: 404 },
      );
    }
    const newClassSection = await prisma.classSection.create({
      data: {
        name: sectionName,
        class_id: class_id,
      },
    });
    return NextResponse.json({
      msg: "Class section created successfully",
      data: newClassSection,
    });
  } catch (error) {
    console.error("Error occurred while creating class section:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request, { params }: { params: { class_id: string } }) {
  try {
    const { class_id } = params;
    const classSecctions = await prisma.classSection.findMany({
      where: { class_id: class_id },
    });
    return NextResponse.json({ data: classSecctions });
  } catch (error) {
    console.error("Error occurred while fetching class sections:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { class_id: string } },
) {
  try {
    const deny = await requireAdminPrinciple();
    if(deny) return deny;
    const { class_id } = params;
    const deleteClassSections = await prisma.classSection.deleteMany({
      where: { class_id: class_id },
    });
    return NextResponse.json({
      msg: "Class sections deleted successfully",
      data: deleteClassSections,
    });
  } catch (error) {
    console.error("Error occurred while deleting class sections:", error);
    return NextResponse.json({ error: "Internal server error" });
  }
}
