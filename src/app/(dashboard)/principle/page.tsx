import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

async function getSchools() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/principle/school`, {
    cache: "no-store",
    headers: {
      Cookie: (await headers()).get("cookie") || "",
    },
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function PrincipalDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/signIn");

  if (session.user.role !== "Principal") {
    redirect("/unauthorized");
  }

  const schools = await getSchools();
  console.log(schools);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome, {session.user.name}
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your assigned school and monitor academic activities.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm text-slate-500">Assigned Schools</p>

          <h2 className="mt-2 text-4xl font-bold text-indigo-600">
            {schools.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm text-slate-500">Status</p>

          <h2 className="mt-2 text-xl font-semibold text-green-600">Active</h2>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm text-slate-500">Role</p>

          <h2 className="mt-2 text-xl font-semibold text-blue-600">
            Principal
          </h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {schools.map((school: any) => (
            <Link
              href={`/principle/school/${school.id}/users`}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-500 transition"
            >
              <h3 className="font-semibold text-slate-800">Teachers Section</h3>
              <p className="mt-2 text-sm text-slate-500">All teachers</p>
            </Link>
          ))}

          {schools.map((school: any) => (
            <Link
              href={`/principle/school/${school.id}/address`}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-500 transition"
            >
              <h3 className="font-semibold text-slate-800">School Address</h3>
              <p className="mt-2 text-sm text-slate-500">
                Add and Edit School Address
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Schools */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">
            Assigned Schools
          </h2>
        </div>

        {schools.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-slate-500">No school has been assigned yet.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 font-semibold">School Name</th>

                <th className="text-left p-4 font-semibold">Type</th>

                <th className="text-left p-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {schools.map((school: any) => (
                <tr key={school.id} className="border-t border-slate-100">
                  <td className="p-4 font-medium text-blue-300">
                    {school.name}
                  </td>

                  <td className="p-4 text-blue-300">{school.type}</td>

                  <td className="p-4">
                    <Link
                      href={`/principle/school/${school.id}`}
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
