import { useState } from "react";

export default function Chat() {
  const [name, setName] = useState("");
  const token = localStorage.getItem("token");
  const userURL = "https://api.github.com/user";
  fetch(userURL, {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setName(data.login);
      console.log(data.login);
    });
  return (
    <>
      <div>{name}</div>
    </>
  );
}
