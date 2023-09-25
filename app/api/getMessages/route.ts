import model from "@/utils/model";
import { connectDB } from "@/utils/connectDB";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const skip = parseInt(url.searchParams.get("skip") || "") || 0;
  const limit = parseInt(url.searchParams.get("limit") || "") || 10;
  await connectDB();

  const dataToSend = await model
    .aggregate()
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

  console.log(dataToSend);
  return new Response(JSON.stringify(dataToSend));
}
