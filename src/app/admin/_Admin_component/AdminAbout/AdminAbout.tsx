"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaSave, FaPlus, FaTrash } from "react-icons/fa";

interface CoreValue {
  title: string;
  description: string;
  icon: string;
}

interface AboutData {
  _id?: string;
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

const defaultAbout: AboutData = {
  organizationName: "",
  tagline: "",
  description: "",
  mission: "",
  vision: "",
  coreValues: [],
  contactDetails: {
    address: {
      line1: "",
      line2: "",
      city: "",
      postalCode: "",
      country: "Bangladesh",
    },
    phones: [""],
    emails: [""],
    mapEmbedUrl: "",
  },
  socialLinks: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  },
};

export default function AdminAbout() {
  const [aboutData, setAboutData] = useState<AboutData>(defaultAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/about");
      const data = await res.json();
      if (data.success && data.data) {
        setAboutData(data.data);
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
      Swal.fire("Error", "Failed to fetch about data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setAboutData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAboutData((prev) => ({
      ...prev,
      contactDetails: {
        ...prev.contactDetails,
        address: {
          ...prev.contactDetails.address,
          [name]: value,
        },
      },
    }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAboutData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...aboutData.contactDetails.phones];
    newPhones[index] = value;
    setAboutData((prev) => ({
      ...prev,
      contactDetails: {
        ...prev.contactDetails,
        phones: newPhones,
      },
    }));
  };

  const addPhone = () => {
    setAboutData((prev) => ({
      ...prev,
      contactDetails: {
        ...prev.contactDetails,
        phones: [...prev.contactDetails.phones, ""],
      },
    }));
  };

  const removePhone = (index: number) => {
    const newPhones = aboutData.contactDetails.phones.filter(
      (_, i) => i !== index,
    );
    setAboutData((prev) => ({
      ...prev,
      contactDetails: {
        ...prev.contactDetails,
        phones: newPhones.length > 0 ? newPhones : [""],
      },
    }));
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...aboutData.contactDetails.emails];
    newEmails[index] = value;
    setAboutData((prev) => ({
      ...prev,
      contactDetails: {
        ...prev.contactDetails,
        emails: newEmails,
      },
    }));
  };

  const addEmail = () => {
    setAboutData((prev) => ({
      ...prev,
      contactDetails: {
        ...prev.contactDetails,
        emails: [...prev.contactDetails.emails, ""],
      },
    }));
  };

  const removeEmail = (index: number) => {
    const newEmails = aboutData.contactDetails.emails.filter(
      (_, i) => i !== index,
    );
    setAboutData((prev) => ({
      ...prev,
      contactDetails: {
        ...prev.contactDetails,
        emails: newEmails.length > 0 ? newEmails : [""],
      },
    }));
  };

  const handleCoreValueChange = (
    index: number,
    field: keyof CoreValue,
    value: string,
  ) => {
    const newValues = [...aboutData.coreValues];
    newValues[index] = { ...newValues[index], [field]: value };
    setAboutData((prev) => ({ ...prev, coreValues: newValues }));
  };

  const addCoreValue = () => {
    setAboutData((prev) => ({
      ...prev,
      coreValues: [
        ...prev.coreValues,
        { title: "", description: "", icon: "FaHeart" },
      ],
    }));
  };

  const removeCoreValue = (index: number) => {
    const newValues = aboutData.coreValues.filter((_, i) => i !== index);
    setAboutData((prev) => ({ ...prev, coreValues: newValues }));
  };

  const handleMapUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAboutData((prev) => ({
      ...prev,
      contactDetails: {
        ...prev.contactDetails,
        mapEmbedUrl: e.target.value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/about", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aboutData),
      });
      const data = await res.json();

      if (data.success) {
        Swal.fire("Success", "About page updated successfully!", "success");
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.error("Error saving about data:", error);
      Swal.fire("Error", "Failed to save about data", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 min-h-screen bg-base-200 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-base-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">About Page Settings</h1>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <FaSave className="mr-2" />
          )}
          Save Changes
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organization Info */}
        <div className="card bg-base-100 shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">Organization Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Organization Name</span>
              </label>
              <input
                type="text"
                name="organizationName"
                className="input input-bordered w-full"
                value={aboutData.organizationName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tagline</span>
              </label>
              <input
                type="text"
                name="tagline"
                className="input input-bordered w-full"
                value={aboutData.tagline}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              className="textarea textarea-bordered h-24 w-full"
              value={aboutData.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="card bg-base-100 shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">Mission & Vision</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Mission</span>
              </label>
              <textarea
                name="mission"
                className="textarea textarea-bordered h-32 w-full"
                value={aboutData.mission}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Vision</span>
              </label>
              <textarea
                name="vision"
                className="textarea textarea-bordered h-32 w-full"
                value={aboutData.vision}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="card bg-base-100 shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Core Values</h2>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={addCoreValue}
            >
              <FaPlus className="mr-1" /> Add Value
            </button>
          </div>
          <div className="space-y-4">
            {aboutData.coreValues.map((value, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-base-200 rounded-lg"
              >
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={value.title}
                    onChange={(e) =>
                      handleCoreValueChange(index, "title", e.target.value)
                    }
                  />
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={value.description}
                    onChange={(e) =>
                      handleCoreValueChange(
                        index,
                        "description",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="form-control flex flex-row items-end gap-2">
                  <div className="flex-1">
                    <label className="label">
                      <span className="label-text">Icon</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      placeholder="FaHeart"
                      value={value.icon}
                      onChange={(e) =>
                        handleCoreValueChange(index, "icon", e.target.value)
                      }
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-error btn-sm"
                    onClick={() => removeCoreValue(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
            {aboutData.coreValues.length === 0 && (
              <p className="text-center text-base-content/50 py-4">
                No core values added. Click &quot;Add Value&quot; to add one.
              </p>
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div className="card bg-base-100 shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">Contact Details</h2>

          {/* Address */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Line 1</span>
                </label>
                <input
                  type="text"
                  name="line1"
                  className="input input-bordered w-full"
                  value={aboutData.contactDetails.address.line1}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Line 2</span>
                </label>
                <input
                  type="text"
                  name="line2"
                  className="input input-bordered w-full"
                  value={aboutData.contactDetails.address.line2}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">City</span>
                </label>
                <input
                  type="text"
                  name="city"
                  className="input input-bordered w-full"
                  value={aboutData.contactDetails.address.city}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Postal Code</span>
                </label>
                <input
                  type="text"
                  name="postalCode"
                  className="input input-bordered w-full"
                  value={aboutData.contactDetails.address.postalCode}
                  onChange={handleAddressChange}
                />
              </div>
            </div>
          </div>

          {/* Phones */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Phone Numbers</h3>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={addPhone}
              >
                <FaPlus className="mr-1" /> Add Phone
              </button>
            </div>
            <div className="space-y-2">
              {aboutData.contactDetails.phones.map((phone, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered flex-1"
                    placeholder="+880 1XXX-XXXXXX"
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-error btn-sm"
                    onClick={() => removePhone(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Emails */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Email Addresses</h3>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={addEmail}
              >
                <FaPlus className="mr-1" /> Add Email
              </button>
            </div>
            <div className="space-y-2">
              {aboutData.contactDetails.emails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="email"
                    className="input input-bordered flex-1"
                    placeholder="info@example.com"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-error btn-sm"
                    onClick={() => removeEmail(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Map URL */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Google Maps Embed URL</span>
            </label>
            <input
              type="url"
              className="input input-bordered w-full"
              placeholder="https://www.google.com/maps/embed?..."
              value={aboutData.contactDetails.mapEmbedUrl}
              onChange={handleMapUrlChange}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="card bg-base-100 shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Facebook</span>
              </label>
              <input
                type="url"
                name="facebook"
                className="input input-bordered w-full"
                placeholder="https://facebook.com/..."
                value={aboutData.socialLinks.facebook}
                onChange={handleSocialChange}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Twitter</span>
              </label>
              <input
                type="url"
                name="twitter"
                className="input input-bordered w-full"
                placeholder="https://twitter.com/..."
                value={aboutData.socialLinks.twitter}
                onChange={handleSocialChange}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Instagram</span>
              </label>
              <input
                type="url"
                name="instagram"
                className="input input-bordered w-full"
                placeholder="https://instagram.com/..."
                value={aboutData.socialLinks.instagram}
                onChange={handleSocialChange}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">LinkedIn</span>
              </label>
              <input
                type="url"
                name="linkedin"
                className="input input-bordered w-full"
                placeholder="https://linkedin.com/..."
                value={aboutData.socialLinks.linkedin}
                onChange={handleSocialChange}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">YouTube</span>
              </label>
              <input
                type="url"
                name="youtube"
                className="input input-bordered w-full"
                placeholder="https://youtube.com/..."
                value={aboutData.socialLinks.youtube}
                onChange={handleSocialChange}
              />
            </div>
          </div>
        </div>

        {/* Submit Button (Mobile) */}
        <div className="lg:hidden">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={saving}
          >
            {saving ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <FaSave className="mr-2" />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
