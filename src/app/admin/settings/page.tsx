"use client";

import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserGraduate,
  FaCamera,
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaGlobe,
  FaSave,
  FaCheckCircle,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import imgbbImageUpload from "@/lib/imgbbImageUpload";
import { useEffect } from "react";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    discipline: "",
    batch: "",
    photo: "",
    social: {
      facebook: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
  });

  // Sync formData with user once it's available
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        discipline: user.discipline || "",
        batch: user.batch || "",
        photo: user.photo || "",
        social: {
          facebook: user.social?.facebook || "",
          linkedin: user.social?.linkedin || "",
          twitter: user.social?.twitter || "",
          website: user.social?.website || "",
        },
      });
    }
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await imgbbImageUpload(file);
      if (url) {
        setFormData((prev) => ({ ...prev, photo: url }));
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Photo Uploaded!",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      Swal.fire("Error", "Failed to upload image. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          text: "Your settings have been saved successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        refreshUser();
      } else {
        Swal.fire("Error", data.message || "Failed to update profile", "error");
      }
    } catch (error) {
      Swal.fire("Error", "A connection error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-base-200 pb-6">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
            Account Settings
          </h1>
          <p className="text-base-content/60 mt-1">
            Manage your professional profile and social presence
          </p>
        </div>
        <div className="badge badge-primary font-bold px-4 py-3">
          {user.role} Account
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left Column: Profile Picture */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
            <div className="p-6 text-center">
              <div className="relative inline-block group">
                <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
                  {uploading ? (
                    <div className="w-full h-full flex items-center justify-center bg-base-200 animate-pulse">
                      <span className="loading loading-spinner text-primary"></span>
                    </div>
                  ) : (
                    <img
                      src={
                        formData.photo ||
                        `https://ui-avatars.com/api/?name=${formData.fullName}&background=random&size=128`
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 bg-primary text-primary-content p-2.5 rounded-xl shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <FaCamera size={14} />
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <h3 className="mt-4 font-bold text-lg">{formData.fullName}</h3>
              <p className="text-sm text-base-content/50">{user.email}</p>
            </div>
            {/* <div className="bg-base-200/50 p-4 border-t border-base-200">
              <label className="label text-xs font-bold uppercase tracking-wider text-base-content/60">
                Photo URL
              </label>
              <input
                type="text"
                name="photo"
                placeholder="https://imgur.com/your-photo.jpg"
                className="input input-sm input-bordered w-full rounded-lg bg-base-100"
                value={formData.photo}
                onChange={handleChange}
              />
            </div> */}
          </div>

          <div className="alert bg-primary/5 border-primary/20 rounded-2xl">
            <FaCheckCircle className="text-primary" />
            <div className="text-xs">
              <p className="font-bold text-primary">Security Tip</p>
              <p className="opacity-70">
                Use a high-quality professional photo for your GBA profile.
              </p>
            </div>
          </div>
        </div>

        {/* Right Columns: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* General Information */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <FaUser size={14} />
              </span>
              General Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label font-bold text-xs uppercase text-base-content/60">
                  Full Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                  <input
                    name="fullName"
                    className="input input-bordered w-full pl-12 rounded-xl"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label font-bold text-xs uppercase text-base-content/60">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                  <input
                    name="phone"
                    className="input input-bordered w-full pl-12 rounded-xl"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label font-bold text-xs uppercase text-base-content/60">
                  Discipline
                </label>
                <div className="relative">
                  <FaUserGraduate className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                  <input
                    name="discipline"
                    className="input input-bordered w-full pl-12 rounded-xl"
                    value={formData.discipline}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label font-bold text-xs uppercase text-base-content/60">
                  Batch No.
                </label>
                <input
                  name="batch"
                  className="input input-bordered w-full rounded-xl"
                  value={formData.batch}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* Social Links */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-info/10 text-info flex items-center justify-center">
                <FaGlobe size={14} />
              </span>
              Social Presence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <div className="relative">
                  <FaFacebook className="absolute left-4 top-1/2 -translate-y-1/2 text-info" />
                  <input
                    name="social.facebook"
                    placeholder="Facebook Profile URL"
                    className="input input-bordered w-full pl-12 rounded-xl"
                    value={formData.social.facebook}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-control">
                <div className="relative">
                  <FaLinkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0077b5]" />
                  <input
                    name="social.linkedin"
                    placeholder="LinkedIn Profile URL"
                    className="input input-bordered w-full pl-12 rounded-xl"
                    value={formData.social.linkedin}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-control">
                <div className="relative">
                  <FaTwitter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1da1f2]" />
                  <input
                    name="social.twitter"
                    placeholder="Twitter/X Profile URL"
                    className="input input-bordered w-full pl-12 rounded-xl"
                    value={formData.social.twitter}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-control">
                <div className="relative">
                  <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-success" />
                  <input
                    name="social.website"
                    placeholder="Personal Website URL"
                    className="input input-bordered w-full pl-12 rounded-xl"
                    value={formData.social.website}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary px-8 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 h-14"
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <FaSave className="mr-2" /> Save All Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
