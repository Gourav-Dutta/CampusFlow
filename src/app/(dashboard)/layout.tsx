import Link from "next/link";
import { ReactNode } from "react";
import LogoutButton from "../componenets/LogOutFunction";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#F6F7FB]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-[#6366F1] flex items-center justify-center text-white font-bold">
            CF
          </div>

          <span className="ml-3 font-semibold text-slate-900">Campus Flow</span>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/"
            className="block px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100"
          >
            Dashboard
          </Link>

          <Link
            href="/search"
            className="block px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100"
          >
            Search Schools
          </Link>

          <Link
            href="/profile"
            className="block px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100"
          >
            Profile
          </Link>

          <Link
            href="/settings"
            className="block px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100"
          >
            Settings
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div>
            <h1 className="font-semibold text-slate-900">Campus Flow</h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-xl bg-slate-100">🔔</button>

            <LogoutButton />
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
