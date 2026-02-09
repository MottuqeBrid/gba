import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema(
  {
    // Organization Info
    organizationName: {
      type: String,
      default: "Greater Bogura Association (GBA)",
    },
    tagline: {
      type: String,
    },
    description: {
      type: String,
    },

    // Mission & Vision
    mission: {
      type: String,
    },
    vision: {
      type: String,
    },

    // Core Values
    coreValues: [
      {
        title: String,
        description: String,
        icon: String,
      },
    ],

    // Contact Details
    contactDetails: {
      address: {
        line1: String,
        line2: String,
        city: String,
        postalCode: String,
        country: { type: String, default: "Bangladesh" },
      },
      phones: [String],
      emails: [String],
      mapEmbedUrl: String,
    },

    // Social Media Links
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
      youtube: String,
    },
  },
  { timestamps: true },
);

const AboutModel =
  mongoose.models.About || mongoose.model("About", AboutSchema);

export default AboutModel;
