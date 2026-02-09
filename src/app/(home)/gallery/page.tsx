"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaSearch,
  FaArrowRight,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
type GalleryItem = {
  _id: string;
  title: string;
  category: string;
  image: string;
  createdAt: Date;
};

export default function Page() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<
    null | (typeof galleryItems)[0]
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Mock Data
  // const galleryItems = [
  //   {
  //     id: 1,
  //     title: "Annual Annual Meeting",
  //     category: "Events",
  //     date: "Jan 15, 2024",
  //     image: "https://picsum.photos/seed/agm/600/400",
  //   },
  //   {
  //     id: 2,
  //     title: "Community Clean-up",
  //     category: "Community",
  //     date: "Feb 10, 2024",
  //     image: "https://picsum.photos/seed/cleanup/600/400",
  //   },
  //   {
  //     id: 3,
  //     title: "Cultural Night",
  //     category: "Culture",
  //     date: "Nov 20, 2023",
  //     image: "https://picsum.photos/seed/culture/600/400",
  //   },
  //   {
  //     id: 4,
  //     title: "Winter Sports Day",
  //     category: "Sports",
  //     date: "Dec 05, 2023",
  //     image: "https://picsum.photos/seed/sports/600/400",
  //   },
  //   {
  //     id: 5,
  //     title: "Charity Gala",
  //     category: "Charity",
  //     date: "Oct 15, 2023",
  //     image: "https://picsum.photos/seed/gala/600/400",
  //   },
  //   {
  //     id: 6,
  //     title: "Youth Workshop",
  //     category: "Events",
  //     date: "Mar 01, 2024",
  //     image: "https://picsum.photos/seed/workshop/600/400",
  //   },
  //   {
  //     id: 7,
  //     title: "Spring Festival",
  //     category: "Culture",
  //     date: "Apr 12, 2024",
  //     image: "https://picsum.photos/seed/spring/600/400",
  //   },
  //   {
  //     id: 8,
  //     title: "Food Drive",
  //     category: "Community",
  //     date: "Mar 20, 2024",
  //     image: "https://picsum.photos/seed/food/600/400",
  //   },
  //   {
  //     id: 9,
  //     title: "Marathon 2024",
  //     category: "Sports",
  //     date: "May 05, 2024",
  //     image: "https://picsum.photos/seed/marathon/600/400",
  //   },
  //   {
  //     id: 10,
  //     title: "Art Exhibition",
  //     category: "Culture",
  //     date: "Jun 15, 2024",
  //     image: "https://picsum.photos/seed/art/600/400",
  //   },
  //   {
  //     id: 11,
  //     title: "Tech Seminar",
  //     category: "Events",
  //     date: "Jul 01, 2024",
  //     image: "https://picsum.photos/seed/tech/600/400",
  //   },
  //   {
  //     id: 12,
  //     title: "Summer Camp",
  //     category: "Community",
  //     date: "Aug 10, 2024",
  //     image: "https://picsum.photos/seed/summer/600/400",
  //   },
  // ];
  const [searchTerm, setSearchTerm] = useState("");

  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setGalleryItems(data.data);
      const cat = ["All"];
      data.data.forEach((item: GalleryItem) => {
        if (!cat.includes(item.category)) {
          cat.push(item.category);
        }
      });
      setCategories(cat);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Filtering Logic
  const filteredItems = galleryItems.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="bg-base-200 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-(--text-primary) mb-4">
          Our Gallery
        </h1>
        <p className="text-lg text-(--text-secondary) max-w-2xl mx-auto">
          Explore the vibrant moments, events, and activities that define our
          community.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`btn btn-sm md:btn-md rounded-full px-6 transition-all ${
                  activeCategory === cat
                    ? "btn-primary shadow-lg scale-105"
                    : "btn-ghost hover:bg-base-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search gallery..."
              className="input input-bordered w-full pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-base-200 rounded-2xl h-64 animate-pulse"
              ></div>
            ))}
          </div>
        ) : currentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map((item) => (
              <div
                key={item._id}
                className="group relative bg-base-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="aspect-w-4 aspect-h-3 relative h-64 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="eager"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="badge badge-primary mb-2 border-none">
                      {item.category}
                    </span>
                    <h2 className="text-white text-xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {item.title}
                    </h2>
                    <p className="text-gray-300 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {new Date(item.createdAt).toDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">
              No photos found matching your criteria.
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && filteredItems.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-16 gap-4 border-t border-base-200 pt-8">
            <div className="text-sm text-gray-500">
              Showing{" "}
              {Math.min(
                (currentPage - 1) * itemsPerPage + 1,
                filteredItems.length,
              )}{" "}
              - {Math.min(currentPage * itemsPerPage, filteredItems.length)} of{" "}
              {filteredItems.length} items
            </div>

            <div className="join">
              <button
                className="join-item btn btn-outline border-base-300 hover:bg-base-200 hover:border-base-300 disabled:bg-transparent"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <FaChevronLeft size={14} />
              </button>

              {/* Show limited page numbers if too many pages */}
              <button className="join-item btn border-base-300 hover:border-base-300">
                Page {currentPage} of {totalPages}
              </button>

              <button
                className="join-item btn btn-outline border-base-300 hover:bg-base-200 hover:border-base-300 disabled:bg-transparent"
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                <FaChevronRight size={14} />
              </button>
            </div>

            <div className="flex items-center gap-2 w-1/3">
              <div className="text-sm text-gray-500 hidden sm:inline sm:w-1/3">
                Items per page:
              </div>
              <select
                className="select select-bordered select-sm rounded-full sm:w-2/3"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={galleryItems.length}>All</option>
                <option value={6}>6</option>
                <option value={12}>12</option>
                {galleryItems.length > 50 && <option value={24}>24</option>}
                {galleryItems.length > 100 && <option value={48}>48</option>}
                {galleryItems.length > 200 && <option value={96}>96</option>}
                {galleryItems.length > 500 && <option value={192}>192</option>}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors bg-white/10 p-2 rounded-full"
            >
              <FaTimes size={24} />
            </button>

            <div className="relative w-full h-[60vh] md:h-[80vh] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={selectedImage.image}
                alt={selectedImage.title}
                fill
                className="object-contain"
              />
            </div>

            <div className="mt-4 text-center text-white">
              <h3 className="text-2xl font-bold">{selectedImage.title}</h3>
              <p className="text-gray-400 mt-1">
                {selectedImage.createdAt.toDateString()} •{" "}
                {selectedImage.category}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
