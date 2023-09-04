import { useState, useEffect } from "react";
import { socket } from "./socket";
import { useAuth } from "./Context";

interface messageType {
  date?: number;
  message: string;
  user: string;
  _id?: string;
}
export default function Chat() {
  const { isLoggedIn } = useAuth();
  console.log(isLoggedIn);
  //tidy up whole component and maybe validate when sending messages
  const [name, setName] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<messageType[]>([]);
  const [loading, setLoading] = useState(true);
  const userURL = "https://localhost:3001/api/user";
  useEffect(() => {
    const getCredentials = async () => {
      try {
        const response = await fetch(userURL, { credentials: "include" });
        const data = await response.json();
        setName(data.name);
      } catch (e) {
        console.error("error fetching", e);
      } finally {
        setLoading(false);
      }
    };
    getCredentials();
    function getMessages(data: messageType[]) {
      console.log(data);
      setMessages(data);
    }

    function incoming(value: messageType) {
      setMessages((previous) => [...previous, value]);
    }

    socket.emit("connection");
    socket.on("get_message", incoming);
    socket.on("get_messages", getMessages);
  }, []);

  function send(e: React.MouseEvent) {
    e.preventDefault();
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

  return loading ? (
    <div className="flex justify-center items-center h-screen flex-col gap-5 bg-gray-200">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  ) : !isLoggedIn ? (
    <>
      <div className="flex flex-col justify-center items-center h-screen gap-5 bg-gray-300">
        <div>You are not logged in. </div>
        <a href="/" className="underline text-stone-600">
          Login Page
        </a>
      </div>
    </>
  ) : (
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
