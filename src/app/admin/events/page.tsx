"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { format } from "date-fns";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMinus,
  FaCheck,
} from "react-icons/fa";
import imgbbImageUpload from "@/lib/imgbbImageUpload";
import Image from "next/image";

interface Guest {
  name: string;
  image: string;
  description: string;
}

interface AgendaItem {
  title: string;
  description: string;
  time: string;
}

interface Event {
  _id: string;

  // Basic Info
  title: string;
  description: string;
  image?: string;
  category?: string;
  status: "upcoming" | "past";
  upcomingEvents: boolean;
  about?: string;
  tags?: string[];

  // Details
  eventDetails?: {
    date?: string;
    time?: string;
    location?: string;
  };

  // Contact
  contactDetails?: {
    phone?: string;
    email?: string;
    address?: string;
  };

  // Guests
  guest?: {
    chiefGuest?: Guest;
    specialGuest?: Guest;
    chairperson?: Guest;
  };

  // Agenda
  eventAgenda?: AgendaItem[];

  addedBy?: string;
  createdAt: string;
}

export default function EventsAdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);

  // Initial Form State
  const initialFormState = {
    title: "",
    description: "",
    image: "",
    category: "",
    status: "upcoming",
    upcomingEvents: false,
    about: "",
    tags: "", // Managing as comma-separated string in UI

    // Details
    date: "",
    time: "",
    location: "",

    // Contact
    contactPhone: "",
    contactEmail: "",
    contactAddress: "",

    // Guests - Chief
    chiefGuestName: "",
    chiefGuestImage: "",
    chiefGuestDesc: "",

    // Guests - Special
    specialGuestName: "",
    specialGuestImage: "",
    specialGuestDesc: "",

    // Guests - Chairperson
    chairpersonName: "",
    chairpersonImage: "",
    chairpersonDesc: "",

    // Agenda
    eventAgenda: [] as AgendaItem[],
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      Swal.fire("Error", "Failed to fetch events", "error");
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
        const url = await imgbbImageUpload(file);
        if (url) {
          setFormData((prev) => ({ ...prev, [name]: url }));
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Agenda Handling
  const addAgendaItem = () => {
    setFormData((prev) => ({
      ...prev,
      eventAgenda: [
        ...prev.eventAgenda,
        { title: "", description: "", time: "" },
      ],
    }));
  };

  const removeAgendaItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      eventAgenda: prev.eventAgenda.filter((_, i) => i !== index),
    }));
  };

  const updateAgendaItem = (
    index: number,
    field: keyof AgendaItem,
    value: string,
  ) => {
    const newAgenda = [...formData.eventAgenda];
    newAgenda[index] = { ...newAgenda[index], [field]: value };
    setFormData((prev) => ({ ...prev, eventAgenda: newAgenda }));
  };

  const openAddModal = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (event: Event) => {
    setFormData({
      title: event.title,
      description: event.description,
      image: event.image || "",
      category: event.category || "",
      status: event.status as string,
      upcomingEvents: event.upcomingEvents || false,
      about: event.about || "",
      tags: event.tags ? event.tags.join(", ") : "",

      date: event.eventDetails?.date
        ? new Date(event.eventDetails.date).toISOString().split("T")[0]
        : "",
      time: event.eventDetails?.time || "",
      location: event.eventDetails?.location || "",

      contactPhone: event.contactDetails?.phone || "",
      contactEmail: event.contactDetails?.email || "",
      contactAddress: event.contactDetails?.address || "",

      chiefGuestName: event.guest?.chiefGuest?.name || "",
      chiefGuestImage: event.guest?.chiefGuest?.image || "",
      chiefGuestDesc: event.guest?.chiefGuest?.description || "",

      specialGuestName: event.guest?.specialGuest?.name || "",
      specialGuestImage: event.guest?.specialGuest?.image || "",
      specialGuestDesc: event.guest?.specialGuest?.description || "",

      chairpersonName: event.guest?.chairperson?.name || "",
      chairpersonImage: event.guest?.chairperson?.image || "",
      chairpersonDesc: event.guest?.chairperson?.description || "",

      eventAgenda: event.eventAgenda || [],
    });
    setCurrentEventId(event._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      description: formData.description,
      image: formData.image,
      category: formData.category,
      status: formData.status,
      upcomingEvents: formData.upcomingEvents,
      about: formData.about,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),

      eventDetails: {
        date: formData.date,
        time: formData.time,
        location: formData.location,
      },

      contactDetails: {
        phone: formData.contactPhone,
        email: formData.contactEmail,
        address: formData.contactAddress,
      },

      guest: {
        chiefGuest: {
          name: formData.chiefGuestName,
          image: formData.chiefGuestImage,
          description: formData.chiefGuestDesc,
        },
        specialGuest: {
          name: formData.specialGuestName,
          image: formData.specialGuestImage,
          description: formData.specialGuestDesc,
        },
        chairperson: {
          name: formData.chairpersonName,
          image: formData.chairpersonImage,
          description: formData.chairpersonDesc,
        },
      },

      eventAgenda: formData.eventAgenda,
    };

    try {
      let url = "/api/events";
      let method = "POST";
      let body = JSON.stringify(payload);

      if (isEditing && currentEventId) {
        method = "PATCH";
        body = JSON.stringify({ ...payload, _id: currentEventId });
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
        fetchEvents();
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      Swal.fire("Error", "Failed to save event", "error");
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
        const res = await fetch("/api/events", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: id }),
        });
        const data = await res.json();

        if (data.success) {
          Swal.fire("Deleted!", "Your event has been deleted.", "success");
          fetchEvents();
        } else {
          Swal.fire("Error", data.message, "error");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        Swal.fire("Error", "Failed to delete event", "error");
      }
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-base-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Event Management</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FaPlus className="mr-2" /> Add Event
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
                <th>Image</th>
                <th>Title</th>
                <th>Date & Time</th>
                <th>Location</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No events found. Create one to get started!
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event._id}>
                    <td>
                      <div className="avatar text-center">
                        <div className="mask mask-squircle w-12 h-12 text-center mx-auto">
                          {event.image ? (
                            <img src={event.image} alt={event.title} />
                          ) : (
                            <div className="bg-neutral-focus text-neutral-content w-full h-full flex items-center justify-center">
                              <span>No Img</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold">{event.title}</td>
                    <td>
                      <div className="flex flex-col items-center gap-1 text-sm">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="text-primary" />
                          {event.eventDetails?.date
                            ? format(
                                new Date(event.eventDetails.date),
                                "MMM dd, yyyy",
                              )
                            : "N/A"}
                        </div>
                        <span className="text-xs opacity-70">
                          {event.eventDetails?.time || "Time not set"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <FaMapMarkerAlt className="text-secondary" />
                        {event.eventDetails?.location || "N/A"}
                      </div>
                    </td>
                    <td>
                      <div
                        className={`badge ${
                          event.status === "upcoming"
                            ? "badge-success"
                            : "badge-ghost"
                        } badge-sm`}
                      >
                        {event.status}
                      </div>
                    </td>
                    <td>
                      {event.upcomingEvents && (
                        <span className="badge badge-accent badge-sm">
                          Featured
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2 items-center justify-center">
                        <button
                          className="btn btn-sm btn-ghost text-info"
                          onClick={() => openEditModal(event)}
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          className="btn btn-sm btn-ghost text-error"
                          onClick={() => handleDelete(event._id)}
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

      {/* Modal - Expanded for Full Schema */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-2xl mb-6">
              {isEditing ? "Edit Event" : "Create New Event"}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Section 1: Basic Info */}
              <div className="bg-base-200 p-4 rounded-box">
                <h4 className="font-bold mb-2">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Event Title*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      className="input input-bordered w-full"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Select Category</span>
                    </label>
                    <select
                      name="category"
                      className="select select-bordered w-full"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      <option value="Conference">Conference</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Seminar">Seminar</option>
                      <option value="Meetup">Meetup</option>
                      <option value="Celebration">Celebration</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Status</span>
                    </label>
                    <select
                      name="status"
                      className="select select-bordered w-full"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="past">Past</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Tags (comma separated)</span>
                    </label>
                    <input
                      type="text"
                      name="tags"
                      placeholder="tech, science, workshop"
                      className="input input-bordered w-full"
                      value={formData.tags}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-control mt-4">
                  <label className="cursor-pointer label justify-start flex-wrap gap-4">
                    <span className="label-text text-wrap">
                      Mark as Featured / Upcoming Highlight?
                    </span>
                    <div className="flex items-center gap-4">
                      <input
                        style={{
                          paddingInline: "0",
                        }}
                        type="checkbox"
                        name="upcomingEvents"
                        className="toggle"
                        checked={formData.upcomingEvents}
                        onChange={handleInputChange}
                      />
                      <span className="label-text">
                        {formData.upcomingEvents ? "Yes" : "No"}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 2: Details & Contact */}
              <div className="bg-base-200 p-4 rounded-box">
                <h4 className="font-bold mb-2">Details & Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Date</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      className="input input-bordered w-full"
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Time</span>
                    </label>
                    <input
                      type="text"
                      name="time"
                      placeholder="e.g. 10:00 AM"
                      className="input input-bordered w-full"
                      value={formData.time}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Location</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Venue"
                      className="input input-bordered w-full"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Contact Phone</span>
                    </label>
                    <input
                      type="text"
                      name="contactPhone"
                      className="input input-bordered w-full"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Contact Email</span>
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      className="input input-bordered w-full"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Contact Address</span>
                    </label>
                    <input
                      type="text"
                      name="contactAddress"
                      className="input input-bordered w-full"
                      value={formData.contactAddress}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Descriptions & Media */}
              <div className="bg-base-200 p-4 rounded-box">
                <h4 className="font-bold mb-2">Description & Media</h4>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Main Image URL</span>
                  </label>
                  <input
                    type="file"
                    name="image"
                    className="file-input file-input-bordered w-full"
                    onChange={handleInputChange}
                  />
                  {formData.image && (
                    <Image
                      src={formData.image}
                      alt={`${formData.title || "Preview"} image`}
                      width={100}
                      height={100}
                      placeholder="blur"
                      blurDataURL={formData.image}
                      className="mt-2 w-32 h-32 object-cover rounded"
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Short Description*</span>
                    </label>
                    <textarea
                      name="description"
                      className="textarea textarea-bordered h-24 w-full"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">About (Extended)</span>
                    </label>
                    <textarea
                      name="about"
                      className="textarea textarea-bordered h-24 w-full"
                      value={formData.about}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Section 4: Guests */}
              <div className="bg-base-200 p-4 rounded-box">
                <h4 className="font-bold mb-2">Guests</h4>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Chief Guest */}
                  <div className="card bg-base-100 shadow-sm p-3">
                    <h5 className="font-semibold text-sm mb-2 text-primary">
                      Chief Guest
                    </h5>
                    <input
                      type="text"
                      name="chiefGuestName"
                      placeholder="Name"
                      className="input input-bordered input-sm mb-2 w-full"
                      value={formData.chiefGuestName}
                      onChange={handleInputChange}
                    />
                    <div className="">
                      <input
                        type="file"
                        name="chiefGuestImage"
                        className="file-input file-input-bordered w-full"
                        onChange={handleInputChange}
                      />
                      {formData.chiefGuestImage && (
                        <Image
                          src={formData.chiefGuestImage}
                          alt={`${formData.title || "Preview"} image`}
                          width={100}
                          height={100}
                          placeholder="blur"
                          blurDataURL={formData.chiefGuestImage}
                          className="mt-2 w-32 h-32 object-cover rounded"
                        />
                      )}
                    </div>
                    <textarea
                      name="chiefGuestDesc"
                      placeholder="Description"
                      className="textarea textarea-bordered textarea-sm w-full"
                      value={formData.chiefGuestDesc}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  {/* Special Guest */}
                  <div className="card bg-base-100 shadow-sm p-3">
                    <h5 className="font-semibold text-sm mb-2 text-secondary">
                      Special Guest
                    </h5>
                    <input
                      type="text"
                      name="specialGuestName"
                      placeholder="Name"
                      className="input input-bordered input-sm mb-2 w-full"
                      value={formData.specialGuestName}
                      onChange={handleInputChange}
                    />
                    <div className="">
                      <input
                        type="file"
                        name="specialGuestImage"
                        className="file-input file-input-bordered w-full"
                        onChange={handleInputChange}
                      />
                      {formData.specialGuestImage && (
                        <Image
                          src={formData.specialGuestImage}
                          alt={`${formData.specialGuestName || "Preview"} image`}
                          width={100}
                          height={100}
                          placeholder="blur"
                          blurDataURL={formData.specialGuestImage}
                          className="mt-2 w-32 h-32 object-cover rounded"
                        />
                      )}
                    </div>
                    <textarea
                      name="specialGuestDesc"
                      placeholder="Description"
                      className="textarea textarea-bordered textarea-sm w-full"
                      value={formData.specialGuestDesc}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  {/* Chairperson */}
                  <div className="card bg-base-100 shadow-sm p-3">
                    <h5 className="font-semibold text-sm mb-2 text-accent">
                      Chairperson
                    </h5>
                    <input
                      type="text"
                      name="chairpersonName"
                      placeholder="Name"
                      className="input input-bordered input-sm mb-2 w-full"
                      value={formData.chairpersonName}
                      onChange={handleInputChange}
                    />

                    <div className="">
                      <input
                        type="file"
                        name="chairpersonImage"
                        className="file-input file-input-bordered w-full"
                        onChange={handleInputChange}
                      />
                      {formData.chairpersonImage && (
                        <Image
                          src={formData.chairpersonImage}
                          alt={`${formData.chairpersonName || "Preview"} image`}
                          width={100}
                          height={100}
                          placeholder="blur"
                          blurDataURL={formData.chairpersonImage}
                          className="mt-2 w-32 h-32 object-cover rounded"
                        />
                      )}
                    </div>
                    <textarea
                      name="chairpersonDesc"
                      placeholder="Description"
                      className="textarea textarea-bordered textarea-sm w-full"
                      value={formData.chairpersonDesc}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Section 5: Agenda */}
              <div className="bg-base-200 p-4 rounded-box">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold">Event Agenda</h4>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={addAgendaItem}
                  >
                    <FaPlus /> Add Slot
                  </button>
                </div>
                {formData.eventAgenda.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    No agenda items added.
                  </p>
                )}
                <div className="space-y-3">
                  {formData.eventAgenda.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row gap-2 items-start bg-base-100 p-3 rounded border border-base-300"
                    >
                      <div className="flex-1 w-full">
                        <input
                          type="text"
                          placeholder="Time (e.g. 10:00 AM)"
                          className="input input-bordered input-sm w-full mb-1"
                          value={item.time}
                          onChange={(e) =>
                            updateAgendaItem(index, "time", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex-2 w-full">
                        <input
                          type="text"
                          placeholder="Title"
                          className="input input-bordered input-sm w-full mb-1"
                          value={item.title}
                          onChange={(e) =>
                            updateAgendaItem(index, "title", e.target.value)
                          }
                        />
                        <textarea
                          placeholder="Description"
                          className="textarea textarea-bordered textarea-sm w-full"
                          value={item.description}
                          onChange={(e) =>
                            updateAgendaItem(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                        ></textarea>
                      </div>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() => removeAgendaItem(index)}
                      >
                        <FaMinus />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
