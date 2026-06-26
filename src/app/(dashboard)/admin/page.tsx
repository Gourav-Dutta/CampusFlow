import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/signIn");

  if (session.user.role !== "Admin") {
    redirect("/unauthorized");
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/school`, {
    cache: "no-store",
    headers: {
      Cookie: (await headers()).get("cookie") || "",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch schools");
  }

  const response = await res.json();
  const schools = response.data || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Welcome Back, {session.user.name}
        </h1>

        <p className="text-slate-500 mt-2">
          Manage schools and system operations.
        </p>
      </div>

      {/* Stats */}
      {/* Stats Section */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-blue-500">Schools</p>

          <h2 className="text-3xl font-bold mt-2 text-blue-500">
            {schools.length}
          </h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-blue-500">Users</p>

          <h2 className="text-3xl font-bold mt-2 text-blue-500">245</h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-blue-500">Principals</p>

          <h2 className="text-3xl font-bold mt-2 text-blue-500">120</h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-slate-500">Pending Marks</p>

          <h2 className="text-3xl font-bold text-orange-600 mt-2">18</h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-4">
        <Link
          href="/admin/addPrinciple"
          className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300"
        >
          <h3 className="font-semibold">Register Principal</h3>

          <p className="text-sm text-slate-500 mt-2">
            Create new principal accounts.
          </p>
        </Link>

        <Link
          href="/admin/users"
          className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300"
        >
          <h3 className="font-semibold">All Users</h3>

          <p className="text-sm text-slate-500 mt-2">
            View teachers, students and principals.
          </p>
        </Link>

        <Link
          href="/admin/AddMarks"
          className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300"
        >
          <h3 className="font-semibold">Add marks</h3>

          <p className="text-sm text-slate-500 mt-2">Add new marks.</p>
        </Link>

        <Link
          href="/admin/schools"
          className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300"
        >
          <h3 className="font-semibold">Schools</h3>

          <p className="text-sm text-slate-500 mt-2">
            Manage registered schools.
          </p>
        </Link>
      </div>

      {/* Schools */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-blue-500">Schools</h2>
        </div>

        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4 text-pink-500">Name</th>
              <th className="text-left p-4 text-pink-500">Type</th>
              <th className="text-left p-4 text-pink-500">Action</th>
            </tr>
          </thead>

          <tbody>
            {schools.map((school: any) => (
              <tr
                key={school.id}
                className="border-t border-slate-100 text-blue-500"
              >
                <td className="p-4">{school.name}</td>

                <td className="p-4">{school.type}</td>

                <td className="p-4">
                  <Link
                    href={`/admin/school/${school.id}`}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
