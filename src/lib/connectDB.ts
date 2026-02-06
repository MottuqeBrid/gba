import mongoose from "mongoose";

// Get MongoDB connection URI from environment variables
const DB_URI = process.env.DB_URI || "";

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }
    await mongoose.connect(DB_URI);
  } catch (err) {
    // process.exit(1);
  }
};
