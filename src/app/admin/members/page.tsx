"use client";

import { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaTimes,
} from "react-icons/fa";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Member {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  discipline: string;
  batch: string;
  position: string;
  photo?: string;
  status: "Active" | "Inactive";
  social?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
  };
}

export default function Page() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    _id: "",
    fullName: "",
    email: "",
    phone: "",
    discipline: "",
    batch: "",
    position: "",
    photo: "",
    status: "Active",
    social: {
      linkedin: "",
      twitter: "",
      facebook: "",
      instagram: "",
      website: "",
    },
  });

  // Fetch Members
  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members");
      const data = await res.json();
      if (data.success) {
        setMembers(data.data);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to fetch members",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch Members first time
  useEffect(() => {
    fetchMembers();
  }, []);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (
      ["linkedin", "twitter", "facebook", "instagram", "website"].includes(name)
    ) {
      setFormData((prev) => ({
        ...prev,
        social: { ...prev.social, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validation Name, Email, Position and Batch are required validation here
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.position ||
        !formData.batch
      )
        return Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Name, Email, Position and Batch are required",
        });

      if (editingMember) {
        // Update Member
        const res = await fetch("/api/members", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await res.json();
        if (result.success) {
          fetchMembers();
          closeModal();
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: result.message || "Member updated successfully",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: result.message || "Failed to update member",
          });
        }
        setIsModalOpen(false);
        return;
      }
      // Create New Member

      const { _id, ...rest } = formData;
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });

      const result = await res.json();
      if (result.success) {
        fetchMembers();
        closeModal();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: result.message || "Failed to save member",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to save member",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await fetch("/api/members", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });
          const result = await res.json();
          if (result.success) {
            fetchMembers();
          } else {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: result.message || "Failed to delete member",
            });
          }
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to delete member",
      });
    }
  };

  const openModal = (member?: Member) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        _id: member._id,
        fullName: member.fullName,
        email: member.email,
        phone: member.phone,
        discipline: member.discipline,
        batch: member.batch,
        position: member.position,
        photo: member.photo || "",
        status: member.status,
        social: {
          linkedin: member.social?.linkedin || "",
          twitter: member.social?.twitter || "",
          facebook: member.social?.facebook || "",
          instagram: member.social?.instagram || "",
          website: member.social?.website || "",
        },
      });
    } else {
      setEditingMember(null);
      setFormData({
        _id: "",
        fullName: "",
        email: "",
        phone: "",
        discipline: "",
        batch: "",
        position: "",
        photo: "",
        status: "Active",
        social: {
          linkedin: "",
          twitter: "",
          facebook: "",
          instagram: "",
          website: "",
        },
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // Filter
  const filteredMembers = members.filter(
    (m) =>
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.discipline.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 min-h-screen bg-base-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-(--text-primary)">
            Member Management
          </h1>
          <p className="text-(--text-secondary)">
            Total Members: {members.length}
          </p>
        </div>
        <button className="btn btn-primary gap-2" onClick={() => openModal()}>
          <FaPlus /> Add Member
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name, email, discipline..."
          className="input input-bordered w-full pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* List / Table */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="card bg-base-100 shadow-xl border border-base-200"
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton circle width={48} height={48} />
                    <div>
                      <Skeleton width={120} height={20} />
                      <Skeleton width={80} height={16} className="mt-1" />
                    </div>
                  </div>
                  <Skeleton width={60} height={24} borderRadius={12} />
                </div>
                <div className="mt-4 space-y-2">
                  <Skeleton width="80%" height={14} />
                  <Skeleton width="60%" height={14} />
                  <Skeleton width="90%" height={14} />
                </div>
                <div className="card-actions justify-end mt-6">
                  <Skeleton width={32} height={32} />
                  <Skeleton width={32} height={32} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member._id}
              className="card bg-base-100 shadow-xl border border-base-200"
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-12">
                        {member.photo ? (
                          <img src={member.photo} alt={member.fullName} />
                        ) : (
                          <span className="text-xl">
                            {member.fullName.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h2 className="card-title text-lg">{member.fullName}</h2>
                      <p className="text-sm text-(--text-secondary)">
                        {member.position}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`badge ${member.status === "Active" ? "badge-success text-white" : "badge-ghost"}`}
                  >
                    {member.status}
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-(--text-secondary)">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="opacity-70" /> {member.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="opacity-70" /> {member.phone}
                  </div>
                  <div>
                    <span className="font-semibold">Dept:</span>{" "}
                    {member.discipline} |{" "}
                    <span className="font-semibold">Batch:</span> {member.batch}
                  </div>
                </div>

                <div className="card-actions justify-end mt-6">
                  <button
                    className="btn btn-sm btn-ghost text-info"
                    onClick={() => openModal(member)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-ghost text-error"
                    onClick={() => handleDelete(member._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredMembers.length === 0 && !loading && (
            <div className="col-span-full text-center py-10 text-gray-400">
              No members found.
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-base-100 p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {editingMember ? "Edit Member" : "Add New Member"}
              </h3>
              <button
                onClick={closeModal}
                className="btn btn-circle btn-ghost btn-sm"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="form-control">
                <label className="label">Full Name</label>
                <input
                  name="fullName"
                  className="input input-bordered"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">Email</label>
                <input
                  name="email"
                  type="email"
                  className="input input-bordered"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">Phone</label>
                <input
                  name="phone"
                  className="input input-bordered"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">Discipline</label>
                <input
                  name="discipline"
                  className="input input-bordered"
                  value={formData.discipline}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">Batch</label>
                <input
                  name="batch"
                  className="input input-bordered"
                  value={formData.batch}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">Position</label>
                <input
                  name="position"
                  className="input input-bordered"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label">Photo URL</label>
                <input
                  name="photo"
                  className="input input-bordered"
                  value={formData.photo}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>

              <div className="form-control">
                <label className="label">Status</label>
                <select
                  name="status"
                  className="select select-bordered"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="divider md:col-span-2 text-xs font-bold text-gray-400 uppercase">
                Social Links
              </div>

              <div className="form-control">
                <label className="label">LinkedIn</label>
                <input
                  name="linkedin"
                  className="input input-bordered"
                  value={formData.social.linkedin}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control">
                <label className="label">Twitter</label>
                <input
                  name="twitter"
                  className="input input-bordered"
                  value={formData.social.twitter}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control">
                <label className="label">Facebook</label>
                <input
                  name="facebook"
                  className="input input-bordered"
                  value={formData.social.facebook}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control">
                <label className="label">Instagram</label>
                <input
                  name="instagram"
                  className="input input-bordered"
                  value={formData.social.instagram}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control">
                <label className="label">Website</label>
                <input
                  name="website"
                  type="url"
                  className="input input-bordered"
                  value={formData.social.website}
                  onChange={handleInputChange}
                />
              </div>

              <div className="md:col-span-2 mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMember ? "Save Changes" : "Create Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
