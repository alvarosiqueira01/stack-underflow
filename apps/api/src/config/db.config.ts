import mongoose from "mongoose";

import { env } from "./env.config";

export async function connectToDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(env.MONGO_URI, {
    autoIndex: env.NODE_ENV !== "production",
    serverSelectionTimeoutMS: 10_000,
  });
}

export async function disconnectFromDatabase(): Promise<void> {
  await mongoose.disconnect();
}
