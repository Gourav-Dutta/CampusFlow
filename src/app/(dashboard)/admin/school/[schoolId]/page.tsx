import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: {
    schoolId: string;
  };
};

export default async function SchoolDetailsPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/signIn");

  if (session.user.role !== "Admin") {
    redirect("/unauthorized");
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/school/${params.schoolId}`, {
    cache: "no-store",
    headers: {
      Cookie: (await headers()).get("cookie") || "",
    },
  });

  if (!res.ok) {
    redirect("/unauthorized");
  }

  const response = await res.json();

  const school = response.data;

  if (!school) {
    redirect("/unauthorized");
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold">{school.name}</h1>

        <p className="mt-2 text-indigo-100">{school.type}</p>
      </div>

      {/* Info */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6">
          <h2 className="font-semibold text-indigo-800 mb-4">
            School Information
          </h2>

          <div className="space-y-2 text-blue-500">
            <p>
              <strong>Name:</strong> {school.name}
            </p>

            <p>
              <strong>Type:</strong> {school.type}
            </p>

            <p>
              <strong>ID:</strong> {school.id}
            </p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6">
          <h2 className="font-semibold text-emerald-800 mb-4">Address</h2>

          <div className="space-y-2 text-blue-500">
            <p>{school.address?.address_line_1}</p>
            <p>{school.address?.address_line_2}</p>
            <p>{school.address?.city}</p>
            <p>{school.address?.state}</p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6">
          <h2 className="font-semibold text-emerald-800 mb-4">Edit</h2>
          <Link
            href={`/admin/editSchool/${school.id}`}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Edit
          </Link>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6">
          <h2 className="font-semibold text-amber-800 mb-4">Principal</h2>

          {school.principal ? (
            <>
              <p className="font-semibold text-amber-500">
                {school.principal.name}
              </p>

              <p className="text-slate-600">{school.principal.email}</p>
            </>
          ) : (
            <p className="text-slate-500">No principal assigned</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-5">
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">
          <p className="text-blue-600">Classrooms</p>

          <h2 className="text-4xl font-bold text-blue-700">
            {school.classrooms?.length || 0}
          </h2>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6">
          <p className="text-orange-600">Rooms</p>

          <h2 className="text-4xl font-bold text-orange-700">
            {school.schoolRooms?.length || 0}
          </h2>
        </div>
      </div>
    </div>
  );
}
