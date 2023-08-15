export default function Login() {
  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <div className="h-2/5 w-2/6 bg-white rounded-3xl flex flex-col justify-center items-center gap-10">
          <h2 className="text-5xl justify-start">Login</h2>
          <div className="flex flex-col  text-center">
            <input
              type="text"
              id="username"
              placeholder="username"
              className="bg-slate-500 rounded-md p-2"
            />
          </div>
          <div className="flex flex-col ">
            <input
              type="password"
              id="password"
              placeholder="password"
              className="bg-slate-500 rounded-md p-2 mb-6"
            />
          </div>
        </div>
      </div>
    </>
  );
}
