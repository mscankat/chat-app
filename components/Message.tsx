export default function Message({
  isOwn,
  user,
  message,
}: {
  isOwn: boolean;
  user: string;
  message: string;
}) {
  if (isOwn) {
    return (
      <div className="text-right mx-8 my-2 p-1 px-3 ml-auto rounded-xl w-fit bg-slate-300">
        <div className="text-sm text-gray-700">{user}</div>
        <div className="text-black">{message}</div>
      </div>
    );
  } else {
    return (
      <div className="text-left mx-8 my-2 p-1 px-3 mr-auto rounded-xl w-fit bg-slate-300">
        <div className="text-sm text-gray-700">{user}</div>
        <div className="text-black">{message}</div>
      </div>
    );
  }
}
