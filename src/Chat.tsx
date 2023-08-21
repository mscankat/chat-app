import { useState, useEffect } from "react";
import { socket } from "./socket";
export default function Chat() {
  const [name, setName] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function incoming(value: string) {
      setMessages((previous) => [...previous, value]);
    }

    socket.on("connection", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("get_message", incoming);

    return () => {
      socket.off("connection", onConnect);
      socket.off("disconnect", onDisconnect);
      // socket.off("foo", onFooEvent);
    };
  }, []);

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
  function send(e: React.MouseEvent) {
    e.preventDefault();
    console.log("qwe");
    socket.emit("chat_message", input, () => {
      console.log("sent");
    });
    setInput("");
  }
  return (
    <>
      <div className=" h-screen flex items-center justify-center bg-gray-950">
        <div className="bg-gray-900 h-4/5 w-3/6 flex flex-col rounded-lg">
          <div className="flex-1 flex flex-col-reverse ">
            <div className="text-right m-8 p-2 px-3 ml-auto rounded-xl w-fit bg-slate-300">
              <div className="text-sm text-gray-700">{name}</div>
              <div className="">{isConnected}</div>
            </div>
            {messages.map((x) => {
              return (
                <div className="text-left m-8 p-2 px-3 mr-auto rounded-xl w-fit bg-slate-300">
                  <div className="text-sm text-gray-700">{name}</div>
                  <div className="">{x}</div>
                </div>
              );
            })}
          </div>
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            className=" h-11 bg-slate-200 justify-end rounded-lg px-5 mx-2 mb-3"
          />
          <button onClick={send}>Connect</button>
        </div>
      </div>
    </>
  );
}
