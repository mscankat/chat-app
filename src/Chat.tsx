import { useState, useEffect } from "react";
import { socket } from "./socket";
import { useNavigate } from "react-router-dom";

interface messageType {
  date?: number;
  message: string;
  user: string;
  _id?: string;
}
export default function Chat() {
  const [name, setName] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<messageType[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(userURL, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setName(data.login);
      });
    function getMessages(data: messageType[]) {
      console.log(data);
      setMessages(data);
    }
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function incoming(value: messageType) {
      setMessages((previous) => [...previous, value]);
    }

    socket.emit("connection", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("get_message", incoming);
    socket.on("get_messages", getMessages);

    return () => {
      socket.off("connection", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const token = localStorage.getItem("token");
  const userURL = "https://api.github.com/user";

  function send(e: React.MouseEvent) {
    e.preventDefault();
    console.log(isConnected);
    const newMessage: messageType = {
      date: new Date().valueOf(),
      message: input,
      user: name,
    };
    socket.emit("chat_message", newMessage, () => {
      console.log("sent");
    });
    setInput("");
  }
  return (
    <>
      <div className=" h-screen flex items-center justify-center bg-gray-950">
        <div className="bg-gray-900 h-4/5 w-3/6 flex flex-col rounded-lg">
          <div className="flex-1 flex flex-col overflow-auto will-change-scroll">
            {messages.map((x) => {
              if (name === x.user) {
                return (
                  <div
                    key={x._id || x.user + x.message + x.date}
                    className="text-right mx-8 my-2 p-1 px-3 ml-auto rounded-xl w-fit bg-slate-300"
                  >
                    <div className="text-sm text-gray-700">{x.user}</div>
                    <div className="">{x.message}</div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={x._id || x.user + x.message + x.date}
                    className="text-left mx-8 my-2 p-1 px-3 mr-auto rounded-xl w-fit bg-slate-300"
                  >
                    <div className="text-sm text-gray-700">{x.user}</div>
                    <div className="">{x.message}</div>
                  </div>
                );
              }
            })}
          </div>
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            className=" h-11 bg-slate-200 justify-end rounded-lg px-5 mx-2 mb-3"
          />
          <button onClick={send}>Send</button>
        </div>
      </div>
    </>
  );
}
