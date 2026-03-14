"use server";

import prisma from "@/lib/prisma";

export async function searchSchools(formData: FormData) {
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;

  const schools = await prisma.school.findMany({
    where: {
      addresses: {
        some: {
          // 'mode: insensitive' makes "Kolkata" match "kolkata"
          city: city ? { contains: city, mode: "insensitive" } : undefined,
          state: state ? { equals: state, mode: "insensitive" } : undefined,
        },
      },
    },
    include: {
      addresses: true,
    },
  });

  return schools;
}
