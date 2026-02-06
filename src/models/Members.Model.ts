import mongoose from "mongoose";

const MembersSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    discipline: {
      type: String,
    },
    batch: {
      type: String,
    },
    position: {
      type: String,
    },
    photo: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    social: {
      linkedin: {
        type: String,
      },
      twitter: {
        type: String,
      },
      facebook: {
        type: String,
      },
      instagram: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Prevent model overwrite error in dev
export default mongoose.models.Members ||
  mongoose.model("Members", MembersSchema);
