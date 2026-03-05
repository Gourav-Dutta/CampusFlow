import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { DocumentType } from "@/generated/prisma";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: { user_id: string } },
) {
  try {
    const formData = await req.formData();

    const files = formData.getAll("file") as File[];
    const docTypes = formData.getAll("doc_types") as DocumentType[];
    console.log(files);
    console.log(docTypes);
    if (!files.length) {
      return NextResponse.json(
        { message: "No files uploaded" },
        { status: 400 },
      );
    }

    const uploadedDocs = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const docType = docTypes[i];

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `campus-flow/users/${params.user_id}/documents`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(buffer);
      });

      const document = await prisma.userDocument.createMany({
        data: {
          user_id: params.user_id,
          doc_type: docType,
          public_id: uploadResult.public_id,
          file_url: uploadResult.secure_url,
        },
      });

      uploadedDocs.push(document);
    }

    return NextResponse.json({
      message: "Documents uploaded successfully",
      data: uploadedDocs,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}

export async function GET(
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

    const documents = await prisma.userDocument.findMany({
      where: {
        user_id: params.user_id,
      },
    });

    return NextResponse.json({
      msg: "Documents fetched successfully",
      data: documents,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
