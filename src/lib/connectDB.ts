import mongoose from "mongoose";

// Get MongoDB connection URI from environment variables
const DB_URI = process.env.DB_URI || "";

type MongooseConnectionCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseConnectionCache | undefined;
}

const cached: MongooseConnectionCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!DB_URI) {
    throw new Error("Missing DB_URI environment variable");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
};
