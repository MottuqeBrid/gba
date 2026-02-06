import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const GalleryModel =
  mongoose.models.Gallery || mongoose.model("Gallery", gallerySchema);

export default GalleryModel;
