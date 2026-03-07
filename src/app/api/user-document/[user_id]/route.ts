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

    // Upload time is too long. Reduce it..
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

// PUT /api/user-document/[user_id]
// Body (multipart/form-data):
//   - To REPLACE an existing document: doc_id (string), file (File), doc_type (DocumentType)
//   - To ADD more documents:            file[] (File[]), doc_types[] (DocumentType[])  — same as POST
export async function PUT(
  req: Request,
  { params }: { params: { user_id: string } },
) {
  try {
    const formData = await req.formData();

    const docId = formData.get("doc_id") as string | null;

    // UPDATE an existing document -- We will fetch all document of a user and
    // send their doc_id to backend for update .
    if (docId) {
      const file = formData.get("file") as File | null;
      const docType = formData.get("doc_type") as DocumentType | null;
      console.log(file);
      console.log(docType);

      if (!file) {
        return NextResponse.json(
          { message: "No file provided for update" },
          { status: 400 },
        );
      }

      // Fetch the existing record so we can delete the old Cloudinary asset
      const existing = await prisma.userDocument.findUnique({
        where: { id: docId },
      });

      if (!existing || existing.user_id !== params.user_id) {
        return NextResponse.json(
          { message: "Document not found" },
          { status: 404 },
        );
      }

      // Delete old asset from Cloudinary
      await cloudinary.uploader.destroy(existing.public_id);

      // Upload new file to Cloudinary
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: `campus-flow/users/${params.user_id}/documents` },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(buffer);
      });

      const updated = await prisma.userDocument.update({
        where: { id: docId },
        data: {
          doc_type: docType ?? existing.doc_type,
          public_id: uploadResult.public_id,
          file_url: uploadResult.secure_url,
        },
      });

      return NextResponse.json({
        message: "Document updated successfully",
        data: updated,
      });
    }

    // ADD more documents
    const files = formData.getAll("file") as File[];
    const docTypes = formData.getAll("doc_types") as DocumentType[];

    if (!files.length) {
      return NextResponse.json(
        { message: "No files provided" },
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
            { folder: `campus-flow/users/${params.user_id}/documents` },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(buffer);
      });

      const document = await prisma.userDocument.create({
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
      message: "Documents added successfully",
      data: uploadedDocs,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(
  req: Request,
  { params }: { params: { user_id: string } },
) {
  try {
    const { searchParams } = new URL(req.url);
    const docId = searchParams.get("doc_id");
    console.log(docId);

    if (!docId) {
      return NextResponse.json(
        { message: "doc_id query param is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.userDocument.findUnique({
      where: { id: docId },
    });

    if (!existing || existing.user_id !== params.user_id) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 },
      );
    }

    // Remove from Cloudinary
    await cloudinary.uploader.destroy(existing.public_id);

    // Remove from Poatgres  DB
    await prisma.userDocument.delete({ where: { id: docId } });

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
