import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_U;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define the MONGODB_URI environment variable inside .env.local");
}

// Global is used here to prevent multiple connections in dev mode
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
    console.log("MongoDB connected");
  }

  cached.conn = await cached.promise
  return cached.conn
}