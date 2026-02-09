"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaGoogle,
  FaFacebook,
} from "react-icons/fa";
import Swal from "sweetalert2";

import useAuth from "@/app/hooks/useAuth";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { loginState } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        loginState(data.data);
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: `Welcome back, ${data.data.fullName}!`,
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          // Redirect based on role
          if (data.data.role === "admin") {
            window.location.href = "/admin";
          } else {
            window.location.href = "/";
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid email or password.",
          footer:
            '<a href="/register" class="text-primary font-bold">New here? Create an account</a>',
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "A connection error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 bg-base-200/50">
      <div className="max-w-md w-full space-y-8 bg-base-100 p-8 md:p-12 rounded-3xl shadow-2xl border border-base-200">
        <div className="text-center">
          <h2 className="text-4xl font-black bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
            Welcome Back!
          </h2>
          <p className="mt-2 text-sm text-base-content/60">
            Login to your GBA account to continue
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Address */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Email Address</span>
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-primary/50 group-focus-within:text-primary transition-colors z-10 pointer-events-none">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="admin@gba.org"
                  style={{ paddingLeft: "3rem" }}
                  className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all border-base-300 focus:border-primary"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <div className="flex justify-between items-center mr-1">
                <label className="label">
                  <span className="label-text font-bold">Password</span>
                </label>
                <Link
                  href="#"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-primary/50 group-focus-within:text-primary transition-colors z-10 pointer-events-none">
                  <FaLock />
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="admin123"
                  style={{ paddingLeft: "3rem" }}
                  className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all border-base-300 focus:border-primary"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="form-control">
              <label className="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  style={{
                    paddingBlock: "0",
                    paddingInline: "0",
                  }}
                  className="checkbox checkbox-primary checkbox-xs mr-2"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="text-xs text-base-content/70">
                  Remember me
                </span>
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 h-14 text-lg font-bold"
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  Sign In{" "}
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Social Login Separator */}
          {/* <div className="divider text-xs text-base-content/40 uppercase tracking-widest">
            Or continue with
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="btn btn-outline btn-sm h-12 rounded-xl flex gap-2 font-semibold"
            >
              <FaGoogle className="text-error" /> Google
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm h-12 rounded-xl flex gap-2 font-semibold"
            >
              <FaFacebook className="text-info" /> Facebook
            </button>
          </div> */}
        </form>

        <div className="text-center mt-8">
          <p className="text-base-content/60">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-secondary font-bold hover:underline transition-all"
            >
              Join GBA Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
