"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  FaTrash,
  FaEnvelope,
  FaEnvelopeOpen,
  FaReply,
  FaEye,
  FaTimes,
} from "react-icons/fa";
import { format } from "date-fns";

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: string;
}

export default function AdminContact() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (data.success) {
        setContacts(data.data);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      Swal.fire("Error", "Failed to fetch contacts", "error");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (contact: Contact) => {
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: contact._id, isRead: true }),
      });
      const data = await res.json();
      if (data.success) {
        fetchContacts();
      }
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const toggleReplied = async (contact: Contact) => {
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: contact._id,
          isReplied: !contact.isReplied,
        }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire(
          "Updated",
          `Marked as ${!contact.isReplied ? "replied" : "not replied"}`,
          "success",
        );
        fetchContacts();
        if (selectedContact?._id === contact._id) {
          setSelectedContact({ ...contact, isReplied: !contact.isReplied });
        }
      }
    } catch (error) {
      console.error("Error updating contact:", error);
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
        const res = await fetch("/api/contact", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: id }),
        });
        const data = await res.json();

        if (data.success) {
          Swal.fire("Deleted!", "Contact has been deleted.", "success");
          fetchContacts();
          if (selectedContact?._id === id) {
            setSelectedContact(null);
          }
        } else {
          Swal.fire("Error", data.message, "error");
        }
      } catch (error) {
        console.error("Error deleting contact:", error);
        Swal.fire("Error", "Failed to delete contact", "error");
      }
    }
  };

  const viewContact = (contact: Contact) => {
    setSelectedContact(contact);
    if (!contact.isRead) {
      markAsRead(contact);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    if (filter === "unread") return !c.isRead;
    if (filter === "read") return c.isRead;
    return true;
  });

  const unreadCount = contacts.filter((c) => !c.isRead).length;

  return (
    <div className="p-4 md:p-8 min-h-screen bg-base-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Contact Messages</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-warning mt-1">
              {unreadCount} unread message{unreadCount > 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFilter("all")}
          >
            All ({contacts.length})
          </button>
          <button
            className={`btn btn-sm ${filter === "unread" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFilter("unread")}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`btn btn-sm ${filter === "read" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFilter("read")}
          >
            Read ({contacts.length - unreadCount})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact List */}
          <div className="lg:col-span-1 bg-base-100 rounded-lg shadow-xl overflow-hidden">
            <div className="max-h-[70vh] overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No messages found.
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className={`p-4 border-b border-base-200 cursor-pointer hover:bg-base-200 transition-colors ${
                      selectedContact?._id === contact._id ? "bg-base-200" : ""
                    } ${!contact.isRead ? "bg-primary/5" : ""}`}
                    onClick={() => viewContact(contact)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {contact.isRead ? (
                          <FaEnvelopeOpen className="text-base-content/50" />
                        ) : (
                          <FaEnvelope className="text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`font-semibold truncate ${
                              !contact.isRead ? "text-primary" : ""
                            }`}
                          >
                            {contact.name}
                          </p>
                          {contact.isReplied && (
                            <span className="badge badge-success badge-xs">
                              Replied
                            </span>
                          )}
                        </div>
                        <p className="text-sm truncate">{contact.subject}</p>
                        <p className="text-xs text-base-content/50 mt-1">
                          {format(
                            new Date(contact.createdAt),
                            "MMM dd, yyyy HH:mm",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contact Detail */}
          <div className="lg:col-span-2">
            {selectedContact ? (
              <div className="bg-base-100 rounded-lg shadow-xl p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedContact.subject}
                    </h2>
                    <p className="text-sm text-base-content/70 mt-1">
                      From: {selectedContact.name} ({selectedContact.email})
                    </p>
                    <p className="text-xs text-base-content/50 mt-1">
                      Received:{" "}
                      {format(
                        new Date(selectedContact.createdAt),
                        "MMMM dd, yyyy 'at' HH:mm",
                      )}
                    </p>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setSelectedContact(null)}
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="divider"></div>

                <div className="prose max-w-none mb-6">
                  <p className="whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>

                <div className="divider"></div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                    className="btn btn-primary"
                  >
                    <FaReply className="mr-2" /> Reply via Email
                  </a>
                  <button
                    className={`btn ${
                      selectedContact.isReplied ? "btn-success" : "btn-outline"
                    }`}
                    onClick={() => toggleReplied(selectedContact)}
                  >
                    {selectedContact.isReplied
                      ? "✓ Marked as Replied"
                      : "Mark as Replied"}
                  </button>
                  <button
                    className="btn btn-error btn-outline"
                    onClick={() => handleDelete(selectedContact._id)}
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-base-100 rounded-lg shadow-xl p-8 flex flex-col items-center justify-center h-64">
                <FaEye className="text-4xl text-base-content/30 mb-4" />
                <p className="text-base-content/50">
                  Select a message to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
