import { headers } from "next/headers";
// import AddRoomModal from "@/componenets/addRoomModel";
// import RoomTable from "@/components/RoomTable";
import AddRoomModal from "@/app/componenets/addRoomModel";
import RoomTable from "@/app/componenets/roomTable";

async function getRooms(schoolId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/schoolRoom?schoolId=${schoolId}`, {
    cache: "no-store",
    headers: {
      Cookie: (await headers()).get("cookie") || "",
    },
  });

  const data = await res.json();

  return data.data || [];
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}) {
  const { schoolId } = await params;

  const rooms = await getRooms(schoolId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">School Rooms</h1>

          <p className="text-slate-500">Manage all classrooms and labs.</p>
        </div>

        <AddRoomModal schoolId={schoolId} />
      </div>

      <RoomTable rooms={rooms} schoolId={schoolId} />
    </div>
  );
}
