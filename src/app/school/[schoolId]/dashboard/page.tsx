// This is a SERVER component — can fetch directly
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Next.js passes params automatically from the URL
type Props = {
  params: { schoolId: string };
};

export default async function PrincipalDashboard({ params }: Props) {
  const { schoolId } = params;
  console.log("Principal Dashboard for schoolId:", schoolId);

  // Verify session
  const session = await auth.api.getSession({ headers: await headers() });
  console.log("Session in PrincipalDashboard:", session);
  console.log("Test 1");
  if (!session) redirect("/login");
  if (session.user.role !== "Principal") redirect("/unauthorized");
  console.log("Test 2");
  // Fetch school data using schoolId from URL
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    include: {
      address: true,
      classrooms: true,
      schoolRooms: true,
    },
  });

  console.log("fetched school: ", school);
  console.log("Test 3");
  // 3. Make sure this principal associated with this school
  if (!school || school.principal_id !== session.user.id) {
    redirect("/unauthorized"); // prevent principals accessing other schools
  }

  return (
    <div>
      <h1 className="text-2xl text-blue-700">{school.name} Dashboard</h1>
      <p>Type: {school.type}</p>
    </div>
  );
}