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
    });
  return (
    <>
      <div className=" h-screen flex items-center justify-center bg-gray-950">
        <div className="bg-gray-900 h-4/5 w-3/6 flex flex-col rounded-lg">
          <div className="flex-1 flex flex-col-reverse ">
            <div className="text-right m-8 p-2 px-3 ml-auto rounded-xl w-fit bg-slate-300">
              <div className="text-sm text-gray-700">{name}</div>
              <div className="">this is a message</div>
            </div>
            <div className="text-left m-8 p-2 px-3 mr-auto rounded-xl w-fit bg-slate-300">
              <div className="text-sm text-gray-700">{name}</div>
              <div className="">this is also a message</div>
            </div>
          </div>
          <input className=" h-11 bg-slate-200 justify-end rounded-lg px-5 mx-2 mb-3" />
        </div>
      </div>
    </>
  );
}
