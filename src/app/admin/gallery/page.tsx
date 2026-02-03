"use client";

import { useState } from "react";
import Image from "next/image";
import { FaPlus, FaSearch, FaTrash, FaEdit, FaImage } from "react-icons/fa";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");

  // Demo Data for Gallery Items
  const galleryItems = [
    {
      id: 1,
      title: "Annual General Meeting 2024",
      category: "Events",
      date: "2024-01-15",
      imageUrl: "https://picsum.photos/seed/agm2024/400/300",
      description:
        "Highlights from our yearly gathering and community discussions.",
    },
    {
      id: 2,
      title: "Community Clean-up Drive",
      category: "Community Service",
      date: "2024-02-10",
      imageUrl: "https://picsum.photos/seed/cleanup/400/300",
      description:
        "Volunteers gathering to keep our neighborhood clean and green.",
    },
    {
      id: 3,
      title: "Cultural Festival Night",
      category: "Culture",
      date: "2023-11-20",
      imageUrl: "https://picsum.photos/seed/festival/400/300",
      description:
        "A vibrant evening of music, dance, and traditional performances.",
    },
    {
      id: 4,
      title: "Youth Sports Championship",
      category: "Sports",
      date: "2023-12-05",
      imageUrl: "https://picsum.photos/seed/sports/400/300",
      description:
        "Young athletes showcasing their skills in the annual sports meet.",
    },
    {
      id: 5,
      title: "Charity Fundraising Gala",
      category: "Charity",
      date: "2023-10-15",
      imageUrl: "https://picsum.photos/seed/gala/400/300",
      description: "Raising funds for local development projects.",
    },
    {
      id: 6,
      title: "Tech Workshop for Kids",
      category: "Education",
      date: "2024-03-01",
      imageUrl: "https://picsum.photos/seed/workshop/400/300",
      description:
        "Introduction to coding and robotics for the younger generation.",
    },
    {
      id: 7,
      title: "Tech Workshop for Kids",
      category: "Education",
      date: "2024-03-01",
      imageUrl: "https://picsum.photos/seed/workshop/400/300",
      description:
        "Introduction to coding and robotics for the younger generation.",
    },
    {
      id: 8,
      title: "Tech Workshop for Kids",
      category: "Education",
      date: "2024-03-01",
      imageUrl: "https://picsum.photos/seed/workshop/400/300",
      description:
        "Introduction to coding and robotics for the younger generation.",
    },
  ];

  const filteredItems = galleryItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
        </div>
        <button className="btn btn-primary gap-2">
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="card bg-base-100 border border-base-200 shadow-md hover:shadow-lg transition-all duration-300 group overflow-hidden"
          >
            <figure className="relative h-48 w-full bg-base-200">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-2 right-2 badge badge-neutral bg-opacity-70 backdrop-blur-md text-white border-none">
                {item.category}
              </div>
            </figure>
            <div className="card-body p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="card-title text-lg font-bold text-(--text-primary) line-clamp-1">
                    {item.title}
                  </h2>
                  <p className="text-xs text-(--text-secondary) mt-1 flex items-center gap-1">
                    <span className="opacity-70">Date:</span> {item.date}
                  </p>
                </div>
              </div>

              <p className="text-sm text-(--text-secondary) mt-2 line-clamp-2">
                {item.description}
              </p>

              <div className="card-actions justify-end mt-4 pt-4 border-t border-base-200">
                <button
                  className="btn btn-sm btn-outline btn-info gap-2"
                  title="Edit Details"
                >
                  <FaEdit size={14} />
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline btn-error gap-2"
                  title="Remove Image"
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
              Try adjusting your search terms or add new images to the gallery.
            </p>
            <button className="btn btn-primary btn-sm mt-4 gap-2">
              <FaPlus size={14} />
              Add Image
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
