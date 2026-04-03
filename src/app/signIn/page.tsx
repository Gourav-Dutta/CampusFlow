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
    if (role === "Admin"){
      console.log("Redirecting to admin...");
      route.push("/admin");
    } 
    if (role === "Principal") route.push("/principal");
    if (role === "Teacher") route.push("/teacher");
    if (role === "Student") route.push("/student");
    if (role === "Parent") route.push("/parent");
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
    
    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
      Welcome Back 👋
    </h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      
      <div>
        <label className="block text-sm text-gray-600 mb-1">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Login
      </button>
    </form>

    {/* Error / Success Message */}
    {state?.msg && (
      <p className="text-red-500 text-sm mt-4 text-center">
        {state.msg}
      </p>
    )}

    <p className="text-sm text-center text-gray-600 mt-6">
      Don’t have an account?{" "}
      <span className="text-blue-600 cursor-pointer hover:underline">
        Sign up
      </span>
    </p>
  </div>
</div>
  );
}
