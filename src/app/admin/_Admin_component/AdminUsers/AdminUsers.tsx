"use client";

import { useEffect, useState } from "react";
import {
  FaUserShield,
  FaUserEdit,
  FaTrash,
  FaCheckCircle,
  FaUserTimes,
  FaSearch,
  FaUserGraduate,
  FaPlus,
  FaTimes,
  FaLock,
  FaEnvelope,
  FaUser,
  FaPhone,
} from "react-icons/fa";
import Swal from "sweetalert2";

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  discipline: string;
  batch: string;
  role: "admin" | "member";
  status: "pending" | "active" | "suspended";
  verified: boolean;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    discipline: "",
    batch: "",
    password: "",
    role: "member",
    status: "active",
    verified: false,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire(
          "Created!",
          "New user has been created successfully.",
          "success",
        );
        setIsModalOpen(false);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          discipline: "",
          batch: "",
          password: "",
          role: "member",
          status: "active",
          verified: false,
        });
        fetchUsers();
      } else {
        Swal.fire("Error", data.message || "Failed to create user.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "A connection error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRole = async (id: string, newRole: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Change user role to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/admin/users/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire("Updated!", "User role has been updated.", "success");
          fetchUsers();
        }
      } catch (error) {
        Swal.fire("Error", "Failed to update role.", "error");
      }
    }
  };

  const handleToggleVerify = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `User ${!currentStatus ? "Verified" : "Unverified"}`,
          showConfirmButton: false,
          timer: 2000,
        });
        fetchUsers();
      }
    } catch (error) {
      Swal.fire("Error", "Failed to update verification status.", "error");
    }
  };

  const handleDeleteUser = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/admin/users/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire("Deleted!", "User has been deleted.", "success");
          fetchUsers();
        }
      } catch (error) {
        Swal.fire("Error", "Failed to delete user.", "error");
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.discipline.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-6 bg-base-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
            User Management
          </h1>
          <p className="text-base-content/60 mt-1">
            Found {users.length} registered members
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/40">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search users..."
              className="input input-bordered w-full pl-10 rounded-xl bg-base-200/50 focus:bg-base-100 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary rounded-xl shadow-lg shadow-primary/20 gap-2"
          >
            <FaPlus /> Create User
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-3xl shadow-xl border border-base-200">
          <table className="table table-zebra w-full text-base">
            <thead className="bg-base-200 text-base-content/70 uppercase text-xs tracking-wider">
              <tr>
                <th className="py-4 px-6 rounded-tl-3xl">User Info</th>
                <th className="py-4 px-6">Discipline/Batch</th>
                <th className="py-4 px-6 text-center">Role</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right rounded-tr-3xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-primary/5 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center font-bold">
                            {user.fullName.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold flex items-center gap-2">
                            {user.fullName}
                            {user.verified && (
                              <FaCheckCircle
                                className="text-primary text-xs"
                                title="Verified Member"
                              />
                            )}
                          </div>
                          <div className="text-xs opacity-60">{user.email}</div>
                          <div className="text-xs opacity-60">{user.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-2 text-sm">
                          <FaUserGraduate className="text-primary/70" />{" "}
                          {user.discipline}
                        </span>
                        <span className="badge badge-outline badge-sm">
                          Batch {user.batch}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`badge font-bold py-3 ${user.role === "admin" ? "badge-primary" : "badge-ghost"}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`badge py-3 ${user.status === "active" ? "badge-success" : "badge-warning"} badge-sm text-white`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 shrink-0">
                        <button
                          onClick={() =>
                            handleToggleVerify(user._id, user.verified)
                          }
                          className={`btn btn-sm btn-circle ${user.verified ? "btn-ghost text-error" : "btn-success text-white"}`}
                          title={
                            user.verified
                              ? "Remove Verification"
                              : "Verify User"
                          }
                        >
                          {user.verified ? <FaUserTimes /> : <FaCheckCircle />}
                        </button>

                        <button
                          onClick={() =>
                            handleUpdateRole(
                              user._id,
                              user.role === "admin" ? "member" : "admin",
                            )
                          }
                          className="btn btn-sm btn-circle btn-primary shadow-lg shadow-primary/20"
                          title={
                            user.role === "admin" ? "Make Member" : "Make Admin"
                          }
                        >
                          <FaUserShield />
                        </button>

                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="btn btn-sm btn-circle btn-error text-white shadow-lg shadow-error/20"
                          title="Delete User"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-20 text-base-content/40 font-medium"
                  >
                    No users found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-base-100 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-base-200 animate-in fade-in zoom-in duration-200">
            <div className="bg-primary p-6 text-primary-content flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black">Create User</h3>
                <p className="text-primary-content/70 text-sm">
                  Add a new member to the association manually
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost btn-circle text-primary-content hover:bg-black/10"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form
              onSubmit={handleCreateUser}
              className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto"
            >
              {/* Full Name */}
              <div className="form-control">
                <label className="label font-bold text-sm">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="John Doe"
                    className="input input-bordered w-full pl-12 rounded-xl"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label font-bold text-sm">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    className="input input-bordered w-full pl-12 rounded-xl"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label font-bold text-sm">
                  Initial Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-12 rounded-xl"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="form-control">
                <label className="label font-bold text-sm">Phone Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+880 1XXX-XXXXXX"
                    className="input input-bordered w-full pl-12 rounded-xl"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Discipline */}
              <div className="form-control">
                <label className="label font-bold text-sm">Discipline</label>
                <div className="relative">
                  <FaUserGraduate className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                  <input
                    type="text"
                    name="discipline"
                    placeholder="Computer Science"
                    className="input input-bordered w-full pl-12 rounded-xl"
                    value={formData.discipline}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Batch */}
              <div className="form-control">
                <label className="label font-bold text-sm">Batch No.</label>
                <input
                  type="text"
                  name="batch"
                  placeholder="20"
                  className="input input-bordered w-full rounded-xl"
                  value={formData.batch}
                  onChange={handleInputChange}
                />
              </div>

              {/* Role & Status */}
              <div className="form-control">
                <label className="label font-bold text-sm">Access Role</label>
                <select
                  name="role"
                  className="select select-bordered w-full rounded-xl"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="member">Regular Member</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label font-bold text-sm">
                  Account Status
                </label>
                <select
                  name="status"
                  className="select select-bordered w-full rounded-xl"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending Approval</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {/* Verification Toggle */}
              <div className="form-control md:col-span-2 bg-base-200 p-4 rounded-2xl flex-row items-center justify-between">
                <div>
                  <label className="label-text font-bold block">
                    Verified Member
                  </label>
                  <span className="text-xs text-base-content/60">
                    Mark this user as an officially verified member of GBA
                  </span>
                </div>
                <input
                  type="checkbox"
                  name="verified"
                  className="toggle toggle-success toggle-lg"
                  checked={formData.verified}
                  onChange={handleInputChange}
                />
              </div>

              <div className="md:col-span-2 pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost flex-1 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary flex-1 rounded-xl shadow-lg shadow-primary/25"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Create User Profile"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
