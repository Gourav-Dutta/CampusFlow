"use client";

// import EditRoomModal from "./EditRoomModal";
import EditRoomModal from "./editRoomModal";

export default function RoomTable({
  rooms,
  schoolId,
}: {
  rooms: any[];
  schoolId: string;
}) {
  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="p-4 text-left">Room No</th>

            <th className="p-4 text-left">Capacity</th>

            <th className="p-4 text-left">Type</th>

            <th className="p-4 text-left">Status</th>

            <th className="p-4 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="border-t">
              <td className="p-4 text-blue-300">{room.room_no}</td>

              <td className="p-4 text-blue-300">{room.capacity}</td>

              <td className="p-4 text-blue-300">{room.type}</td>

              <td className="p-4 ">
                <span
                  className={`px-3 py-1 rounded-full text-xs
                  ${
                    room.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {room.status}
                </span>
              </td>

              <td className="p-4">
                <EditRoomModal room={room} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
