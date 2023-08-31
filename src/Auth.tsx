import { useSearchParams } from "react-router-dom";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const postURL = new URL("https://localhost:3001/api");
  const body = { code: code };

  fetch(postURL, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  })
    .then((data) => {
      return data.json();
    })
    .then((x) => localStorage.setItem("token", x))
    .then((x) =>
      fetch("https://localhost:3001/api/user", {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Content-Type": "application/json",
        },
      })
    );
  // .finally(window.close);

  return null;
}
