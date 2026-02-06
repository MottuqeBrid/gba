"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaPlus,
  FaSearch,
  FaTrash,
  FaEdit,
  FaImage,
  FaTimes,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { formatDistance, subDays } from "date-fns";
import imgbbImageUpload from "@/lib/imgbbImageUpload";

interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  description: string;
  createdAt: string;
}

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    image: "",
    description: "",
  });

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.success) {
        setGalleryItems(data.data);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (item: GalleryItem | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        category: item.category,
        date: item.date ? new Date(item.date).toISOString().split("T")[0] : "", // Format date for input
        image: item.image,
        description: item.description,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: "",
        category: "",
        date: "",
        image: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.image) {
      Swal.fire("Error", "Title and Image URL are required", "error");
      return;
    }

    try {
      let res;
      if (editingItem) {
        // Update
        res = await fetch("/api/gallery", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, _id: editingItem._id }),
        });
      } else {
        // Create
        res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: result.message,
          timer: 1500,
          showConfirmButton: false,
        });
        fetchGallery();
        closeModal();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      Swal.fire("Error", error.message || "Something went wrong", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch("/api/gallery", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const result = await res.json();
        if (result.success) {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          fetchGallery();
        } else {
          Swal.fire("Error!", result.message, "error");
        }
      } catch (error) {
        Swal.fire("Error!", "Failed to delete item.", "error");
      }
    }
  };
  const [itemsPerPage, setItemsPerPage] = useState(12);

  /* Pagination State */
  const [currentPage, setCurrentPage] = useState(1);
  const [imgUploading, setImgUploading] = useState(false);

  const filteredItems = galleryItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentTableData = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleInputImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    oldImg?: string,
  ) => {
    setImgUploading(true);
    const file = e.target.files?.[0];
    if (file) {
      const url = await imgbbImageUpload(file);
      setFormData((prev) => ({ ...prev, image: url }));
    }
    setImgUploading(false);
  };

  return (
    <section className="p-6 md:p-10 space-y-8 bg-base-100 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-(--text-primary)">
            Gallery Management
          </h1>
          <p className="text-(--text-secondary) mt-1">
            Organize and manage your photo collections
          </p>
          <p className="text-(--text-secondary) mt-1">
            Total {filteredItems.length} items found
          </p>
        </div>
        <button className="btn btn-primary gap-2" onClick={() => openModal()}>
          <FaPlus size={16} />
          Upload Photo
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" size={18} />
        </div>
        <input
          type="text"
          placeholder="Search by title or category..."
          className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="text-center py-20">Loading gallery items...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentTableData.map((item) => (
              <div
                key={item._id}
                className="card bg-base-100 border border-base-200 shadow-md hover:shadow-lg transition-all duration-300 group overflow-hidden"
              >
                <figure className="relative h-48 w-full bg-base-200">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.src =
                        "https://placehold.co/400x300?text=No+Image";
                    }}
                  />
                  <div className="absolute top-2 right-2 badge badge-neutral bg-opacity-70 backdrop-blur-md text-white border-none">
                    {item.category}
                  </div>
                </figure>
                <div className="card-body p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      {item.title && (
                        <h2 className="card-title text-lg font-bold text-(--text-primary) line-clamp-1">
                          {item.title}
                        </h2>
                      )}
                      {item.createdAt && (
                        <p className="text-xs text-(--text-secondary) mt-1 flex items-center gap-1">
                          <span className="opacity-70">Date:</span>{" "}
                          {formatDistance(
                            subDays(new Date(item.createdAt), 1),
                            new Date(),
                            { addSuffix: true },
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-sm text-(--text-secondary) mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="card-actions justify-end mt-4 pt-4 border-t border-base-200">
                    <button
                      className="btn btn-sm btn-outline btn-info gap-2"
                      title="Edit Details"
                      onClick={() => openModal(item)}
                    >
                      <FaEdit size={14} />
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-error gap-2"
                      title="Remove Image"
                      onClick={() => handleDelete(item._id)}
                    >
                      <FaTrash size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-base-300 rounded-xl bg-base-200/30">
                <div className="inline-block p-4 rounded-full bg-base-200 mb-4 text-(--text-secondary)">
                  <FaImage size={32} />
                </div>
                <h3 className="text-lg font-medium text-(--text-primary)">
                  No images found
                </h3>
                <p className="text-(--text-secondary) max-w-xs mx-auto mt-1">
                  Try adjusting your search terms or add new images to the
                  gallery.
                </p>
                <button
                  className="btn btn-primary btn-sm mt-4 gap-2"
                  onClick={() => openModal()}
                >
                  <FaPlus size={14} />
                  Add Image
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredItems.length > 0 && (
            <div className="flex justify-center mt-8">
              <div className="join">
                <button
                  className="join-item btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  «
                </button>
                <button className="join-item btn">
                  Page {currentPage} of {totalPages}
                </button>
                <button
                  className="join-item btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="join-item btn"
                >
                  <option value={filteredItems.length}>All in one page</option>
                  <option value="6">6 per page</option>
                  <option value="12">12 per page</option>
                  <option value="24">24 per page</option>
                  <option value="48">48 per page </option>
                  <option value="96">96 per page </option>
                  <option value="192">192 per page </option>
                  <option value="500">500 per page </option>
                </select>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-base-200 flex justify-between items-center sticky top-0 bg-base-100 z-10">
              <h3 className="text-xl font-bold">
                {editingItem ? "Edit Gallery Item" : "Add New Item"}
              </h3>
              <button
                onClick={closeModal}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="form-control">
                <label className="label font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  className="input input-bordered w-full"
                  placeholder="Event Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="form-control">
                  <label className="label font-medium">Category</label>
                  <select
                    name="category"
                    className="select select-bordered w-full"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    <option value="Events">Events</option>
                    <option value="Community Service">Community Service</option>
                    <option value="Culture">Culture</option>
                    <option value="Sports">Sports</option>
                    <option value="Charity">Charity</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* <div className="form-control">
                  <label className="label font-medium">Date</label>
                  <input
                    type="date"
                    name="date"
                    className="input input-bordered w-full"
                    value={formData.date.toString().split("T")[0]}
                    onChange={handleInputChange}
                  />
                </div> */}
              </div>

              <div className="form-control">
                <label className="label font-medium">Image URL</label>
                <input
                  type="file"
                  name="image"
                  className="input input-bordered w-full"
                  placeholder="Upload image"
                  onChange={(e) => handleInputImage(e, editingItem?.image)}
                  required
                />
              </div>

              {formData.image && (
                <div className="form-control">
                  <label className="label font-medium">Image Preview</label>
                  <div className="relative">
                    <Image
                      width={100}
                      height={100}
                      placeholder="blur"
                      blurDataURL={formData.image}
                      src={formData.image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    {imgUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    )}
                    <p className="absolute bottom-0 left-0 right-0 text-sm font-medium text-center pb-4 text-primary mt-2">
                      {imgUploading
                        ? "Uploading..."
                        : "Image uploaded successfully."}
                    </p>
                  </div>
                </div>
              )}

              <div className="form-control">
                <label className="label font-medium">Description</label>
                <textarea
                  name="description"
                  className="textarea textarea-bordered h-24 w-full"
                  placeholder="Describe the event..."
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="modal-action mt-6">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? "Update Item" : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
