import { NextResponse } from "next/server";
import Pusher from "pusher";
import { connectDB } from "@/utils/connectDB";
import model from "@/utils/model";

const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_app_id || "",
  key: process.env.NEXT_PUBLIC_key || "",
  secret: process.env.NEXT_PUBLIC_secret || "",
  cluster: process.env.NEXT_PUBLIC_cluster || "",
  useTLS: true,
});

export async function POST(req: Request) {
  const date = new Date().valueOf();
  const request = await req.json();
  const { message, user } = request;
  await pusher.trigger("chat", "chat-event", {
    message,
    user,
    date,
  });
  await connectDB();
  const newMessage = new model({
    date: new Date().valueOf(),
    message: message,
    user: user,
  });
  await newMessage.save();

  return NextResponse.json({ message: "completed" });
}
