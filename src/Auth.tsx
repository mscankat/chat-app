import { useSearchParams } from "react-router-dom";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  localStorage.setItem("code", code || "");
  const postURL = new URL("http://localhost:3001/");
  const body = { code: code };

  fetch(postURL, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((data) => data.json())
    .then((x) => console.log(x));

  return null;
}
