export async function GET() {
  return new Response("success", {
    status: 200,
    headers: {
      "Set-Cookie": `accessToken=; Secure; HttpOnly; SameSite=None; Path=/`,
    },
  });
}
