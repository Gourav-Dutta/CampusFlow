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

  const res = await fetch(`${baseUrl}/api/users`, {
    cache: "no-store",
    headers: {
      Cookie: (await headers()).get("cookie") || "",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  const response = await res.json();
  const users = response.data || [];
  console.log(users);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">User Management</h1>

            <p className="mt-2 text-indigo-100">
              Manage principals, teachers, students and parents.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-5">
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">
          <p className="text-blue-600">Total Users</p>

          <h2 className="text-4xl font-bold text-blue-700 mt-2">
            {users.length}
          </h2>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6">
          <p className="text-emerald-600">Principals</p>

          <h2 className="text-4xl font-bold text-emerald-700 mt-2">
            {users.filter((u: any) => u.role === "Principal").length}
          </h2>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6">
          <p className="text-orange-600">Teachers</p>

          <h2 className="text-4xl font-bold text-orange-700 mt-2">
            {users.filter((u: any) => u.role === "Teacher").length}
          </h2>
        </div>

        <div className="bg-pink-50 border border-pink-100 rounded-3xl p-6">
          <p className="text-pink-600">Students</p>

          <h2 className="text-4xl font-bold text-pink-700 mt-2">
            {users.filter((u: any) => u.role === "Student").length}
          </h2>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full outline-none"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold">All Users</h2>
        </div>

        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4">User</th>

              <th className="text-left p-4">Email</th>

              <th className="text-left p-4">Role</th>

              <th className="text-left p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user: any) => (
              <tr
                key={user.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                      {user.name?.charAt(0)}
                    </div>

                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>

                <td className="p-4 text-slate-600">{user.email}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    ${user.role === "Admin" ? "bg-red-100 text-red-700" : ""}
                    ${
                      user.role === "Principal"
                        ? "bg-blue-100 text-blue-700"
                        : ""
                    }
                    ${
                      user.role === "Teacher"
                        ? "bg-green-100 text-green-700"
                        : ""
                    }
                    ${
                      user.role === "Student"
                        ? "bg-purple-100 text-purple-700"
                        : ""
                    }
                  `}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="p-4">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
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
