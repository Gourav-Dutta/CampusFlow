"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [state, setState] = useState<{ status: string; msg: any } | null>(null);
  const route = useRouter();
  console.log(state);

  // const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   const result = await SignInAction(formData);
  //   // const result = await fetch("/api/auth/sign-in/email",{
  //   //   method: "POST",
  //   //   body: formData
  //   // })
  //   const data = result;
  //   // setState(data?.msg ? { status: data.msg === "success" ? "Success" : "Fail", msg: data.msg } : { status: "Fail", msg: "Login failed" });
  //   // setState(result);
  //   console.log("Result: ", data);
  // };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      email: (form.email as HTMLInputElement).value,
      password: (form.password as HTMLInputElement).value,
    };
    console.log("Form-Data: ", data);
    const result = await fetch("/api/auth/sign-in/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const resData = await result.json();
    console.log("Parsed response: ", resData);
    console.log("Result object: ", result);
    if (!result.ok) {
      setState({ status: "Fail", msg: resData.message || "Login Failed" });
      console.log("Loginfailed");
      return;
    }
    // setState({status: "Success", msg: })
    const role = resData?.user?.role;
    console.log("Role: ", role);
    console.log("Routing based on role...");
    // if (role === "Admin"){
    //   console.log("Redirecting to admin...");
    //   route.push("/admin");
    // }
    // if (role === "Principal") route.push("/principal");
    // if (role === "Teacher") route.push("/teacher");
    // if (role === "Student") route.push("/student");
    // if (role === "Parent") route.push("/parent");

    switch (role) {
      case "Admin":
        route.push("/admin");
        break;
      case "Principal":
        // const schoolRes = await fetch("/api/principle/school", {
        //   credentials: "include",
        // });
        // const schoolData = await schoolRes.json();
        // console.log("school data: ", schoolData);
        //  route.push(
        //   schoolData?.id
        //     ? `/school/${schoolData.school_id}/dashboard`
        //     : "/no-school-assigned"
        // );
        route.push("/principle");
        break;
      case "teacher":
        route.push("/teacher/dashboard");

        break;
      case "Student":
        route.push("/student");
        break;
      case "Parent":
        route.push("/parent/dashboard");
        break;
      default:
        route.push("/");
    }
  };

  //   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const form = event.currentTarget;

  //   const result = await fetch("/api/auth/sign-in/email", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       email: (form.email as HTMLInputElement).value,
  //       password: (form.password as HTMLInputElement).value,
  //     }),
  //     credentials: "include",
  //   });

  //   const resData = await result.json();

  //   if (!result.ok) {
  //     setState({ status: "Fail", msg: resData.message || "Login Failed" });
  //     return;
  //   }

  //   const role = resData?.user?.role;

  //   switch (role) {
  //     case "Admin":
  //       route.push("/admin");
  //       break;
  //     case "Principal": {
  //       // Fetch school separately after login (session cookie is now set)
  //       const schoolRes = await fetch("/api/principal/school", {
  //         credentials: "include", // sends the session cookie
  //       });
  //       const schoolData = await schoolRes.json();
  //       route.push(
  //         schoolData?.id
  //           ? `/school/${schoolData.id}/dashboard`
  //           : "/no-school-assigned"
  //       );
  //       break;
  //     }
  //     case "Teacher":
  //       route.push("/teacher/dashboard");
  //       break;
  //     case "Student":
  //       route.push("/student/dashboard");
  //       break;
  //     case "Parent":
  //       route.push("/parent/dashboard");
  //       break;
  //     default:
  //       route.push("/");
  //   }
  // };

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center px-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden grid md:grid-cols-2">
        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center bg-[#6366F1] text-white p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              🏫
            </div>

            <span className="text-xl font-semibold">Campus Flow</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight mb-4">
            Welcome Back
          </h1>

          <p className="text-indigo-100 leading-relaxed">
            Manage schools, students, attendance and examinations from one
            platform.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <span>✓</span>
              <span>Student Management</span>
            </div>

            <div className="flex items-center gap-3">
              <span>✓</span>
              <span>Attendance Tracking</span>
            </div>

            <div className="flex items-center gap-3">
              <span>✓</span>
              <span>Result Publishing</span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-10 md:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-slate-900">Sign In</h2>

            <p className="text-slate-500 mt-2">
              Enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-[#6366F1]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-[#6366F1]"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" />
                Remember me
              </label>

              <button type="button" className="text-[#6366F1] hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#6366F1] text-white py-3 rounded-xl font-medium hover:bg-[#4F46E5] transition"
            >
              Sign In
            </button>
          </form>

          {state?.msg && (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {state.msg}
            </div>
          )}

          <p className="text-center text-sm text-slate-500 mt-8">
            Need help? Contact your school administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
