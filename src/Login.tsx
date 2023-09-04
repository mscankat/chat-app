import { useEffect } from "react";
import { useAuth } from "./Context";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/chat");
    }
  }, [isLoggedIn]);
  function handleClick() {
    window.open(
      getURL,
      "_blank",
      "width=600,height=800,popup=yes,left=650,top=100"
    );
  }
  const clientID = process.env.REACT_APP_CLIENT_ID || "";
  const getURL = new URL("https://github.com/login/oauth/authorize");
  getURL.searchParams.set("client_id", clientID);

  return (
    <>
      <div className="h-screen flex justify-center items-center bg-black">
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
              onChange={() => console.log(isLoggedIn)}
              type="password"
              id="password"
              placeholder="password"
              className="bg-slate-500 rounded-md p-2 mb-6"
            />
          </div>
          <div onClick={handleClick} className="cursor-pointer">
            GITHUB
          </div>
        </div>
      </div>
    </>
  );
}
