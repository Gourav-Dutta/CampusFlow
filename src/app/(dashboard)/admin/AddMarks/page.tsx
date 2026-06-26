"use client";

import { useState } from "react";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

export default async function AddMarksPage() {
  //   const session = await auth.api.getSession({
  //     headers: await headers(),
  //   });

  //   if (!session) redirect("/signIn");

  //   if (session.user.role !== "Admin") {
  //     redirect("/unauthorized");
  //   }
  const [loading, setLoading] = useState(false);

  const [studentId, setStudentId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const [marks, setMarks] = useState("");
  const [grade, setGrade] = useState("");

  const [examType, setExamType] = useState("");
  const [examComponent, setExamComponent] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();

    formData.append("studentId", studentId);
    formData.append("subjectId", subjectId);
    formData.append("school", schoolId);
    formData.append("class", classId);
    formData.append("section", sectionId);

    formData.append("marks", marks);
    formData.append("grade", grade);

    formData.append("examType", examType);
    formData.append("examComponent", examComponent);

    const res = await fetch("/api/marks", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    alert(data.msg || "Marks Added");

    setLoading(false);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-8 text-white">
        <h1 className="text-4xl font-bold">Add Marks</h1>

        <p className="text-indigo-100 mt-2">Examination Management Portal</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Academic */}
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Academic Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4 text-green-400">
            <input
              placeholder="School ID"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              className="border rounded-xl p-3 bg-white"
            />

            <input
              placeholder="Class ID"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="border rounded-xl p-3 bg-white"
            />

            <input
              placeholder="Section ID"
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="border rounded-xl p-3 bg-white"
            />

            <input
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="border rounded-xl p-3 bg-white"
            />

            <input
              placeholder="Subject ID"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="border rounded-xl p-3 bg-white"
            />
          </div>
        </div>

        {/* Exam */}
        <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-orange-700 mb-4">
            Examination
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="border rounded-xl p-3 bg-white"
            >
              <option value="">Select Exam Type</option>
              <option value="Midterm">Midterm</option>
              <option value="Final">Final</option>
              <option value="Quiz">Quiz</option>
              <option value="Assignment">Assignment</option>
            </select>

            <select
              value={examComponent}
              onChange={(e) => setExamComponent(e.target.value)}
              className="border rounded-xl p-3 bg-white"
            >
              <option value="">Select Component</option>
              <option value="Written">Written</option>
              <option value="Oral">Oral</option>
              <option value="Practical">Practical</option>
            </select>
          </div>
        </div>

        {/* Marks */}
        <div className="bg-green-50 border border-green-100 rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-green-700 mb-4">
            Marks Entry
          </h2>

          <div className="grid md:grid-cols-2 gap-4 text-teal-600">
            <input
              type="number"
              placeholder="Marks"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              className="border rounded-xl p-3 bg-white"
            />

            <input
              placeholder="Grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="border rounded-xl p-3 bg-white"
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold"
        >
          {loading ? "Saving..." : "Save Marks"}
        </button>
      </form>
    </div>
  );
}
