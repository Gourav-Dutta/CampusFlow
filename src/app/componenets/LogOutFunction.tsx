"use client";

export default function LogoutButton() {
  async function handleLogout() {
    const res = await fetch("/api/auth/sign-out", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({}),
    });
    if (res.ok) {
      window.location.href = "/signIn";
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded-lg"
    >
      Logout
    </button>
  );
}
