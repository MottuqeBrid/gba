import mongoose from "mongoose";

const CarouselSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true },
);

const CarouselModel =
  mongoose.models.Carousel || mongoose.model("Carousel", CarouselSchema);
export default CarouselModel;
