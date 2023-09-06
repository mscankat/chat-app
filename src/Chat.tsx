import { useState, useEffect, useRef } from "react";
import { socket } from "./socket";
import { useAuth } from "./Context";
import Message from "./components/Message";
import InputForm from "./components/InputForm";
interface messageType {
  date?: number;
  message: string;
  user: string;
  _id?: string;
}
export default function Chat() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  //tidy up whole component and maybe validate when sending messages
  const [name, setName] = useState("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<messageType[]>([]);
  const [loading, setLoading] = useState(true);
  const userURL = "https://localhost:3001/api/user";
  function scrollToBottom() {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
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
        setIsLoggedIn(true);
      }
    };
    getCredentials();
    function getMessages(data: messageType[]) {
      setMessages(data);
    }

    function incoming(value: messageType) {
      setMessages((previous) => [...previous, value]);
    }

    socket.emit("connection");
    socket.on("get_message", incoming);
    socket.on("get_messages", getMessages);
  }, []);

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
          <div
            className="flex-1 flex flex-col overflow-auto will-change-scroll scroll-smooth"
            ref={chatContainerRef}
          >
            {messages.map((x) => {
              if (name === x.user) {
                return (
                  <Message
                    isOwn={true}
                    user={x.user}
                    message={x.message}
                    key={x._id || x.user + x.message + x.date}
                  />
                );
              } else {
                return (
                  <Message
                    isOwn={false}
                    user={x.user}
                    message={x.message}
                    key={x._id || x.user + x.message + x.date}
                  />
                );
              }
            })}
          </div>
          <InputForm name={name} />
        </div>
      </div>
    </>
  );
}
