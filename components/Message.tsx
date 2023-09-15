export default function Message({
  isOwn,
  user,
  message,
  date,
}: {
  isOwn: boolean;
  user: string;
  message: string;
  date: number;
}) {
  if (isOwn) {
    return (
      <div className="text-right mx-8 my-2 p-1 px-3 ml-auto rounded-xl w-fit bg-slate-300">
        <div className="text-sm text-gray-700">{user}</div>
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-black">{message}</div>
          <div className="text-xs text-gray-700 font-light ">
            {new Date(date).getHours() + ":" + new Date(date).getMinutes()}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="text-left mx-8 my-2 p-1 px-3 mr-auto rounded-xl w-fit bg-slate-300">
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-black">{message}</div>
          <div className="text-xs text-gray-700 font-light ">
            {new Date(date).getHours() + ":" + new Date(date).getMinutes()}
          </div>
        </div>
      </div>
    );
  }
}
