"use client";

import { useState } from "react";

export default function AddRoomModal({ schoolId }: { schoolId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    formData.append("schoolId", schoolId);
    console.log(schoolId);

    const res = await fetch("/api/schoolRoom", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      location.reload();
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-grey border rounded-2xl p-6 flex gap-4 flex-wrap"
    >
      <input
        name="roomNo"
        placeholder="Room No"
        className="border p-2 rounded"
      />

      <input
        name="roomCapacity"
        placeholder="Capacity"
        className="border p-2 rounded"
      />
      <select name="roomType" className="text-blue-300">
        <option value="CLASSROOM">CLASSROOM</option>
        <option value="LAB">LAB</option>
        <option value="LIBRARY">LIBRARY</option>
        <option value="OFFICE">OFFICE</option>
        <option value="AUDITORIUM">AUDITORIUM</option>
      </select>

      <select name="roomStatus" className="text-blue-300">
        <option value="ACTIVE">ACTIVE</option>
        <option value="UNDER_MAINTENANCE">UNDER_MAINTENANCE</option>
        <option value="UNDER_RENOVATION">UNDER_RENOVATION</option>
        <option value="DAMAGED">DAMAGED</option>
        <option value="CLOSED">CLOSED</option>
      </select>

      <button
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Add Room"}
      </button>
    </form>
  );
}
