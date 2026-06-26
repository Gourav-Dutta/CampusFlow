import { headers } from "next/headers";

async function getSchoolUsers(schoolId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/user-school/${schoolId}`, {
    cache: "no-store",
    headers: {
      Cookie: (await headers()).get("cookie") || "",
    },
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();

  return data.data || [];
}

export default async function UsersPage({
  params,
}: {
  params: Promise<{
    schoolId: string;
  }>;
}) {
  const { schoolId } = await params;

  const users = await getSchoolUsers(schoolId);

  const students = users.filter((u: any) => u.user.role === "Student");

  const teachers = users.filter((u: any) => u.user.role === "Teacher");

  const parents = users.filter((u: any) => u.user.role === "Parent");

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">School Users</h1>

        <p className="text-slate-500 mt-2">
          Manage students, teachers and parents.
        </p>
      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border p-6">
          <p className="text-slate-500 text-sm">Total Users</p>

          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            {users.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <p className="text-slate-500 text-sm">Teachers</p>

          <h2 className="text-4xl font-bold text-blue-600 mt-2">
            {teachers.length}
          </h2>
        </div>
      </div>

      {/* User Table */}

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b">
          <h2 className="text-lg font-semibold">User Directory</h2>
        </div>

        {users.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No users found.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left">Name</th>

                <th className="p-4 text-left">Email</th>

                <th className="p-4 text-left">Role</th>

                <th className="p-4 text-left">User ID</th>
              </tr>
            </thead>

            <tbody>
              {users.map((item: any) => (
                <tr key={item.id} className="border-t">
                  <td className="p-4 font-medium text-blue-500">
                    {item.user?.name}
                  </td>

                  <td className="p-4 text-blue-500">{item.user?.email}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs
                        ${
                          item.user?.role === "Student"
                            ? "bg-green-100 text-green-700"
                            : item.user?.role === "Teacher"
                              ? "bg-blue-100 text-blue-700"
                              : item.user?.role === "Parent"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-slate-100 text-slate-700"
                        }`}
                    >
                      {item.user?.role}
                    </span>
                  </td>

                  <td className="p-4 text-slate-500">{item.user?.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
