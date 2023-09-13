export async function POST(req: Request) {
  const request = await req.json();
  console.log(request);
  const code = request.code;
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
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
  const response = await fetch(tokenUrl, options);
  const data = await response.json();
  const accessToken = data.access_token;
  console.log(accessToken);
  return new Response("success", {
    status: 200,
    headers: {
      "Set-Cookie": `accessToken=${accessToken}; Secure; HttpOnly; SameSite=None`,
    },
  });
}
