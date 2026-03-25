"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Calls the NextAuth API we built earlier
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // We handle the redirect manually below
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Login successful!");
      router.push("/admin"); // Send them straight to the dashboard
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-xl max-w-md w-full">
        <h3 className="text-2xl font-bold text-center">Login to your account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            
            {/* Email Input */}
            <div>
              <label className="block" htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {/* Password Input & Forgot Password Link */}
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <label className="block">Password</label>
                {/* --- NEW FORGOT PASSWORD LINK --- */}
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
                {/* -------------------------------- */}
              </div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {/* Submit Button */}
            <div className="flex items-baseline justify-between">
              <button className="px-6 py-2 mt-4 text-white bg-black rounded-lg hover:bg-gray-800 w-full transition-colors">
                Login
              </button>
            </div>
            
          </div>
        </form>
      </div>
      
      {/* Registration Link */}
      <div>
        <p className="mt-4 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
                Sign up here
            </Link>
        </p>
      </div>
    </div>
  );
}