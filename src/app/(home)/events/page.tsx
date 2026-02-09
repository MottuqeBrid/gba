"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaTag,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";
import Link from "next/link";

interface Event {
  _id: string;
  title: string;
  description: string;
  image?: string;
  category?: string;
  status: "upcoming" | "past";
  upcomingEvents: boolean;
  eventDetails?: {
    date?: string;
    time?: string;
    location?: string;
  };
  tags?: string[];
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "past">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Derived Categories
  const categories = [
    "All",
    ...Array.from(new Set(events.map((e) => e.category).filter(Boolean))),
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, activeTab, searchQuery, selectedCategory]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;
    if (activeTab !== "all") {
      filtered = filtered.filter((event) => event.status === activeTab);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (event) => event.category === selectedCategory,
      );
    }

    setFilteredEvents(filtered);
  };

  return (
    <div className="min-h-screen bg-base-100 pb-16">
      {/* Hero Section */}
      <div className="hero bg-base-200 py-12 md:py-20 mb-8">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Events</h1>
            <p className="py-6 text-lg">
              Explore our upcoming conferences, workshops, and community
              gatherings. Join us to learn, connect, and grow.
            </p>

            {/* Search Bar */}
            <div className="flex justify-center w-full max-w-md mx-auto">
              <div className="join w-full shadow-sm">
                <input
                  className="input input-bordered join-item w-full"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-primary join-item">
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        {/* Controls Section: Tabs & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          {/* Status Tabs */}
          <div className="tabs tabs-boxed bg-base-200 p-1 rounded-full">
            <a
              className={`tab tab-lg rounded-full px-8 transition-all duration-300 ${activeTab === "all" ? "tab-active bg-primary text-primary-content shadow-md" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All
            </a>
            <a
              className={`tab tab-lg rounded-full px-8 transition-all duration-300 ${activeTab === "upcoming" ? "tab-active bg-primary text-primary-content shadow-md" : ""}`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming
            </a>
            <a
              className={`tab tab-lg rounded-full px-8 transition-all duration-300 ${activeTab === "past" ? "tab-active bg-neutral text-neutral-content shadow-md" : ""}`}
              onClick={() => setActiveTab("past")}
            >
              Past
            </a>
          </div>

          {/* Category Filter */}
          <div className="form-control w-full md:w-auto">
            <select
              className="select select-bordered w-full md:w-48"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat as string}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="card bg-base-100 shadow-xl h-96 animate-pulse"
              >
                <div className="h-48 bg-base-200 rounded-t-xl mb-4"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-base-200 rounded w-3/4"></div>
                  <div className="h-4 bg-base-200 rounded w-1/2"></div>
                  <div className="h-4 bg-base-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-base-200 rounded-xl">
            <h3 className="text-2xl font-bold opacity-50">No events found</h3>
            <p className="opacity-50 mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group ring-1 ring-base-200"
              >
                <figure className="relative h-56 overflow-hidden">
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={event.title}
                      width={500}
                      height={500}
                      placeholder="blur"
                      blurDataURL={event.image}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-focus flex items-center justify-center text-neutral-content">
                      <span className="text-lg font-bold">No Image</span>
                    </div>
                  )}
                  {/* Category Badge */}
                  {event.category && (
                    <div className="absolute top-4 right-4 badge badge-secondary badge-lg shadow-md font-semibold">
                      {event.category}
                    </div>
                  )}
                  {/* Date Overlay */}
                  {event.eventDetails?.date && (
                    <div className="absolute bottom-0 left-0 bg-base-100 bg-opacity-90 px-4 py-2 rounded-tr-xl flex flex-col items-center shadow-sm">
                      <span className="text-xs font-bold uppercase text-primary tracking-wider">
                        {format(new Date(event.eventDetails.date), "MMM")}
                      </span>
                      <span className="text-2xl font-black leading-none">
                        {format(new Date(event.eventDetails.date), "dd")}
                      </span>
                    </div>
                  )}
                </figure>

                <div className="card-body p-6">
                  <h2 className="card-title text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h2>

                  {/* Meta Details */}
                  <div className="flex flex-col gap-2 text-sm opacity-75 mb-4">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-primary" />
                      <span>{event.eventDetails?.time || "TBA"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-secondary" />
                      <span className="line-clamp-1">
                        {event.eventDetails?.location || "TBA"}
                      </span>
                    </div>
                  </div>

                  <p className="line-clamp-2 text-base-content/80 mb-4 text-sm">
                    {event.description}
                  </p>

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.slice(0, 3).map((tag, idx) => (
                        <div
                          key={idx}
                          className="badge badge-outline badge-sm text-xs opacity-70 flex gap-1 items-center"
                        >
                          <FaTag size={10} /> {tag}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="card-actions justify-end mt-auto">
                    <Link
                      href={`/events/${event._id}`}
                      className="btn btn-primary btn-sm group-hover:btn-active w-full md:w-auto gap-2 hover:gap-3"
                    >
                      View Details <FaArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
