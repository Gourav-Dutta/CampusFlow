"use client";

import { useState } from "react";

export default function EditRoomModal({ room }: { room: any }) {
  const [loading, setLoading] = useState(false);

  async function updateRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    formData.append("roomId", room.id);

    const res = await fetch("/api/schoolRoom", {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      location.reload();
    }

    setLoading(false);
  }

  return (
    <form onSubmit={updateRoom} className="flex gap-2 items-center">
      <input
        name="roomCapacity"
        defaultValue={room.capacity}
        className="border rounded px-2 py-1 w-20"
      />

      <select
        name="roomStatus"
        defaultValue={room.status}
        className="border rounded px-2 py-1"
      >
        <option value="ACTIVE">ACTIVE</option>
        <option value="UNDER_MAINTENANCE">UNDER_MAINTENANCE</option>
        <option value="UNDER_RENOVATION">UNDER_RENOVATION</option>
        <option value="DAMAGED">DAMAGED</option>
        <option value="CLOSED">CLOSED</option>
      </select>

      <button
        disabled={loading}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Save
      </button>
    </form>
  );
}
