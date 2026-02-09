"use client";

import { useState, useEffect } from "react";
import { Metadata } from "next";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaUsers,
  FaHandshake,
  FaHeart,
  FaGraduationCap,
  FaStar,
  FaLightbulb,
  FaShieldAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";

interface CoreValue {
  title: string;
  description: string;
  icon: string;
}

interface AboutData {
  organizationName: string;
  tagline: string;
  description: string;
  mission: string;
  vision: string;
  coreValues: CoreValue[];
  contactDetails: {
    address: {
      line1: string;
      line2: string;
      city: string;
      postalCode: string;
      country: string;
    };
    phones: string[];
    emails: string[];
    mapEmbedUrl: string;
  };
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
}

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  FaUsers: <FaUsers size={28} />,
  FaHeart: <FaHeart size={28} />,
  FaGraduationCap: <FaGraduationCap size={28} />,
  FaHandshake: <FaHandshake size={28} />,
  FaStar: <FaStar size={28} />,
  FaLightbulb: <FaLightbulb size={28} />,
  FaShieldAlt: <FaShieldAlt size={28} />,
};

const colorClasses = [
  "bg-primary/10 text-primary",
  "bg-secondary/10 text-secondary",
  "bg-accent/10 text-accent",
  "bg-info/10 text-info",
  "bg-success/10 text-success",
  "bg-warning/10 text-warning",
];

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/about");
      const data = await res.json();
      if (data.success) {
        setAboutData(data.data);
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        Swal.fire("Success", data.message, "success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("Error", "Failed to send message. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="min-h-screen bg-base-100 flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">Unable to load page</h1>
        <button className="btn btn-primary" onClick={fetchAboutData}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="hero bg-base-200 py-16 md:py-24">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
              About {aboutData.organizationName || "GBA"}
            </h1>
            {aboutData.tagline && (
              <p className="text-xl text-primary font-semibold mb-4">
                {aboutData.tagline}
              </p>
            )}
            <p className="text-lg md:text-xl text-base-content/80 leading-relaxed">
              {aboutData.description}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      {(aboutData.mission || aboutData.vision) && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mission */}
              {aboutData.mission && (
                <div className="card bg-base-200 shadow-xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-primary text-primary-content p-4 rounded-full">
                      <FaHandshake size={32} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary">
                      Our Mission
                    </h2>
                  </div>
                  <p className="text-base-content/80 leading-relaxed">
                    {aboutData.mission}
                  </p>
                </div>
              )}

              {/* Vision */}
              {aboutData.vision && (
                <div className="card bg-base-200 shadow-xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-secondary text-secondary-content p-4 rounded-full">
                      <FaGraduationCap size={32} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                      Our Vision
                    </h2>
                  </div>
                  <p className="text-base-content/80 leading-relaxed">
                    {aboutData.vision}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Our Values */}
      {aboutData.coreValues && aboutData.coreValues.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-base-200">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {aboutData.coreValues.map((value, index) => (
                <div
                  key={index}
                  className="card bg-base-100 shadow-md p-6 text-center hover:shadow-xl transition-shadow"
                >
                  <div
                    className={`${
                      colorClasses[index % colorClasses.length]
                    } p-4 rounded-full w-fit mx-auto mb-4`}
                  >
                    {iconMap[value.icon] || <FaHeart size={28} />}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-base-content/70">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Contact Us
          </h2>
          <p className="text-center text-base-content/70 mb-12 max-w-2xl mx-auto">
            Have questions or want to get involved? Reach out to us through any
            of the following channels.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              {/* Address */}
              {aboutData.contactDetails?.address?.line1 && (
                <div className="card bg-base-200 p-6 flex flex-row items-start gap-4">
                  <div className="bg-primary text-primary-content p-3 rounded-full">
                    <FaMapMarkerAlt size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Address</h3>
                    <p className="text-base-content/70">
                      {aboutData.contactDetails.address.line1}
                      {aboutData.contactDetails.address.line2 && (
                        <>
                          <br />
                          {aboutData.contactDetails.address.line2}
                        </>
                      )}
                      <br />
                      {aboutData.contactDetails.address.city}
                      {aboutData.contactDetails.address.postalCode &&
                        ` - ${aboutData.contactDetails.address.postalCode}`}
                      {aboutData.contactDetails.address.country &&
                        `, ${aboutData.contactDetails.address.country}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Phone */}
              {aboutData.contactDetails?.phones &&
                aboutData.contactDetails.phones.length > 0 &&
                aboutData.contactDetails.phones[0] && (
                  <div className="card bg-base-200 p-6 flex flex-row items-start gap-4">
                    <div className="bg-secondary text-secondary-content p-3 rounded-full">
                      <FaPhone size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Phone</h3>
                      <p className="text-base-content/70">
                        {aboutData.contactDetails.phones.map(
                          (phone, index) =>
                            phone && (
                              <span key={index}>
                                <a
                                  href={`tel:${phone.replace(/\s/g, "")}`}
                                  className="hover:text-primary transition-colors"
                                >
                                  {phone}
                                </a>
                                {index <
                                  aboutData.contactDetails.phones.length -
                                    1 && <br />}
                              </span>
                            ),
                        )}
                      </p>
                    </div>
                  </div>
                )}

              {/* Email */}
              {aboutData.contactDetails?.emails &&
                aboutData.contactDetails.emails.length > 0 &&
                aboutData.contactDetails.emails[0] && (
                  <div className="card bg-base-200 p-6 flex flex-row items-start gap-4">
                    <div className="bg-accent text-accent-content p-3 rounded-full">
                      <FaEnvelope size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Email</h3>
                      <p className="text-base-content/70">
                        {aboutData.contactDetails.emails.map(
                          (email, index) =>
                            email && (
                              <span key={index}>
                                <a
                                  href={`mailto:${email}`}
                                  className="hover:text-primary transition-colors"
                                >
                                  {email}
                                </a>
                                {index <
                                  aboutData.contactDetails.emails.length -
                                    1 && <br />}
                              </span>
                            ),
                        )}
                      </p>
                    </div>
                  </div>
                )}

              {/* Social Media */}
              {aboutData.socialLinks && (
                <div className="card bg-base-200 p-6">
                  <h3 className="font-bold text-lg mb-4">Follow Us</h3>
                  <div className="flex flex-wrap gap-4">
                    {aboutData.socialLinks.facebook && (
                      <a
                        href={aboutData.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-ghost bg-base-100 hover:bg-primary hover:text-primary-content transition-colors"
                      >
                        <FaFacebook size={24} />
                      </a>
                    )}
                    {aboutData.socialLinks.twitter && (
                      <a
                        href={aboutData.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-ghost bg-base-100 hover:bg-info hover:text-info-content transition-colors"
                      >
                        <FaTwitter size={24} />
                      </a>
                    )}
                    {aboutData.socialLinks.instagram && (
                      <a
                        href={aboutData.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-ghost bg-base-100 hover:bg-secondary hover:text-secondary-content transition-colors"
                      >
                        <FaInstagram size={24} />
                      </a>
                    )}
                    {aboutData.socialLinks.linkedin && (
                      <a
                        href={aboutData.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-ghost bg-base-100 hover:bg-primary hover:text-primary-content transition-colors"
                      >
                        <FaLinkedin size={24} />
                      </a>
                    )}
                    {aboutData.socialLinks.youtube && (
                      <a
                        href={aboutData.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-ghost bg-base-100 hover:bg-error hover:text-error-content transition-colors"
                      >
                        <FaYoutube size={24} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="card bg-base-200 shadow-xl p-8">
              <h3 className="font-bold text-2xl mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Your Name *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    className="input input-bordered w-full"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email Address *</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="input input-bordered w-full"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Subject *</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="What is this about?"
                    className="input input-bordered w-full"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Message *</span>
                  </label>
                  <textarea
                    name="message"
                    className="textarea textarea-bordered h-32 w-full"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {aboutData.contactDetails?.mapEmbedUrl && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-base-200">
          <div className="max-w-7xl mx-auto">
            <div className="card bg-base-100 shadow-xl overflow-hidden">
              <div className="aspect-video w-full">
                <iframe
                  src={aboutData.contactDetails.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${aboutData.organizationName} Location`}
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
