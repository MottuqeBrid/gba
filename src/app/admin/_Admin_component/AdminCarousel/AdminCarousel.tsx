"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import imgbbImageUpload from "@/lib/imgbbImageUpload";
import Image from "next/image";

interface CarouselItem {
  _id: string;
  image: string;
  title: string;
  description?: string;
  createdAt: string;
}

export default function AdminCarouselPage() {
  const [carousels, setCarousels] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    fetchCarousels();
  }, []);

  const fetchCarousels = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/carousel");
      const data = await res.json();
      if (data.success) {
        setCarousels(data.data);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.error("Error fetching carousels:", error);
      Swal.fire("Error", "Failed to fetch carousels", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "file") {
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
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const openAddModal = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item: CarouselItem) => {
    setFormData({
      title: item.title,
      description: item.description || "",
      image: item.image,
    });
    setCurrentId(item._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.image) {
      Swal.fire("Error", "Title and Image are required", "error");
      return;
    }

    try {
      let url = "/api/carousel";
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
        fetchCarousels();
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.error("Error saving carousel:", error);
      Swal.fire("Error", "Failed to save carousel item", "error");
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
        const res = await fetch("/api/carousel", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: id }),
        });
        const data = await res.json();

        if (data.success) {
          Swal.fire("Deleted!", "Carousel item has been deleted.", "success");
          fetchCarousels();
        } else {
          Swal.fire("Error", data.message, "error");
        }
      } catch (error) {
        console.error("Error deleting carousel:", error);
        Swal.fire("Error", "Failed to delete carousel item", "error");
      }
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-base-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Carousel Management</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FaPlus className="mr-2" /> Add Slide
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
                <th>#</th>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {carousels.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No carousel items found. Add one to get started!
                  </td>
                </tr>
              ) : (
                carousels.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="avatar">
                        <div className="mask mask-squircle w-16 h-16 mx-auto">
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold">{item.title}</td>
                    <td className="max-w-xs truncate">
                      {item.description || "No description"}
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
          <div className="modal-box w-11/12 max-w-lg">
            <h3 className="font-bold text-lg mb-4">
              {isEditing ? "Edit Slide" : "Add New Slide"}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title *</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter slide title"
                  className="input input-bordered w-full"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  className="textarea textarea-bordered h-24 w-full"
                  placeholder="Optional description..."
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Image *</span>
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
                      width={200}
                      height={100}
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
                  {isEditing ? "Update Slide" : "Add Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
