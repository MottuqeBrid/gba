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
    fullName: "",
    email: "",
    phone: "",
    discipline: "",
    batch: "",
    position: "",
    photo: "",
    status: "Active",
    social: { linkedin: "", twitter: "", facebook: "", instagram: "" },
  });

  // Fetch Members
  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members");
      console.log(res);
      const data = await res.json();
      console.log(data);
      if (data.success) {
        setMembers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (["linkedin", "twitter", "facebook", "instagram"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        social: { ...prev.social, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validation could go here
      if (!formData.fullName || !formData.email)
        return alert("Name and Email are required");

      // Since the current router structure provided only has GET, POST, DELETE and no specific PUT logic shown fully or ID param handling for updates in snippets,
      // we assume standard REST for now. If editing, we might need to adjust based on actual API capability (e.g., passing ID in body vs URL).
      // Based on previous snippets, only POST (create) and DELETE were explicit. I will assume for Edit we might need to handle it or it's a TBD feature.
      // For now, let's implement Create (POST) and simulated Update logic if API supports it later or just re-create.

      const method = "POST";
      const body = JSON.stringify(formData);

      // NOTE: The previous context showed router.ts having POST for create. It didn't explicitly return PUT.
      // We will stick to Create logic for new and alert for edit until backend is confirmed,
      // OR we can guess/try to send a body with ID for update if the backend handles it.
      // Given the snippets, let's strictly handle CREATE (POST) and DELETE.

      if (editingMember) {
        // If we had an UPDATE endpoint:
        // method = "PUT";
        // body = JSON.stringify({ ...formData, id: editingMember._id });
        alert(
          "Update functionality requires backend implementation. This is a UI demo for Edit.",
        );
        setIsModalOpen(false);
        return;
      }

      const res = await fetch("/api/members", {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      const result = await res.json();
      if (result.success) {
        fetchMembers();
        closeModal();
      } else {
        alert(result.message || "Failed to save member");
      }
    } catch (error) {
      console.error("Error saving member:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      const res = await fetch("/api/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (result.success) {
        fetchMembers();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const openModal = (member?: Member) => {
    if (member) {
      setEditingMember(member);
      setFormData({
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
        },
      });
    } else {
      setEditingMember(null);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        discipline: "",
        batch: "",
        position: "",
        photo: "",
        status: "Active",
        social: { linkedin: "", twitter: "", facebook: "", instagram: "" },
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
        <div className="text-center py-10">Loading members...</div>
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