"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus, FaStar } from "react-icons/fa";
import imgbbImageUpload from "@/lib/imgbbImageUpload";
import Image from "next/image";

interface Message {
  _id: string;
  title: string;
  message: string;
  image?: string;
  role: string;
  personName?: string;
  isFeatured: boolean;
  order: number;
  createdAt: string;
}

const roleOptions = [
  { value: "advisor", label: "Advisor" },
  { value: "president", label: "President" },
  { value: "vice-president", label: "Vice President" },
  { value: "secretary", label: "Secretary" },
  { value: "treasurer", label: "Treasurer" },
  { value: "other", label: "Other" },
];

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    image: "",
    role: "other",
    personName: "",
    isFeatured: false,
    order: 0,
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      Swal.fire("Error", "Failed to fetch messages", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setUploading(true);
        try {
          const url = await imgbbImageUpload(file);
          if (url) {
            setFormData((prev) => ({ ...prev, [name]: url }));
          }
        } catch (error) {
          console.error("Upload failed:", error);
          Swal.fire("Error", "Image upload failed", "error");
        } finally {
          setUploading(false);
        }
      }
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const openAddModal = () => {
    setFormData({
      title: "",
      message: "",
      image: "",
      role: "other",
      personName: "",
      isFeatured: false,
      order: messages.length,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Message) => {
    setFormData({
      title: item.title,
      message: item.message,
      image: item.image || "",
      role: item.role,
      personName: item.personName || "",
      isFeatured: item.isFeatured,
      order: item.order,
    });
    setCurrentId(item._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.message) {
      Swal.fire("Error", "Title and Message are required", "error");
      return;
    }

    try {
      let url = "/api/messages";
      let method = "POST";
      let body = JSON.stringify(formData);

      if (isEditing && currentId) {
        method = "PATCH";
        body = JSON.stringify({ ...formData, _id: currentId });
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("Success", data.message, "success");
        setIsModalOpen(false);
        fetchMessages();
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.error("Error saving message:", error);
      Swal.fire("Error", "Failed to save message", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch("/api/messages", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: id }),
        });
        const data = await res.json();

        if (data.success) {
          Swal.fire("Deleted!", "Message has been deleted.", "success");
          fetchMessages();
        } else {
          Swal.fire("Error", data.message, "error");
        }
      } catch (error) {
        console.error("Error deleting message:", error);
        Swal.fire("Error", "Failed to delete message", "error");
      }
    }
  };

  const getRoleLabel = (role: string) => {
    return roleOptions.find((r) => r.value === role)?.label || role;
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-base-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Messages Management</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FaPlus className="mr-2" /> Add Message
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow-xl">
          <table className="table table-zebra w-full text-center">
            <thead>
              <tr>
                <th>Order</th>
                <th>Image</th>
                <th>Title</th>
                <th>Person</th>
                <th>Role</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No messages found. Add one to get started!
                  </td>
                </tr>
              ) : (
                messages.map((item) => (
                  <tr key={item._id}>
                    <td>{item.order}</td>
                    <td>
                      <div className="avatar">
                        <div className="mask mask-squircle w-16 h-16 mx-auto">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-base-300 flex items-center justify-center text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold max-w-xs truncate">
                      {item.title}
                    </td>
                    <td>{item.personName || "-"}</td>
                    <td>
                      <span className="badge badge-outline badge-sm">
                        {getRoleLabel(item.role)}
                      </span>
                    </td>
                    <td>
                      {item.isFeatured && (
                        <FaStar className="text-warning mx-auto" />
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2 items-center justify-center">
                        <button
                          className="btn btn-sm btn-ghost text-info"
                          onClick={() => openEditModal(item)}
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          className="btn btn-sm btn-ghost text-error"
                          onClick={() => handleDelete(item._id)}
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-4">
              {isEditing ? "Edit Message" : "Add New Message"}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Title *</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Message from President"
                    className="input input-bordered w-full"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Person Name</span>
                  </label>
                  <input
                    type="text"
                    name="personName"
                    placeholder="e.g. John Doe"
                    className="input input-bordered w-full"
                    value={formData.personName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Role</span>
                  </label>
                  <select
                    name="role"
                    className="select select-bordered w-full"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Order</span>
                  </label>
                  <input
                    type="number"
                    name="order"
                    className="input input-bordered w-full"
                    value={formData.order}
                    onChange={handleInputChange}
                    min={0}
                  />
                </div>

                <div className="form-control">
                  <label className="cursor-pointer label flex-col items-start gap-2">
                    <span className="label-text">Featured</span>
                    <input
                      style={{
                        paddingInline: "0",
                      }}
                      type="checkbox"
                      name="isFeatured"
                      className="toggle toggle-warning"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Message *</span>
                </label>
                <textarea
                  name="message"
                  className="textarea textarea-bordered h-32 w-full"
                  placeholder="Write the message content..."
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Image</span>
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={handleInputChange}
                />
                {uploading && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-primary">
                    <span className="loading loading-spinner loading-xs"></span>
                    Uploading...
                  </div>
                )}
                {formData.image && !uploading && (
                  <div className="mt-2">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      width={150}
                      height={150}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploading}
                >
                  {isEditing ? "Update Message" : "Add Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
