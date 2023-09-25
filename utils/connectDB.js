import mongoose from "mongoose";

export const connectDB = async () => {
  const dbURL = process.env.NEXT_PUBLIC_MONGODB_URI || "";
  await mongoose.connect(dbURL);
  const database = mongoose.connection;
  database.on("error", (error) => {
    throw new Error("error connecting DB", error);
  });
};
