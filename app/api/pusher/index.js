import Pusher from "pusher";

export const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_app_id,
  key: process.env.NEXT_PUBLIC_key,
  secret: process.env.NEXT_PUBLIC_secret,
  cluster: process.env.NEXT_PUBLIC_cluster,
  useTLS: true,
});

export default async function handler(req, res) {
  const { message, sender } = req.body;
  const response = await pusher.trigger("chat", "chat-event", {
    message,
    sender,
  });

  res.json({ message: "completed" });
}
