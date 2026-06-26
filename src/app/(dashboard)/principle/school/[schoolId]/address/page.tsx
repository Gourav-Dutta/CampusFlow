"use client";

import { useEffect, useState } from "react";

type Address = {
  id: string;
  city: string;
  state: string;
  address_line_1: string;
  address_line_2: string | null;
};

export default function AddressPage({
  params,
}: {
  params: { schoolId: string };
}) {
  const schoolId = params.schoolId;

  const [address, setAddress] = useState<Address | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    city: "",
    state: "",
    address_line_1: "",
    address_line_2: "",
  });

  async function loadAddress() {
    try {
      const res = await fetch(`/api/school-address/${schoolId}`);

      const data = await res.json();

      if (data.data && data.data.length > 0) {
        const addr = data.data[0];

        setAddress(addr);

        setForm({
          city: addr.city,
          state: addr.state,
          address_line_1: addr.address_line_1,
          address_line_2: addr.address_line_2 || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAddress();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    const formData = new FormData();

    formData.append("city", form.city);

    formData.append("state", form.state);

    formData.append("address_line_1", form.address_line_1);

    formData.append("address_line_2", form.address_line_2);

    const res = await fetch(`/api/school-address/${schoolId}`, {
      method: address ? "PUT" : "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg);
      return;
    }

    alert(address ? "Address Updated" : "Address Added");

    await loadAddress();

    setSaving(false);
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-3xl border shadow-sm p-8">
        <h1 className="text-3xl font-bold text-slate-800">School Address</h1>

        <p className="mt-2 text-slate-500">Add or update school address.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block mb-2 font-medium">City</label>

            <input
              value={form.city}
              onChange={(e) =>
                setForm({
                  ...form,
                  city: e.target.value,
                })
              }
              className="w-full border rounded-xl p-3 text-black font-semibold"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium  ">State</label>

            <input
              value={form.state}
              onChange={(e) =>
                setForm({
                  ...form,
                  state: e.target.value,
                })
              }
              className="w-full border rounded-xl text-black font-semibold p-3"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Address Line 1</label>

            <input
              value={form.address_line_1}
              onChange={(e) =>
                setForm({
                  ...form,
                  address_line_1: e.target.value,
                })
              }
              className="w-full border font-semibold text-black rounded-xl p-3"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Address Line 2</label>

            <input
              value={form.address_line_2}
              onChange={(e) =>
                setForm({
                  ...form,
                  address_line_2: e.target.value,
                })
              }
              className="w-full border font-semibold text-black rounded-xl p-3"
            />
          </div>

          <button
            disabled={saving}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
          >
            {saving ? "Saving..." : address ? "Update Address" : "Add Address"}
          </button>
        </form>
      </div>
    </div>
  );
}
