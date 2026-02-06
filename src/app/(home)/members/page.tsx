"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaSearch,
  FaEnvelope,
  FaGlobe,
} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";

interface Member {
  _id: string;
  fullName: string;
  email: string;
  discipline: string;
  batch: string;
  position: string;
  photo: string;
  status: string;
  social: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
    website: string;
  };
}

export default function Page() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  // Fetch Members
  const fetchMembers = async () => {
    setLoading(true);
    const response = await fetch("/api/members");
    const data = await response.json();
    setMembers(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Logic to categorize members
  const executives = members.filter((m) =>
    ["President", "Vice President", "Treasurer"].includes(m.position),
  );
  const activeMembers = members.filter(
    (m) => m.status === "Active" && !executives.includes(m),
  );
  const otherMembers = members.filter((m) => m.status !== "Active"); // Or anyone else you want in the table

  // Filtering for the table (can include everyone or just "others")
  // Requirement says "table show other members", assuming non-featured ones or all in a list view
  const tableData = members.filter(
    (m) =>
      !executives.includes(m) && // Exclude executives from general table if desired, or keep them. Let's exclude for clarity based on "show other members"
      (m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.discipline.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const currentTableData = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-(--color-primary)">
          Our Community
        </h1>
        <p className="text-lg text-(--text-secondary)">
          Meet the dedicated individuals driving our mission forward.
        </p>
      </div>

      {loading && members.length === 0 ? (
        <div className="text-center">
          <Skeleton
            count={10}
            height={20}
            width={200}
            className="mx-auto mb-4"
          />
          <p className="text-lg text-(--text-secondary)">Loading...</p>
        </div>
      ) : (
        <>
          {/* 1. Top Executives Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-10 text-(--color-secondary)">
              Executive Committee
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {executives.map((exec) => (
                <div
                  key={exec._id}
                  className="card bg-base-100 shadow-xl border border-base-200 hover:border-(--color-primary) transition-all duration-300"
                >
                  <figure className="px-10 pt-10">
                    <div className="avatar">
                      <div className="w-32 h-32 rounded-full ring-4 ring-(--color-primary) ring-offset-base-100 ring-offset-2">
                        <Image
                          src={exec.photo}
                          alt={exec.fullName}
                          width={128}
                          height={128}
                          className="rounded-full"
                        />
                      </div>
                    </div>
                  </figure>
                  <div className="card-body items-center text-center">
                    <h3 className="card-title text-2xl font-bold">
                      {exec.fullName}
                    </h3>
                    <p className="text-(--color-primary) font-semibold uppercase tracking-wide text-sm">
                      {exec.position}
                    </p>
                    <div className="flex justify-between gap-2 w-full">
                      <p className="text-sm text-(--text-secondary) mt-1">
                        {exec.discipline}
                      </p>
                      <p className="text-sm text-(--text-secondary) mt-1">
                        {exec.batch}-BATCH
                      </p>
                    </div>
                    <div className="card-actions mt-4 flex gap-3 text-(--text-secondary)">
                      {exec.social.linkedin && (
                        <a
                          href={exec.social.linkedin}
                          target="_blank"
                          className="hover:text-(--color-primary)"
                        >
                          <FaLinkedin size={20} />
                        </a>
                      )}
                      {exec.social.twitter && (
                        <a
                          href={exec.social.twitter}
                          target="_blank"
                          className="hover:text-(--color-primary)"
                        >
                          <FaTwitter size={20} />
                        </a>
                      )}
                      {exec.social.facebook && (
                        <a
                          href={exec.social.facebook}
                          target="_blank"
                          className="hover:text-(--color-primary)"
                        >
                          <FaFacebook size={20} />
                        </a>
                      )}
                      {exec.social.instagram && (
                        <a
                          href={exec.social.instagram}
                          target="_blank"
                          className="hover:text-(--color-primary)"
                        >
                          <FaInstagram size={20} />
                        </a>
                      )}
                      {exec.social.website && (
                        <a
                          href={exec.social.website}
                          target="_blank"
                          className="hover:text-(--color-primary)"
                        >
                          <FaGlobe size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/* 2. Active Members Grid */}
          <section className="mb-20 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-(--color-secondary)">
                Active Members
              </h2>
              <div className="badge badge-primary badge-outline">
                {activeMembers.length} Members
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeMembers.slice(0, 8).map(
                (
                  member, // Showing top 8 active members for brevity in grid
                ) => (
                  <div
                    key={member._id}
                    className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-200"
                  >
                    <div className="card-body p-6 flex flex-row items-center gap-4">
                      <div className="avatar placeholder">
                        <div className="bg-(--color-secondary) text-neutral-content w-12 rounded-full">
                          <span className="text-xs">
                            <Image
                              width={400}
                              height={400}
                              src={member.photo}
                              alt={member.fullName}
                              className="rounded-full"
                            />
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-(--text-primary)">
                          {member.fullName}
                        </h3>
                        <p className="text-xs text-(--text-secondary)">
                          {member.discipline}
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>
          {/* 3. Searchable Table */}
          <section className="max-w-7xl mx-auto bg-base-100 rounded-xl shadow-lg border border-base-200 overflow-hidden">
            <div className="p-6 border-b border-base-200 bg-base-200/30 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-bold text-(--text-primary)">
                All Members Directory
              </h2>

              <div className="relative w-full sm:max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search members..."
                  className="input input-bordered w-full pl-10 h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table w-full">
                {/* head */}
                <thead className="bg-base-200/50 text-(--text-secondary)">
                  <tr>
                    <th>Name</th>
                    <th>Discipline</th>
                    <th>Status</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTableData.length > 0 ? (
                    currentTableData.map((member) => (
                      <tr key={member._id} className="hover">
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-10 h-10">
                                <img src={member.photo} alt={member.fullName} />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{member.fullName}</div>
                              <div className="text-xs opacity-50">
                                {member.position}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{member.discipline}</td>
                        <td>
                          <div
                            className={`badge ${member.status === "Active" ? "badge-success text-white" : "badge-ghost"} badge-sm`}
                          >
                            {member.status}
                          </div>
                        </td>
                        <td>
                          <button className="btn btn-ghost btn-xs text-(--color-primary)">
                            <FaEnvelope className="mr-1" /> Email
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 text-gray-400"
                      >
                        No members found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-base-200 flex justify-center">
              <div className="join">
                <button
                  className="join-item btn btn-sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  «
                </button>
                <button className="join-item btn btn-sm">
                  Page {currentPage} of {totalPages}
                </button>
                <button
                  className="join-item btn btn-sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="join-item btn btn-sm"
                >
                  <option value={5}>5</option>
                  {Array(Math.floor(members.length / 10))
                    .fill(0)
                    .map((_, i) => (
                      <option key={i} value={(i + 1) * 10}>
                        {(i + 1) * 10}
                      </option>
                    ))}
                  <option value={members.length}>All</option>
                </select>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
