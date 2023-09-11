import { cookies } from "next/headers";
const userURL = "https://api.github.com/user";
const userData = async (token: string | undefined) => {
  try {
    const response = await fetch(userURL, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    if (data.login) {
      return data;
    }
    return null;
  } catch (e) {
    console.log(e, "fetch error");
  }
};
export async function GET(req: Request) {
  const cookieStore = cookies();
  console.log(cookieStore);
  const accessToken = cookieStore.get("accessToken");
  console.log(accessToken);
  const user = await userData(accessToken?.value);
  console.log(user);
  let dataToSend;
  if (user) {
    dataToSend = { name: user.login };
  } else {
    return new Response(JSON.stringify({ message: "user not logged in" }), {
      status: 400,
    });
  }
  console.log(dataToSend);
  return new Response(JSON.stringify(dataToSend));
}
