"use client";
import { useState, useEffect, useRef } from "react";
import { socket } from "../../utils/socket";
import { useAuth } from "../../utils/Context";
import Message from "../../components/Message";
import InputForm from "../../components/InputForm";
import SignOut from "../../components/SignOut";
import Loading from "../../components/Loading";
import NotLoggedIn from "../../components/NotLoggedIn";
interface messageType {
  date?: number;
  message: string;
  user: string;
  _id?: string;
}
export default function Chat() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [name, setName] = useState("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<messageType[]>([]);
  const [loading, setLoading] = useState(true);
  const userURL = new URL(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/user`);
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
        if (data.name) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (e) {
        setIsLoggedIn(false);
        console.error("error fetching", e);
      } finally {
        setLoading(false);
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
    <Loading />
  ) : !isLoggedIn ? (
    <NotLoggedIn />
  ) : (
    <>
      <SignOut name={name} />
      <div className=" h-screen flex flex-col items-center justify-center bg-gray-950">
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
