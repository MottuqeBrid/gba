import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: [
        "advisor",
        "president",
        "vice-president",
        "secretary",
        "treasurer",
        "other",
      ],
      default: "other",
    },
    personName: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const MessageModel =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);

export default MessageModel;
