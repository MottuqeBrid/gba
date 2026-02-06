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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto">
              {executives.map((exec) => (
                <div
                  key={exec._id}
                  className="card bg-base-100 shadow-xl border border-base-200 hover:border-primary transition-all duration-300 overflow-hidden"
                >
                  <figure className="px-10 pt-10">
                    <div className="avatar">
                      <div className="w-full h-full rounded-full ring-4 ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden object-cover mb-2.5">
                        <Image
                          src={exec.photo}
                          alt={exec.fullName}
                          width={600}
                          height={600}
                          className="rounded-full hover:scale-110 transition-all duration-300 hover:grayscale cursor-pointer w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </figure>
                  <div className="card-body items-center space-y-2 text-center">
                    <h3 className="card-title text-2xl font-bold hover:grayscale cursor-pointer">
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
                          className="hover:text-blue-600"
                        >
                          <FaLinkedin size={20} />
                        </a>
                      )}
                      {exec.social.twitter && (
                        <a
                          href={exec.social.twitter}
                          target="_blank"
                          className="hover:text-blue-400"
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
                          className="hover:text-pink-600"
                        >
                          <FaInstagram size={20} />
                        </a>
                      )}
                      {exec.social.website && (
                        <a
                          href={exec.social.website}
                          target="_blank"
                          className="hover:text-blue-800"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeMembers.map((member) => (
                <div
                  key={member._id}
                  className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow border border-base-200"
                >
                  <div className="card-body p-6 flex items-center gap-4">
                    <div className="">
                      <div className="text-neutral-content w-full  h-full rounded-full  bg-transparent border-accent border-6 overflow-hidden">
                        <Image
                          width={400}
                          height={400}
                          src={member.photo}
                          alt={member.fullName}
                          placeholder="blur"
                          blurDataURL={member.photo}
                          className="rounded-full hover:translate-y-2 hover:scale-110 shadow-2xl cursor-pointer hover:grayscale"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <h3 className="font-bold text-primary">
                        {member.fullName}
                      </h3>
                      <div className="flex justify-between w-full">
                        <p className="text-lg text-primary font-bold">
                          {member.position}
                        </p>
                        <p className="text-lg badge badge-success py-1 text-right">
                          <span className="border-4 border-green-100 rounded-full p-1"></span>
                          Active
                        </p>
                      </div>
                      <div className="flex justify-between w-full">
                        <p className="text-lg italic">{member.discipline}</p>
                        <p className="text-lg text-right">
                          {member.batch}-BATCH
                        </p>
                      </div>
                      {member.email && (
                        <div className="flex flex-col mt-4 gap-1 w-full overflow-hidden">
                          <a
                            href={`mailto:${member.email}`}
                            className="text-lg shadow-sm p-2 rounded-2xl bg-accent/50 shadow-black/20"
                          >
                            {member.email}
                          </a>
                        </div>
                      )}
                      <div className="flex w-full justify-around items-center my-4">
                        {member.social.linkedin && (
                          <a
                            href={member.social.linkedin}
                            className="hover:text-blue-600 hover:-rotate-8"
                            target="_blank"
                          >
                            <FaLinkedin size={20} />
                          </a>
                        )}
                        {member.social.twitter && (
                          <a
                            href={member.social.twitter}
                            target="_blank"
                            className="hover:text-blue-400 hover:-rotate-8"
                          >
                            <FaTwitter size={20} />
                          </a>
                        )}
                        {member.social.facebook && (
                          <a
                            href={member.social.facebook}
                            target="_blank"
                            className="hover:text-blue-800 hover:-rotate-8"
                          >
                            <FaFacebook size={20} />
                          </a>
                        )}
                        {member.social.instagram && (
                          <a
                            href={member.social.instagram}
                            target="_blank"
                            className="hover:text-pink-600 hover:-rotate-8"
                          >
                            <FaInstagram size={20} />
                          </a>
                        )}
                        {member.social.website && (
                          <a
                            href={member.social.website}
                            target="_blank"
                            className="hover:text-blue-800 hover:-rotate-8"
                          >
                            <FaGlobe size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                                <Image
                                  width={128}
                                  height={128}
                                  placeholder="blur"
                                  blurDataURL={member.photo}
                                  src={member.photo}
                                  alt={member.fullName}
                                />
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
                        <td>
                          {member.discipline} - {member.batch}
                        </td>
                        <td>
                          <div
                            className={`badge ${member.status === "Active" ? "badge-success text-white" : "badge-ghost"} badge-sm`}
                          >
                            {member.status}
                          </div>
                        </td>
                        <td>
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="btn btn-ghost btn-xs text-primary"
                            >
                              <FaEnvelope className="mr-1" /> Email
                            </a>
                          )}
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
