import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (!req.body) {
    NextResponse.json({ message: "no code provided" });
  } else {
    const body = await req.body.getReader();
    const code = body.code;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const tokenUrl = `https://github.com/login/oauth/access_token`;
    console.log(code);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        credentials: "include",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    };
  }
}
