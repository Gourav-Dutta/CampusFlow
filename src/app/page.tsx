"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [city, setCity] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const router = useRouter();
  const handleSearch = async () => {
    const res = await fetch(`${baseUrl}/api/city-school/${encodeURIComponent(city)}`);
     if (!res.ok) {
    router.push("/search-school?city=" + encodeURIComponent(city));
    return;
  }

  const data = await res.json();

  if (data.length > 0) {
    router.push("/search-school?city=" + encodeURIComponent(city));
  } else {
    router.push("/search-school?city=" + encodeURIComponent(city));
  }

    console.log(data);

  }
  return (
    <main className="min-h-screen bg-[#F6F7FB] font-sans text-slate-900">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-md bg-[#FAFAFA]/90 border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#534AB7] flex items-center justify-center">
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth="1.8"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="text-lg font-medium">Campus Flow</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            Browse schools
          </button>
          <Link href="/signIn">
            <button className="px-4 py-1.5 text-sm bg-[#534AB7] text-white rounded-lg hover:opacity-90 transition">
              Sign in
            </button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center text-center px-8 pt-20 pb-16 gap-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
          ✦ School management, reimagined
        </div>
        <h1 className="text-5xl font-semibold leading-tight max-w-2xl text-slate-900">
          One platform for every <span className="text-[#534AB7]">campus</span>
        </h1>
        <p className="text-gray-500 max-w-md leading-relaxed">
          Manage schools, students, marks, and attendance — all in one place.
          Built for admins, principals, teachers, and students.
        </p>

        {/* Search */}
        <div className="w-full max-w-lg">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm focus-within:border-[#6366F1] focus-within:ring-4 focus-within:ring-indigo-100 transition">
            <span className="pl-4 text-gray-400">
              <svg
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Enter Your Preferred City..."
              className="flex-1 px-3 py-3 text-sm outline-none bg-transparent"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button className="m-1.5 px-4 py-1.5 bg-[#534AB7] text-white text-sm rounded-lg hover:opacity-90 transition" onClick={()=> handleSearch()}>
              Search
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8">
          {[
            ["120+", "Schools"],
            ["8,400+", "Students"],
            ["620+", "Teachers"],
          ].map(([num, lbl], i) => (
            <div key={i} className="flex items-center gap-8">
              {i > 0 && <div className="w-px h-8 bg-gray-100" />}
              <div className="text-center">
                <div className="text-xl font-medium">{num}</div>
                <div className="text-xs text-gray-400 mt-0.5">{lbl}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section className="px-8 pb-12 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            bg: "#EEEDFE",
            ic: "#534AB7",
            title: "Marks management",
            desc: "Draft → submit → publish with HQ approval",
          },
          {
            bg: "#E1F5EE",
            ic: "#0F6E56",
            title: "Attendance tracking",
            desc: "Bulk entry per subject, class, and section",
          },
          {
            bg: "#FAEEDA",
            ic: "#854F0B",
            title: "Multi-school support",
            desc: "Secondary and higher secondary under one roof",
          },
          {
            bg: "#FAECE7",
            ic: "#993C1D",
            title: "Role-based access",
            desc: "Admin, principal, teacher, student portals",
          },
        ].map(({ bg, ic, title, desc }) => (
          <div
            key={title}
            className="p-5 rounded-xl border border-gray-100 bg-white"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={{ background: bg }}
            >
              <div className="w-4 h-4 rounded" style={{ background: ic }} />
            </div>
            <p className="text-sm font-medium mb-1">{title}</p>
            <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 px-8 py-5 flex justify-between text-xs text-gray-400">
        <span>© 2026 Campus Flow</span>
      </footer>
    </main>
  );
}
