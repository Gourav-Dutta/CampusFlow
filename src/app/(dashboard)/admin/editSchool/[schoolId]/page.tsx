"use client";

import { useEffect, useState } from "react";

type Principal = {
  id: string;
  name: string;
  email: string;
};

export default function EditSchoolPage({
  params,
}: {
  params: { schoolId: string };
}) {
  const [school, setSchool] = useState<any>(null);
  const [principals, setPrincipals] = useState<Principal[]>([]);
  const [selectedPrincipal, setSelectedPrincipal] = useState("");

  useEffect(() => {
    fetchSchool();
    fetchPrincipals();
  }, []);

  async function fetchSchool() {
    const res = await fetch(`/api/school/${params.schoolId}`, {
      cache: "no-store",
    });

    const data = await res.json();

    setSchool(data.data);

    if (data.data?.principal_id) {
      setSelectedPrincipal(data.data.principal_id);
    }
  }

  async function fetchPrincipals() {
    const res = await fetch("/api/principle");

    const data = await res.json();

    setPrincipals(data.data || []);
  }

  async function updatePrincipal() {
    const formData = new FormData();

    formData.append("principleId", selectedPrincipal);

    const res = await fetch(`/api/school/${params.schoolId}`, {
      method: "PATCH",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      alert("Principal updated");
      fetchSchool();
    } else {
      alert(data.msg);
    }
  }

  if (!school) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-8 text-white">
        <h1 className="text-4xl font-bold">Edit School</h1>

        <p className="mt-2 text-indigo-100">{school.name}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* School Info */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6">
          <h2 className="font-semibold text-indigo-800 mb-4">
            School Information
          </h2>

          <div className="space-y-3 text-blue-300">
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

        {/* Principal Assignment */}
        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6">
          <h2 className="font-semibold text-amber-800 mb-4">
            Assign Principal
          </h2>

          <select
            value={selectedPrincipal}
            onChange={(e) => setSelectedPrincipal(e.target.value)}
            className="w-full border border-amber-200 rounded-xl p-3 bg-white"
          >
            <option value="">Select Principal</option>

            {principals.map((principal) => (
              <option key={principal.id} value={principal.id}>
                {principal.name} ({principal.email})
              </option>
            ))}
          </select>

          <button
            onClick={updatePrincipal}
            className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl"
          >
            Update Principal
          </button>
        </div>
      </div>

      {/* Current Principal */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6">
        <h2 className="font-semibold text-emerald-800 mb-4">
          Current Principal
        </h2>

        {school.principal ? (
          <div>
            <p className="font-semibold text-lg text-amber-500">
              {school.principal.name}
            </p>

            <p className="text-slate-600">{school.principal.email}</p>
          </div>
        ) : (
          <p className="text-slate-500">No principal assigned</p>
        )}
      </div>
    </div>
  );
}
