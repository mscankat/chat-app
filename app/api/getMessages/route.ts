import mongoose from "mongoose";
import model from "@/utils/model";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const skip = parseInt(url.searchParams.get("skip") || "") || 0;
  const show = parseInt(url.searchParams.get("show") || "") || 10;
  const dbURL = process.env.NEXT_PUBLIC_MONGODB_URI || "";
  const connectMongo = async () => {
    await mongoose.connect(dbURL);
  };
  connectMongo();
  const database = mongoose.connection;
  database.on("error", (error) => {
    return new Response(
      JSON.stringify({ message: `error on database: ${error}` })
    );
  });

  const dataToSend = await model
    .aggregate()
    .sort({ date: -1 })
    .skip(skip)
    .limit(show);
  console.log(dataToSend);
  return new Response(JSON.stringify(dataToSend));
}
