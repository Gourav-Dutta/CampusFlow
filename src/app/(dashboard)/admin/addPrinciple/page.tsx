"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPrincipalPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone_no: "",
    role: "Principal",
    year: new Date().getFullYear().toString(),
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("phone_no", form.phone_no);
      formData.append("year", form.year);
      formData.append("role", form.year);

      // Fixed role
      formData.append("role", "Principal");

      const res = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone_no: form.phone_no,
          year: form.year,
          role: form.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg);
        return;
      }

      alert("Principal created successfully");

      router.push("/admin/users");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-8 text-white">
        <h1 className="text-4xl font-bold">Add Principal</h1>

        <p className="mt-2 text-indigo-100">
          Create a new principal account for a school.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-5">
            Personal Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="p-3 rounded-xl border bg-white"
            />

            <input
              type="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="p-3 rounded-xl border bg-white"
            />

            <input
              type="text"
              placeholder="Phone Number"
              required
              value={form.phone_no}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone_no: e.target.value,
                })
              }
              className="p-3 rounded-xl border bg-white"
            />

            <input
              type="text"
              value={form.year}
              readOnly
              className="p-3 rounded-xl border bg-slate-100"
            />
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-orange-700 mb-5">
            Account Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="p-3 rounded-xl border bg-white"
            />

            <input
              value="Principal"
              disabled
              className="p-3 rounded-xl border bg-slate-100"
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
        >
          {loading ? "Creating Principal..." : "Create Principal"}
        </button>
      </form>
    </div>
  );
}
