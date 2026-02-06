// import mongoose from "mongoose";

// const MONGODB_URI = process.env.DB_URI;

// // Prevent multiple connections in dev
// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function connectMongo() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default connectMongo;
