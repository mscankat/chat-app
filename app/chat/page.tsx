"use client";
import { useState, useEffect, useRef } from "react";
// import { socket } from "../../utils/socket";
import Pusher from "pusher-js";
import { useAuth } from "../../utils/Context";
import Message from "../../components/Message";
import InputForm from "../../components/InputForm";
import SignOut from "../../components/SignOut";
import Loading from "../../components/Loading";
import NotLoggedIn from "../../components/NotLoggedIn";
import MoreButton from "@/components/MoreButton";
interface messageType {
  date: number;
  message: string;
  user: string;
  _id?: string;
}
export default function Chat() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [name, setName] = useState("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<messageType[]>([]);
  const [displayedMessages, setDisplayedMessages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const userURL = new URL(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/user`);
  const getURL = new URL(
    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/getMessages`
  );
  getURL.searchParams.set("skip", displayedMessages.toString());

  function scrollToBottom() {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }

  async function fetchMore(skip: number, limit: number) {
    const response = await fetch(getURL);
    const data = await response.json();
    setMessages((previous) => [...previous, ...data]);
    setDisplayedMessages((prev) => prev + data.length);
    console.log(messageRef);
  }
  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);
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
      setDisplayedMessages(data.length);
    }

    function incoming(value: messageType) {
      setMessages((previous) => [value, ...previous]);
      setDisplayedMessages((previous) => previous + 1);
      // scrollToBottom();
    }
    const pusher = new Pusher(process.env.NEXT_PUBLIC_key || "", {
      cluster: "eu",
    });
    const channel = pusher.subscribe("chat");

    channel.bind("chat-event", function (data: any) {
      console.log(typeof data);
      setMessages((previous) => [
        {
          message: data.message,
          user: data.user,
          date: data.date,
        },
        ...previous,
      ]);
      setDisplayedMessages((previous) => previous + 1);
      // setChats((prevState) => [
      //   ...prevState,
      //   { sender: data.sender, message: data.message },
      // ]);
    });

    return () => {
      pusher.unsubscribe("chat");
    };

    // socket.emit("connection");
    // socket.on("get_message", incoming);
    // socket.on("get_messages", getMessages);
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
          <div onClick={() => fetchMore(0, 0)}>
            <MoreButton
              messageRef={messageRef}
              fetchMore={fetchMore}
              messages={messages}
            />
          </div>
          <div
            className="flex-1 flex flex-col-reverse overflow-auto will-change-scroll scroll-smooth"
            ref={chatContainerRef}
          >
            {/* <div ref={messageRef}>
              <Message isOwn={false} user={"qwe"} message={"ref"} />
            </div> */}
            {messages.map((x, index) => {
              if (name === x.user) {
                return (
                  <div
                    key={x._id || x.user + x.message + x.date}
                    ref={
                      messages.indexOf(x) === messages.length - 1
                        ? messageRef
                        : null
                    }
                  >
                    <Message
                      isOwn={true}
                      user={x.user}
                      message={x.message}
                      date={x.date}
                    />
                  </div>
                );
              } else {
                return (
                  <div
                    key={x._id || x.user + x.message + x.date}
                    ref={
                      messages.indexOf(x) === messages.length - 1
                        ? messageRef
                        : null
                    }
                  >
                    <Message
                      isOwn={false}
                      user={x.user}
                      message={x.message}
                      date={x.date}
                    />
                  </div>
                );
              }
            })}
          </div>
          <InputForm scrollToBottom={scrollToBottom} name={name} />
        </div>
      </div>
    </>
  );
}
