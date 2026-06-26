"use client";

import { useEffect, useState } from "react";

export default function StudentDashboard() {
  const [marks, setMarks] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [marksRes, attendanceRes, subjectRes] = await Promise.all([
          fetch("/api/marks"),
          fetch("/api/attendence"),
          fetch("/api/student_subject"),
        ]);

        const marksData = await marksRes.json();
        const attendanceData = await attendanceRes.json();
        const subjectData = await subjectRes.json();

        setMarks(marksData.data || []);
        setAttendance(attendanceData.data || []);
        setSubjects(subjectData.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const presentDays = attendance.filter(
    (a) => a.status?.toLowerCase() === "present",
  ).length;

  const attendancePercentage =
    attendance.length > 0
      ? ((presentDays / attendance.length) * 100).toFixed(1)
      : "0";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-xl font-semibold text-slate-600">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 shadow-xl text-white">
        <h1 className="text-4xl font-bold">Student Dashboard</h1>

        <p className="mt-3 text-blue-100 text-lg">
          Track your attendance, academic performance and enrolled subjects.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg hover:scale-[1.02] transition">
          <p className="text-purple-100">Enrolled Subjects</p>

          <h2 className="mt-2 text-5xl font-bold">{subjects.length}</h2>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg hover:scale-[1.02] transition">
          <p className="text-green-100">Attendance</p>

          <h2 className="mt-2 text-5xl font-bold">{attendancePercentage}%</h2>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-6 text-white shadow-lg hover:scale-[1.02] transition">
          <p className="text-orange-100">Marks Records</p>

          <h2 className="mt-2 text-5xl font-bold">{marks.length}</h2>
        </div>
      </div>

      {/* Subjects */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-5">
          📚 My Subjects
        </h2>

        {subjects.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 shadow">
            No subjects enrolled.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="bg-gradient-to-br from-indigo-50 to-purple-100 border border-indigo-200 rounded-3xl p-6 shadow-md hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold text-indigo-700">
                  {subject.subject?.name}
                </h3>

                <div className="mt-4 space-y-2 text-slate-700">
                  <p>🏫 {subject.school?.name}</p>

                  <p>📖 {subject.classroom?.name}</p>

                  <p>👨‍🎓 {subject.classSection?.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Marks */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-5">
          <h2 className="text-2xl font-bold text-white">📝 Academic Marks</h2>
        </div>

        {marks.length === 0 ? (
          <div className="p-8 text-slate-500">No marks available.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-orange-50">
              <tr>
                <th className="p-4 text-left">Exam</th>
                <th className="p-4 text-left">Subject</th>
                <th className="p-4 text-left">Marks</th>
              </tr>
            </thead>

            <tbody>
              {marks.map((mark) => (
                <tr key={mark.id} className="border-t hover:bg-slate-50">
                  <td className="p-4 text-blue-300">
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                      {mark.exam_name}
                    </span>
                  </td>

                  <td className="p-4 font-medium text-blue-300">
                    {mark.subject_name}
                  </td>

                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                      {mark.marks}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Attendance */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-5">
          <h2 className="text-2xl font-bold text-white">
            ✅ Attendance Record
          </h2>
        </div>

        {attendance.length === 0 ? (
          <div className="p-8 text-slate-500">No attendance records found.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="p-4 text-left">Date</th>

                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((record) => (
                <tr key={record.id} className="border-t hover:bg-slate-50">
                  <td className="p-4">
                    {new Date(record.date).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        record.status?.toLowerCase() === "present"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
