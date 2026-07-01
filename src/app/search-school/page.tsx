import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function SearchSchool({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;

  const schools = await prisma.school.findMany({
    where: {
      address: {
        is: {
          city: {
            equals: city,
            mode: "insensitive",
          },
        },
      },
    },
    include: {
      address: true,
      classrooms: true,
      schoolRooms: true,
    },
  });

  if (!schools.length) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
          <h1 className="text-3xl font-bold text-red-500">
            No School Found
          </h1>

          <p className="mt-3 text-slate-500">
            Sorry, we couldn't find any schools in "{city}".
          </p>

          <Link
            href="/"
            className="inline-block mt-8 bg-indigo-600 text-white px-6 py-3 rounded-xl"
          >
            Back to Search
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">

      {/* Header */}

      <div className="bg-gradient-to-r from-indigo-700 to-violet-600 text-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <h1 className="text-4xl font-bold">
            Schools in {city}
          </h1>

          <p className="text-indigo-100 mt-2">
            {schools.length} Result{schools.length > 1 ? "s" : ""} Found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">

        {schools.map((school) => (

          <div
            key={school.id}
            className="bg-white rounded-3xl shadow-lg overflow-hidden"
          >

            {/* School Header */}

            <div className="bg-indigo-600 text-white px-8 py-8">

              <h2 className="text-3xl font-bold">
                {school.name}
              </h2>

              <span className="inline-block mt-3 bg-white/20 px-4 py-1 rounded-full text-sm">
                {school.type.replace("_", " ")}
              </span>

            </div>

            <div className="p-8">

              {/* Address */}

              <div className="bg-slate-50 rounded-2xl p-6 border">

                <h3 className="text-xl font-semibold mb-4">
                  📍 School Address
                </h3>

                <p>{school.address?.address_line_1}</p>

                <p className="mt-1">
                  {school.address?.address_line_2}
                </p>

                <p className="mt-4 font-medium text-indigo-600">
                  {school.address?.city},{" "}
                  {school.address?.state}
                </p>

              </div>

              {/* Stats */}

              <div className="grid md:grid-cols-2 gap-6 mt-8">

                <div className="bg-indigo-50 rounded-2xl p-6 text-center">

                  <p className="text-5xl font-bold text-indigo-700">
                    {school.classrooms.length}
                  </p>

                  <p className="mt-2 text-slate-600">
                    Total Classes
                  </p>

                </div>

                <div className="bg-emerald-50 rounded-2xl p-6 text-center">

                  <p className="text-5xl font-bold text-emerald-700">
                    {school.schoolRooms.length}
                  </p>

                  <p className="mt-2 text-slate-600">
                    School Rooms
                  </p>

                </div>

              </div>

              {/* Classes */}

              <div className="mt-10">

                <h3 className="text-2xl font-semibold mb-5">
                  🎓 Classes Available
                </h3>

                <div className="flex flex-wrap gap-3">

                  {school.classrooms.map((cls) => (

                    <div
                      key={cls.id}
                      className="bg-indigo-100 text-indigo-700 px-5 py-3 rounded-full font-medium"
                    >
                      {cls.name}
                    </div>

                  ))}

                </div>

              </div>

              {/* Rooms */}

              <div className="mt-12">

                <h3 className="text-2xl font-semibold mb-5">
                  🏫 School Rooms
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                  {school.schoolRooms.map((room) => (

                    <div
                      key={room.id}
                      className="border rounded-2xl p-5 hover:shadow-md transition"
                    >

                      <div className="flex justify-between items-center">

                        <h4 className="font-bold text-lg">
                          Room {room.room_no}
                        </h4>

                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                          {room.type}
                        </span>

                      </div>

                      <div className="mt-4 space-y-2 text-slate-600">

                        <p>
                          👥 Capacity :
                          <span className="font-semibold ml-2">
                            {room.capacity}
                          </span>
                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>
    </main>
  );
}