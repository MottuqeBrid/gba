"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaGraduationCap,
  FaCalendarAlt,
  FaArrowRight,
  FaImage,
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    discipline: "",
    batch: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match!",
      });
      return;
    }

    if (!formData.termsAccepted) {
      Swal.fire({
        icon: "warning",
        title: "Terms & Conditions",
        text: "Please accept our terms and conditions to proceed.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: "Welcome to Greater Bogura Association. Please login to continue.",
          confirmButtonText: "Go to Login",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/login";
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: data.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "A connection error occurred. Please check your internet and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 bg-base-200/50">
      <div className="max-w-2xl w-full space-y-8 bg-base-100 p-8 md:p-12 rounded-3xl shadow-2xl border border-base-200">
        <div className="text-center">
          <h2 className="text-4xl font-black bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
            Join the Community
          </h2>
          <p className="mt-2 text-sm text-base-content/60">
            Create your account to connect with GBA members
          </p>
        </div>

        <form className="mt-8 space-y-6 padding-inline" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Full Name</span>
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-primary/50 group-focus-within:text-primary transition-colors z-10 pointer-events-none">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="John Doe"
                  style={{ paddingLeft: "3rem" }}
                  className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all border-base-300 focus:border-primary"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

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
                  placeholder="john@example.com"
                  style={{ paddingLeft: "3rem" }}
                  className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all border-base-300 focus:border-primary"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Phone Number</span>
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-primary/50 group-focus-within:text-primary transition-colors z-10 pointer-events-none">
                  <FaPhone />
                </span>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+880 1XXX-XXXXXX"
                  style={{ paddingLeft: "3rem" }}
                  className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all border-base-300 focus:border-primary"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Discipline/Subject */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Discipline</span>
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-primary/50 group-focus-within:text-primary transition-colors z-10 pointer-events-none">
                  <FaGraduationCap />
                </span>
                <input
                  type="text"
                  name="discipline"
                  required
                  placeholder="Computer Science"
                  style={{ paddingLeft: "3rem" }}
                  className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all border-base-300 focus:border-primary"
                  value={formData.discipline}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Batch */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Batch</span>
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-primary/50 group-focus-within:text-primary transition-colors z-10 pointer-events-none">
                  <FaCalendarAlt />
                </span>
                <input
                  type="text"
                  name="batch"
                  required
                  placeholder="20"
                  style={{ paddingLeft: "3rem" }}
                  className="input  input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all border-base-300 focus:border-primary"
                  value={formData.batch}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Photo Placeholder Note */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Profile Photo</span>
              </label>
              <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg text-xs text-primary/80">
                <FaImage className="text-xl shrink-0" />
                <p>
                  You can upload your profile photo from your dashboard after
                  registration.
                </p>
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Password</span>
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-primary/50 group-focus-within:text-primary transition-colors z-10 pointer-events-none">
                  <FaLock />
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  style={{ paddingLeft: "3rem" }}
                  className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all border-base-300 focus:border-primary"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Confirm Password</span>
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-primary/50 group-focus-within:text-primary transition-colors z-10 pointer-events-none">
                  <FaLock />
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  style={{ paddingLeft: "3rem" }}
                  className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all border-base-300 focus:border-primary"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              style={{
                paddingBlock: "0",
                paddingInline: "0",
              }}
              type="checkbox"
              name="termsAccepted"
              id="terms"
              className="checkbox checkbox-primary checkbox-sm mr-3"
              checked={formData.termsAccepted}
              onChange={handleChange}
            />
            <label
              htmlFor="terms"
              className="text-sm text-base-content/70 cursor-pointer select-none"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-primary hover:underline font-bold"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-primary hover:underline font-bold"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 h-14"
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  Create Account{" "}
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-base-content/60">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-secondary font-bold hover:underline transition-all"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
