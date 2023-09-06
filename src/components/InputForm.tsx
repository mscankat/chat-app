import { useState } from "react";
import { socket } from "../socket";
interface messageType {
  date?: number;
  message: string;
  user: string;
  _id?: string;
}
export default function InputForm({ name }: { name: string }) {
  const [input, setInput] = useState("");

  function send(e: React.SyntheticEvent) {
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
  return (
    <form className="flex py-2 bg-gray-700 items-center" onSubmit={send}>
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        className=" h-11 bg-slate-200 justify-end rounded-lg px-5 mx-2  w-full"
        placeholder="Type here..."
      />
      <button className="mr-1 w-10 h-10 bg-white rounded-full" type="submit">
        <img className="pl-1 w-7 m-auto" src="/send_icon.png" alt="" />{" "}
      </button>
    </form>
  );
}
